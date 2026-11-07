"""Database models.

Content models share a small `Content` base that knows which fields are
editable (FIELDS), which are required (REQUIRED) and how to serialise itself,
so the admin CRUD endpoints can stay generic.
"""
import re
from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


def utcnow():
    return datetime.now(timezone.utc)


def slugify(text):
    text = re.sub(r"[^a-zA-Z0-9]+", "-", (text or "").lower()).strip("-")
    return text[:80] or "item"


class Content(db.Model):
    __abstract__ = True
    FIELDS = ()
    REQUIRED = ()
    HAS_SLUG = False
    ORDER = ("id",)

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    def to_dict(self):
        out = {"id": self.id, "created_at": self.created_at.isoformat() if self.created_at else None}
        for f in self.FIELDS:
            out[f] = getattr(self, f)
        if self.HAS_SLUG:
            out["slug"] = self.slug
        return out

    def apply(self, data):
        for f in self.FIELDS:
            if f not in data:
                continue
            col = self.__table__.columns[f]
            val = data[f]
            if isinstance(col.type, db.Integer):
                try:
                    val = int(val) if val not in (None, "") else 0
                except (TypeError, ValueError):
                    val = 0
            elif isinstance(col.type, db.Boolean):
                val = val in (True, "true", "True", 1, "1", "on")
            elif isinstance(col.type, db.JSON):
                val = val if isinstance(val, (list, dict)) else []
            else:
                val = ("" if val is None else str(val)).strip()
            setattr(self, f, val)

    def missing(self):
        return [f for f in self.REQUIRED if not getattr(self, f, None)]


class Program(Content):
    FIELDS = ("title", "icon", "summary", "description", "image_url", "highlights", "sort_order")
    REQUIRED = ("title", "summary")
    HAS_SLUG = True
    ORDER = ("sort_order", "id")
    slug = db.Column(db.String(120), unique=True)
    title = db.Column(db.String(200), nullable=False)
    icon = db.Column(db.String(40), default="leaf")
    summary = db.Column(db.String(400), default="")
    description = db.Column(db.Text, default="")
    image_url = db.Column(db.String(600), default="")
    highlights = db.Column(db.JSON, default=list)
    sort_order = db.Column(db.Integer, default=0)


class Project(Content):
    FIELDS = (
        "title", "status", "summary", "overview", "objectives", "location", "activities",
        "beneficiaries", "achievements", "cover_url", "gallery", "video_url", "featured",
        "start_date", "end_date", "program",
    )
    REQUIRED = ("title", "summary")
    HAS_SLUG = True
    slug = db.Column(db.String(120), unique=True)
    title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(30), default="Ongoing")  # Ongoing | Completed | Planned
    summary = db.Column(db.String(400), default="")
    overview = db.Column(db.Text, default="")
    objectives = db.Column(db.JSON, default=list)
    location = db.Column(db.String(200), default="")
    activities = db.Column(db.JSON, default=list)
    beneficiaries = db.Column(db.String(400), default="")
    achievements = db.Column(db.JSON, default=list)  # [{"label": "...", "value": "..."}]
    cover_url = db.Column(db.String(600), default="")
    gallery = db.Column(db.JSON, default=list)
    video_url = db.Column(db.String(600), default="")
    featured = db.Column(db.Boolean, default=False)
    start_date = db.Column(db.String(20), default="")
    end_date = db.Column(db.String(20), default="")
    program = db.Column(db.String(200), default="")


class Post(Content):
    FIELDS = ("title", "category", "excerpt", "body", "cover_url", "gallery", "author",
              "event_date", "location", "published")
    REQUIRED = ("title", "excerpt")
    HAS_SLUG = True
    slug = db.Column(db.String(120), unique=True)
    title = db.Column(db.String(220), nullable=False)
    # News | Project Update | Article | Success Story | Event | Field Report
    category = db.Column(db.String(40), default="News")
    excerpt = db.Column(db.String(500), default="")
    body = db.Column(db.Text, default="")
    cover_url = db.Column(db.String(600), default="")
    gallery = db.Column(db.JSON, default=list)
    author = db.Column(db.String(120), default="CHIMA Communications")
    event_date = db.Column(db.String(20), default="")
    location = db.Column(db.String(200), default="")
    published = db.Column(db.Boolean, default=True)


class Activity(Content):
    FIELDS = ("title", "description", "activity_date", "location", "image_url", "category", "participants")
    REQUIRED = ("title",)
    ORDER = ("activity_date desc",)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default="")
    activity_date = db.Column(db.String(20), default="")
    location = db.Column(db.String(200), default="")
    image_url = db.Column(db.String(600), default="")
    category = db.Column(db.String(60), default="Community")
    participants = db.Column(db.Integer, default=0)


class Stat(Content):
    FIELDS = ("label", "value", "suffix", "icon", "description", "sort_order")
    REQUIRED = ("label",)
    ORDER = ("sort_order", "id")
    label = db.Column(db.String(120), nullable=False)
    value = db.Column(db.Integer, default=0)
    suffix = db.Column(db.String(10), default="+")
    icon = db.Column(db.String(40), default="users")
    description = db.Column(db.String(300), default="")
    sort_order = db.Column(db.Integer, default=0)


class Partner(Content):
    FIELDS = ("name", "category", "description", "logo_url", "website", "collaboration")
    REQUIRED = ("name",)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(60), default="Development Partner")
    description = db.Column(db.Text, default="")
    logo_url = db.Column(db.String(600), default="")
    website = db.Column(db.String(300), default="")
    collaboration = db.Column(db.String(400), default="")


class Leader(Content):
    """Leadership & governance. `group` separates executives from board / advisors."""
    FIELDS = ("name", "role", "group", "bio", "photo_url", "email", "phone", "linkedin", "sort_order")
    REQUIRED = ("name", "role")
    ORDER = ("sort_order", "id")
    name = db.Column(db.String(160), nullable=False)
    role = db.Column(db.String(160), nullable=False)
    group = db.Column(db.String(40), default="Executive")  # Executive | Board | Advisor | Staff
    bio = db.Column(db.Text, default="")
    photo_url = db.Column(db.String(600), default="")
    email = db.Column(db.String(160), default="")
    phone = db.Column(db.String(60), default="")
    linkedin = db.Column(db.String(300), default="")
    sort_order = db.Column(db.Integer, default=0)


class MediaItem(Content):
    FIELDS = ("title", "kind", "url", "thumbnail_url", "caption", "category")
    REQUIRED = ("title", "kind")
    title = db.Column(db.String(200), nullable=False)
    kind = db.Column(db.String(20), default="image")  # image | video | document
    url = db.Column(db.String(600), default="")
    thumbnail_url = db.Column(db.String(600), default="")
    caption = db.Column(db.String(400), default="")
    category = db.Column(db.String(60), default="Field")


class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kind = db.Column(db.String(20), default="contact")  # contact | volunteer | partner | support
    name = db.Column(db.String(160), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(60), default="")
    subject = db.Column(db.String(200), default="")
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow)

    def to_dict(self):
        return {
            "id": self.id, "kind": self.kind, "name": self.name, "email": self.email,
            "phone": self.phone, "subject": self.subject, "message": self.message,
            "is_read": self.is_read, "created_at": self.created_at.isoformat(),
        }


class Setting(db.Model):
    """Key/value organisation info (contact details, mission text, social links…)."""
    key = db.Column(db.String(80), primary_key=True)
    value = db.Column(db.Text, default="")


class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    name = db.Column(db.String(120), default="Administrator")
    password_hash = db.Column(db.String(300), nullable=False)

    def set_password(self, raw):
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.password_hash, raw)


RESOURCES = {
    "programs": Program,
    "projects": Project,
    "posts": Post,
    "activities": Activity,
    "stats": Stat,
    "partners": Partner,
    "leaders": Leader,
    "media": MediaItem,
}
