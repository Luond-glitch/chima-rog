
import re
import logging

from flask import (
    Blueprint,
    current_app,
    g,
    jsonify,
    request,
    send_from_directory,
)
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from .auth import (
    admin_required,
    clear_attempts,
    make_token,
    record_attempt,
    throttled,
)
from .extensions import db
from .models import (
    RESOURCES,
    AdminUser,
    ContactMessage,
    Post,
    Setting,
    slugify,
)
from .storage import UploadError, save_upload


# ============================================================
# BLUEPRINTS
# ============================================================

public = Blueprint("public", __name__)
admin = Blueprint("admin", __name__, url_prefix="/api/admin")


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ============================================================
# GENERAL HELPERS
# ============================================================

def err(message, status=400, **extra):
    return jsonify(
        status="error",
        error=message,
        **extra
    ), status


def ordered(model, query):
    """
    Apply the ordering defined by a model.
    Fall back to the model ID if no ORDER is defined.
    """
    order_fields = getattr(model, "ORDER", ("id",))

    return query.order_by(
        *[text(field) for field in order_fields]
    )


def unique_slug(model, base, exclude_id=None):
    """
    Generate a unique URL slug.
    """
    base_slug = slugify(base or "item")
    slug = base_slug
    counter = 1

    while True:
        query = model.query.filter_by(slug=slug)

        if exclude_id:
            query = query.filter(model.id != exclude_id)

        if not query.first():
            return slug

        counter += 1
        slug = f"{base_slug}-{counter}"


def log_exception(message):
    """
    Log the complete exception in the server logs.
    """
    current_app.logger.exception(message)


# ============================================================
# PUBLIC API
# ============================================================

@public.get("/api/health")
def health():
    return jsonify(status="ok")


# ------------------------------------------------------------
# HOMEPAGE API
# ------------------------------------------------------------

@public.get("/api/home")
def home():
    """
    Return all data required by the website homepage.

    Includes:
        - Programs
        - Featured projects
        - Statistics
        - Partners
        - Published posts
    """

    current_app.logger.info(
        "HOMEPAGE: Starting homepage API request"
    )

    try:

        def items(name, limit, **filters):
            """
            Retrieve records from a registered resource.
            """

            current_app.logger.info(
                "HOMEPAGE: Loading resource: %s", name
            )

            if name not in RESOURCES:
                raise KeyError(
                    f"Resource '{name}' is not registered."
                )

            model = RESOURCES[name]

            query = model.query.filter_by(**filters)

            records = ordered(
                model,
                query
            ).limit(limit).all()

            current_app.logger.info(
                "HOMEPAGE: %s returned %s records",
                name,
                len(records)
            )

            result = []

            for record in records:
                result.append(record.to_dict())

            return result

        # Fetch published posts separately.
        current_app.logger.info(
            "HOMEPAGE: Loading published posts"
        )

        posts = (
            Post.query
            .filter_by(published=True)
            .order_by(Post.id.desc())
            .limit(3)
            .all()
        )

        post_data = [
            post.to_dict()
            for post in posts
        ]

        # Assemble homepage response.
        homepage_data = {
            "programs": items("programs", 8),

            "projects": items(
                "projects",
                3,
                featured=True
            ),

            "stats": items("stats", 8),

            "partners": items("partners", 12),

            "posts": post_data,
        }

        current_app.logger.info(
            "HOMEPAGE: Successfully generated homepage response"
        )

        return jsonify(homepage_data)

    except Exception:
        db.session.rollback()

        log_exception(
            "HOMEPAGE API FAILURE - FULL TRACEBACK"
        )

        return err(
            "Something went wrong on our side. Please try again.",
            500
        )


# ------------------------------------------------------------
# UPLOADED FILES
# ------------------------------------------------------------

@public.get("/uploads/<path:filename>")
def uploaded(filename):
    return send_from_directory(
        current_app.config["UPLOAD_DIR"],
        filename
    )


# ------------------------------------------------------------
# PUBLIC SETTINGS
# ------------------------------------------------------------

@public.get("/api/settings")
def get_settings():
    try:
        settings = Setting.query.all()

        return jsonify({
            setting.key: setting.value
            for setting in settings
        })

    except Exception:
        db.session.rollback()
        log_exception("PUBLIC SETTINGS API FAILURE")

        return err("Unable to load settings.", 500)


# ============================================================
# GENERIC PUBLIC RESOURCE FUNCTIONS
# ============================================================

def _list(name):

    try:
        if name not in RESOURCES:
            return err("Resource not found.", 404)

        model = RESOURCES[name]

        query = model.query
        args = request.args

        if name == "posts":

            query = query.filter_by(published=True)

            if args.get("category"):
                query = query.filter_by(
                    category=args["category"]
                )

        if name == "projects":

            if args.get("status"):
                query = query.filter_by(
                    status=args["status"]
                )

            if args.get("featured") == "true":
                query = query.filter_by(
                    featured=True
                )

        if name == "leaders" and args.get("group"):

            query = query.filter_by(
                group=args["group"]
            )

        if name == "media" and args.get("kind"):

            query = query.filter_by(
                kind=args["kind"]
            )

        if name in ("posts", "projects"):
            query = query.order_by(model.id.desc())
        else:
            query = ordered(model, query)

        limit = args.get("limit", "")

        if limit.isdigit():
            query = query.limit(
                min(int(limit), 100)
            )

        records = query.all()

        return jsonify([
            record.to_dict()
            for record in records
        ])

    except Exception:
        db.session.rollback()

        log_exception(
            f"PUBLIC RESOURCE LIST FAILURE: {name}"
        )

        return err(
            "Unable to load this resource.",
            500
        )


def _detail(name, ident):

    try:
        if name not in RESOURCES:
            return err("Resource not found.", 404)

        model = RESOURCES[name]

        item = None

        if getattr(model, "HAS_SLUG", False):

            item = model.query.filter_by(
                slug=ident
            ).first()

        if not item and ident.isdigit():

            item = db.session.get(
                model,
                int(ident)
            )

        if not item:
            return err("Not found.", 404)

        if name == "posts" and not item.published:
            return err("Not found.", 404)

        return jsonify(item.to_dict())

    except Exception:
        db.session.rollback()

        log_exception(
            f"PUBLIC RESOURCE DETAIL FAILURE: {name}"
        )

        return err(
            "Unable to load this record.",
            500
        )


# ------------------------------------------------------------
# REGISTER PUBLIC RESOURCE ROUTES
# ------------------------------------------------------------

def _register_public():

    for name in RESOURCES:

        public.add_url_rule(
            f"/api/{name}",
            f"list_{name}",
            lambda name=name: _list(name),
            methods=["GET"]
        )

        public.add_url_rule(
            f"/api/{name}/<ident>",
            f"detail_{name}",
            lambda ident, name=name: _detail(name, ident),
            methods=["GET"]
        )


_register_public()


# ============================================================
# CONTACT FORM
# ============================================================

@public.post("/api/contact")
def contact():

    try:

        data = request.get_json(silent=True) or {}

        # Honeypot field for spam protection.
        if data.get("website"):
            return jsonify(ok=True)

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        message = str(data.get("message", "")).strip()

        allowed_kinds = (
            "contact",
            "volunteer",
            "partner",
            "support"
        )

        kind = (
            data.get("kind")
            if data.get("kind") in allowed_kinds
            else "contact"
        )

        errors = {}

        if len(name) < 2:
            errors["name"] = "Please enter your name."

        if not EMAIL_RE.match(email) or len(email) > 200:
            errors["email"] = "Please enter a valid email address."

        if len(message) < 10:
            errors["message"] = (
                "Your message should be at least 10 characters."
            )

        if len(message) > 5000:
            errors["message"] = (
                "Your message is too long (max 5000 characters)."
            )

        if errors:
            return err(
                "Please correct the highlighted fields.",
                422,
                fields=errors
            )

        ip = request.remote_addr or "?"

        if throttled(
            f"contact:{ip}",
            limit=6,
            window=3600
        ):
            return err(
                "Too many submissions. Please try again later.",
                429
            )

        record_attempt(f"contact:{ip}")

        new_message = ContactMessage(
            kind=kind,
            name=name[:160],
            email=email,
            phone=str(data.get("phone", ""))[:60],
            subject=str(data.get("subject", ""))[:200],
            message=message
        )

        db.session.add(new_message)
        db.session.commit()

        return jsonify(
            ok=True,
            message="Thank you! Your message has been received."
        ), 201

    except Exception:
        db.session.rollback()
        log_exception("CONTACT FORM FAILURE")

        return err(
            "Unable to submit your message. Please try again.",
            500
        )


# ============================================================
# ADMIN AUTHENTICATION
# ============================================================

@admin.post("/login")
def login():

    try:

        data = request.get_json(silent=True) or {}

        ip = request.remote_addr or "?"
        key = f"login:{ip}"

        if throttled(key):
            return err(
                "Too many attempts. Please wait a few minutes.",
                429
            )

        email = str(
            data.get("email", "")
        ).strip().lower()

        password = str(
            data.get("password", "")
        )

        user = AdminUser.query.filter_by(
            email=email
        ).first()

        if not user or not user.check_password(password):

            record_attempt(key)

            return err(
                "Incorrect email or password.",
                401
            )

        clear_attempts(key)

        return jsonify(
            token=make_token(user),
            user={
                "email": user.email,
                "name": user.name
            }
        )

    except Exception:
        db.session.rollback()
        log_exception("ADMIN LOGIN FAILURE")

        return err(
            "Unable to complete login.",
            500
        )


@admin.get("/me")
@admin_required
def me():

    return jsonify(
        email=g.admin.email,
        name=g.admin.name
    )


# ============================================================
# ADMIN PASSWORD MANAGEMENT
# ============================================================

@admin.post("/password")
@admin_required
def change_password():

    try:

        data = request.get_json(silent=True) or {}

        current_password = str(
            data.get("current", "")
        )

        new_password = str(
            data.get("new", "")
        )

        if not g.admin.check_password(current_password):
            return err(
                "Current password is incorrect.",
                401
            )

        if len(new_password) < 10:
            return err(
                "New password must be at least 10 characters.",
                422
            )

        g.admin.set_password(new_password)

        db.session.commit()

        return jsonify(ok=True)

    except Exception:
        db.session.rollback()
        log_exception("PASSWORD CHANGE FAILURE")

        return err(
            "Unable to change password.",
            500
        )


# ============================================================
# ADMIN DASHBOARD SUMMARY
# ============================================================

@admin.get("/summary")
@admin_required
def summary():

    try:

        counts = {
            name: model.query.count()
            for name, model in RESOURCES.items()
        }

        counts["messages"] = ContactMessage.query.count()

        counts["unread"] = (
            ContactMessage.query
            .filter_by(is_read=False)
            .count()
        )

        counts["drafts"] = (
            Post.query
            .filter_by(published=False)
            .count()
        )

        counts["storage"] = (
            "supabase"
            if current_app.config_obj.supabase_configured
            else "local (Supabase keys not set)"
        )

        return jsonify(counts)

    except Exception:
        db.session.rollback()
        log_exception("ADMIN SUMMARY FAILURE")

        return err(
            "Unable to load dashboard summary.",
            500
        )


# ============================================================
# ADMIN FILE UPLOAD
# ============================================================

@admin.post("/upload")
@admin_required
def upload():

    try:

        file = request.files.get("file")

        if not file:
            return err("No file received.")

        result = save_upload(
            file,
            request.form.get("folder", "general")
        )

        return jsonify(result), 201

    except UploadError as error:

        return err(str(error), 422)

    except Exception:
        db.session.rollback()
        log_exception("ADMIN UPLOAD FAILURE")

        return err(
            "Unable to upload the file.",
            500
        )


# ============================================================
# ADMIN SETTINGS
# ============================================================

@admin.get("/settings")
@admin_required
def admin_settings():

    try:

        settings = Setting.query.all()

        return jsonify({
            setting.key: setting.value
            for setting in settings
        })

    except Exception:
        db.session.rollback()
        log_exception("ADMIN SETTINGS FAILURE")

        return err(
            "Unable to load settings.",
            500
        )


@admin.put("/settings")
@admin_required
def update_settings():

    try:

        data = request.get_json(silent=True) or {}

        for key, value in data.items():

            if not re.match(
                r"^[a-z0-9_]{1,80}$",
                str(key)
            ):
                continue

            row = db.session.get(
                Setting,
                key
            )

            if row is None:
                row = Setting(key=key)

            row.value = str(value)

            db.session.add(row)

        db.session.commit()

        settings = Setting.query.all()

        return jsonify({
            setting.key: setting.value
            for setting in settings
        })

    except Exception:
        db.session.rollback()
        log_exception("SETTINGS UPDATE FAILURE")

        return err(
            "Unable to update settings.",
            500
        )


# ============================================================
# ADMIN CONTACT MESSAGES
# ============================================================

@admin.get("/messages")
@admin_required
def messages():

    try:

        rows = (
            ContactMessage.query
            .order_by(ContactMessage.id.desc())
            .all()
        )

        return jsonify([
            message.to_dict()
            for message in rows
        ])

    except Exception:
        db.session.rollback()
        log_exception("ADMIN MESSAGES FAILURE")

        return err(
            "Unable to retrieve messages.",
            500
        )


@admin.patch("/messages/<int:mid>")
@admin_required
def mark_message(mid):

    try:

        message = db.get_or_404(
            ContactMessage,
            mid
        )

        data = request.get_json(silent=True) or {}

        message.is_read = bool(
            data.get("is_read", True)
        )

        db.session.commit()

        return jsonify(message.to_dict())

    except Exception:
        db.session.rollback()
        log_exception("MARK MESSAGE FAILURE")

        return err(
            "Unable to update message.",
            500
        )


@admin.delete("/messages/<int:mid>")
@admin_required
def delete_message(mid):

    try:

        message = db.get_or_404(
            ContactMessage,
            mid
        )

        db.session.delete(message)

        db.session.commit()

        return jsonify(ok=True)

    except Exception:
        db.session.rollback()
        log_exception("DELETE MESSAGE FAILURE")

        return err(
            "Unable to delete message.",
            500
        )


# ============================================================
# GENERIC ADMIN CRUD
# ============================================================

def _admin_list(name):

    try:

        if name not in RESOURCES:
            return err("Resource not found.", 404)

        model = RESOURCES[name]

        if name in (
            "posts",
            "projects",
            "media",
            "activities"
        ):
            query = model.query.order_by(model.id.desc())
        else:
            query = ordered(model, model.query)

        records = query.all()

        return jsonify([
            record.to_dict()
            for record in records
        ])

    except Exception:
        db.session.rollback()
        log_exception(
            f"ADMIN RESOURCE LIST FAILURE: {name}"
        )

        return err(
            "Unable to load records.",
            500
        )


def _admin_create(name):

    try:

        if name not in RESOURCES:
            return err("Resource not found.", 404)

        model = RESOURCES[name]

        data = request.get_json(silent=True) or {}

        item = model()

        item.apply(data)

        missing = item.missing()

        if missing:

            return err(
                "Missing required fields.",
                422,
                fields={
                    field: "This field is required."
                    for field in missing
                }
            )

        if getattr(model, "HAS_SLUG", False):

            item.slug = unique_slug(
                model,
                data.get("slug") or data.get("title")
            )

        db.session.add(item)

        db.session.commit()

        return jsonify(item.to_dict()), 201

    except Exception:
        db.session.rollback()
        log_exception(
            f"ADMIN RESOURCE CREATE FAILURE: {name}"
        )

        return err(
            "Unable to create record.",
            500
        )


def _admin_update(name, iid):

    try:

        if name not in RESOURCES:
            return err("Resource not found.", 404)

        model = RESOURCES[name]

        item = db.get_or_404(
            model,
            iid
        )

        item.apply(
            request.get_json(silent=True) or {}
        )

        missing = item.missing()

        if missing:

            db.session.rollback()

            return err(
                "Missing required fields.",
                422,
                fields={
                    field: "This field is required."
                    for field in missing
                }
            )

        db.session.commit()

        return jsonify(item.to_dict())

    except Exception:
        db.session.rollback()
        log_exception(
            f"ADMIN RESOURCE UPDATE FAILURE: {name}"
        )

        return err(
            "Unable to update record.",
            500
        )


def _admin_delete(name, iid):

    try:

        if name not in RESOURCES:
            return err("Resource not found.", 404)

        model = RESOURCES[name]

        item = db.get_or_404(
            model,
            iid
        )

        db.session.delete(item)

        db.session.commit()

        return jsonify(ok=True)

    except Exception:
        db.session.rollback()
        log_exception(
            f"ADMIN RESOURCE DELETE FAILURE: {name}"
        )

        return err(
            "Unable to delete record.",
            500
        )


# ============================================================
# REGISTER ADMIN CRUD ROUTES
# ============================================================

def _register_admin():

    for name in RESOURCES:

        admin.add_url_rule(
            f"/{name}",
            f"a_list_{name}",
            admin_required(
                lambda name=name: _admin_list(name)
            ),
            methods=["GET"]
        )

        admin.add_url_rule(
            f"/{name}",
            f"a_create_{name}",
            admin_required(
                lambda name=name: _admin_create(name)
            ),
            methods=["POST"]
        )

        admin.add_url_rule(
            f"/{name}/<int:iid>",
            f"a_update_{name}",
            admin_required(
                lambda iid, name=name: _admin_update(name, iid)
            ),
            methods=["PUT"]
        )

        admin.add_url_rule(
            f"/{name}/<int:iid>",
            f"a_delete_{name}",
            admin_required(
                lambda iid, name=name: _admin_delete(name, iid)
            ),
            methods=["DELETE"]
        )


_register_admin()
