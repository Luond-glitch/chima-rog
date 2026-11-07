import time
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import current_app, g, jsonify, request

from .extensions import db
from .models import AdminUser


def make_token(user):
    exp = datetime.now(timezone.utc) + timedelta(hours=current_app.config["JWT_HOURS"])
    return jwt.encode({"sub": str(user.id), "exp": exp}, current_app.config["SECRET_KEY"], algorithm="HS256")


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify(error="Authentication required"), 401
        try:
            payload = jwt.decode(header[7:], current_app.config["SECRET_KEY"], algorithms=["HS256"])
            user = db.session.get(AdminUser, int(payload["sub"]))
        except (jwt.PyJWTError, ValueError, KeyError):
            return jsonify(error="Invalid or expired session"), 401
        if not user:
            return jsonify(error="Invalid or expired session"), 401
        g.admin = user
        return fn(*args, **kwargs)

    return wrapper


# ── very small in-memory throttle (per IP). Use Redis / Flask-Limiter when scaling out.
_attempts = {}


def throttled(key, limit=8, window=300):
    now = time.time()
    hits = [t for t in _attempts.get(key, []) if now - t < window]
    _attempts[key] = hits
    return len(hits) >= limit


def record_attempt(key):
    _attempts.setdefault(key, []).append(time.time())


def clear_attempts(key):
    _attempts.pop(key, None)
