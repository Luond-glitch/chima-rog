import re

from flask import Blueprint, current_app, g, jsonify, request, send_from_directory
from sqlalchemy import text

from .auth import admin_required, clear_attempts, make_token, record_attempt, throttled
from .extensions import db
from .models import RESOURCES, AdminUser, ContactMessage, Post, Setting, slugify
from .storage import UploadError, save_upload

public = Blueprint("public", __name__)
admin = Blueprint("admin", __name__, url_prefix="/api/admin")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def err(message, status=400, **extra):
    return jsonify(error=message, **extra), status


def ordered(model, query):
    return query.order_by(*[text(o) for o in (model.ORDER if hasattr(model, "ORDER") else ("id",))])


def unique_slug(model, base, exclude_id=None):
    slug, n = slugify(base), 1
    while True:
        q = model.query.filter_by(slug=slug)
        if exclude_id:
            q = q.filter(model.id != exclude_id)
        if not q.first():
            return slug
        n += 1
        slug = f"{slugify(base)}-{n}"


# ═══════════════════ PUBLIC ═══════════════════
@public.get("/api/health")
def health():
    return jsonify(status="ok")


@public.get("/uploads/<path:filename>")
def uploaded(filename):
    return send_from_directory(current_app.config["UPLOAD_DIR"], filename)


@public.get("/api/settings")
def get_settings():
    return jsonify({s.key: s.value for s in Setting.query.all()})


@public.get("/api/home")
def home():
    """One round-trip for the homepage."""
    def items(name, limit, **filters):
        model = RESOURCES[name]
        q = model.query.filter_by(**filters)
        return [i.to_dict() for i in ordered(model, q).limit(limit).all()]

    posts = Post.query.filter_by(published=True).order_by(Post.id.desc()).limit(3).all()
    return jsonify(
        programs=items("programs", 8),
        projects=items("projects", 3, featured=True),
        stats=items("stats", 8),
        partners=items("partners", 12),
        posts=[p.to_dict() for p in posts],
    )


def _list(name):
    model = RESOURCES[name]
    q = model.query
    args = request.args
    if name == "posts":
        q = q.filter_by(published=True)
        if args.get("category"):
            q = q.filter_by(category=args["category"])
    if name == "projects" and args.get("status"):
        q = q.filter_by(status=args["status"])
    if name == "projects" and args.get("featured") == "true":
        q = q.filter_by(featured=True)
    if name == "leaders" and args.get("group"):
        q = q.filter_by(group=args["group"])
    if name == "media" and args.get("kind"):
        q = q.filter_by(kind=args["kind"])
    q = ordered(model, q) if name != "posts" else q.order_by(model.id.desc())
    if name == "projects":
        q = q.order_by(model.id.desc())
    if args.get("limit", "").isdigit():
        q = q.limit(min(int(args["limit"]), 100))
    return jsonify([i.to_dict() for i in q.all()])


def _detail(name, ident):
    model = RESOURCES[name]
    item = None
    if getattr(model, "HAS_SLUG", False):
        item = model.query.filter_by(slug=ident).first()
    if not item and ident.isdigit():
        item = db.session.get(model, int(ident))
    if not item or (name == "posts" and not item.published):
        return err("Not found", 404)
    return jsonify(item.to_dict())


def _register_public():
    for name in RESOURCES:
        public.add_url_rule(f"/api/{name}", f"list_{name}", lambda name=name: _list(name))
        public.add_url_rule(f"/api/{name}/<ident>", f"detail_{name}", lambda ident, name=name: _detail(name, ident))


_register_public()


@public.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}
    if data.get("website"):  # honeypot field – real users never fill it
        return jsonify(ok=True)  # pretend success to bots
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()
    kind = data.get("kind") if data.get("kind") in ("contact", "volunteer", "partner", "support") else "contact"

    errors = {}
    if len(name) < 2:
        errors["name"] = "Please enter your name."
    if not EMAIL_RE.match(email) or len(email) > 200:
        errors["email"] = "Please enter a valid email address."
    if len(message) < 10:
        errors["message"] = "Your message should be at least 10 characters."
    if len(message) > 5000:
        errors["message"] = "Your message is too long (max 5000 characters)."
    if errors:
        return err("Please correct the highlighted fields.", 422, fields=errors)

    ip = request.remote_addr or "?"
    if throttled(f"contact:{ip}", limit=6, window=3600):
        return err("Too many submissions. Please try again later.", 429)
    record_attempt(f"contact:{ip}")

    db.session.add(ContactMessage(
        kind=kind, name=name[:160], email=email, phone=str(data.get("phone", ""))[:60],
        subject=str(data.get("subject", ""))[:200], message=message,
    ))
    db.session.commit()
    return jsonify(ok=True, message="Thank you! Your message has been received."), 201


# ═══════════════════ ADMIN ═══════════════════
@admin.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    ip = request.remote_addr or "?"
    key = f"login:{ip}"
    if throttled(key):
        return err("Too many attempts. Please wait a few minutes.", 429)
    user = AdminUser.query.filter_by(email=str(data.get("email", "")).strip().lower()).first()
    if not user or not user.check_password(str(data.get("password", ""))):
        record_attempt(key)
        return err("Incorrect email or password.", 401)
    clear_attempts(key)
    return jsonify(token=make_token(user), user={"email": user.email, "name": user.name})


@admin.get("/me")
@admin_required
def me():
    return jsonify(email=g.admin.email, name=g.admin.name)


@admin.post("/password")
@admin_required
def change_password():
    data = request.get_json(silent=True) or {}
    if not g.admin.check_password(str(data.get("current", ""))):
        return err("Current password is incorrect.", 401)
    new = str(data.get("new", ""))
    if len(new) < 10:
        return err("New password must be at least 10 characters.", 422)
    g.admin.set_password(new)
    db.session.commit()
    return jsonify(ok=True)


@admin.get("/summary")
@admin_required
def summary():
    counts = {name: model.query.count() for name, model in RESOURCES.items()}
    counts["messages"] = ContactMessage.query.count()
    counts["unread"] = ContactMessage.query.filter_by(is_read=False).count()
    counts["drafts"] = Post.query.filter_by(published=False).count()
    counts["storage"] = "supabase" if current_app.config_obj.supabase_configured else "local (Supabase keys not set)"
    return jsonify(counts)


@admin.post("/upload")
@admin_required
def upload():
    f = request.files.get("file")
    if not f:
        return err("No file received.")
    try:
        return jsonify(save_upload(f, request.form.get("folder", "general"))), 201
    except UploadError as e:
        return err(str(e), 422)


@admin.get("/settings")
@admin_required
def admin_settings():
    return jsonify({s.key: s.value for s in Setting.query.all()})


@admin.put("/settings")
@admin_required
def update_settings():
    data = request.get_json(silent=True) or {}
    for key, value in data.items():
        if not re.match(r"^[a-z0-9_]{1,80}$", str(key)):
            continue
        row = db.session.get(Setting, key) or Setting(key=key)
        row.value = str(value)
        db.session.add(row)
    db.session.commit()
    return jsonify({s.key: s.value for s in Setting.query.all()})


@admin.get("/messages")
@admin_required
def messages():
    rows = ContactMessage.query.order_by(ContactMessage.id.desc()).all()
    return jsonify([m.to_dict() for m in rows])


@admin.patch("/messages/<int:mid>")
@admin_required
def mark_message(mid):
    m = db.get_or_404(ContactMessage, mid)
    m.is_read = bool((request.get_json(silent=True) or {}).get("is_read", True))
    db.session.commit()
    return jsonify(m.to_dict())


@admin.delete("/messages/<int:mid>")
@admin_required
def delete_message(mid):
    db.session.delete(db.get_or_404(ContactMessage, mid))
    db.session.commit()
    return jsonify(ok=True)


# ── generic CRUD for every content type
def _admin_list(name):
    model = RESOURCES[name]
    q = model.query.order_by(model.id.desc()) if name in ("posts", "projects", "media", "activities") else ordered(model, model.query)
    return jsonify([i.to_dict() for i in q.all()])


def _admin_create(name):
    model = RESOURCES[name]
    data = request.get_json(silent=True) or {}
    item = model()
    item.apply(data)
    miss = item.missing()
    if miss:
        return err("Missing required fields.", 422, fields={f: "This field is required." for f in miss})
    if model.HAS_SLUG:
        item.slug = unique_slug(model, data.get("slug") or data.get("title"))
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


def _admin_update(name, iid):
    model = RESOURCES[name]
    item = db.get_or_404(model, iid)
    item.apply(request.get_json(silent=True) or {})
    miss = item.missing()
    if miss:
        db.session.rollback()
        return err("Missing required fields.", 422, fields={f: "This field is required." for f in miss})
    db.session.commit()
    return jsonify(item.to_dict())


def _admin_delete(name, iid):
    db.session.delete(db.get_or_404(RESOURCES[name], iid))
    db.session.commit()
    return jsonify(ok=True)


def _register_admin():
    for name in RESOURCES:
        admin.add_url_rule(f"/{name}", f"a_list_{name}", admin_required(lambda name=name: _admin_list(name)), methods=["GET"])
        admin.add_url_rule(f"/{name}", f"a_create_{name}", admin_required(lambda name=name: _admin_create(name)), methods=["POST"])
        admin.add_url_rule(f"/{name}/<int:iid>", f"a_update_{name}", admin_required(lambda iid, name=name: _admin_update(name, iid)), methods=["PUT"])
        admin.add_url_rule(f"/{name}/<int:iid>", f"a_delete_{name}", admin_required(lambda iid, name=name: _admin_delete(name, iid)), methods=["DELETE"])


_register_admin()
