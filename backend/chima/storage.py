"""File storage.

Uploads go to Supabase Storage when real credentials are configured in
backend/.env (SUPABASE_URL / SUPABASE_SERVICE_KEY / SUPABASE_BUCKET).
While the placeholder keys are still in place, files are saved to
backend/uploads/ and served from /uploads/<name> so the admin panel works
during development.
"""
import uuid
from pathlib import Path

import requests
from flask import current_app
from werkzeug.utils import secure_filename

ALLOWED = {
    "image": {"jpg", "jpeg", "png", "webp", "gif", "svg"},
    "video": {"mp4", "webm", "mov"},
    "document": {"pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"},
}
MIME = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp",
    "gif": "image/gif", "svg": "image/svg+xml", "mp4": "video/mp4", "webm": "video/webm",
    "mov": "video/quicktime", "pdf": "application/pdf",
}


class UploadError(Exception):
    pass


def kind_for(ext):
    for kind, exts in ALLOWED.items():
        if ext in exts:
            return kind
    return None


def save_upload(file_storage, folder="general"):
    original = secure_filename(file_storage.filename or "")
    ext = original.rsplit(".", 1)[-1].lower() if "." in original else ""
    kind = kind_for(ext)
    if not kind:
        raise UploadError("Unsupported file type. Allowed: images, mp4/webm video, PDF and Office documents.")

    data = file_storage.read()
    if not data:
        raise UploadError("The uploaded file is empty.")

    folder = secure_filename(folder) or "general"
    name = f"{folder}/{uuid.uuid4().hex[:12]}-{original}"
    cfg = current_app.config

    if current_app.config_obj.supabase_configured:
        url = f"{cfg['SUPABASE_URL']}/storage/v1/object/{cfg['SUPABASE_BUCKET']}/{name}"
        try:
            res = requests.post(
                url,
                data=data,
                headers={
                    "Authorization": f"Bearer {cfg['SUPABASE_SERVICE_KEY']}",
                    "apikey": cfg["SUPABASE_SERVICE_KEY"],
                    "Content-Type": MIME.get(ext, file_storage.mimetype or "application/octet-stream"),
                    "x-upsert": "false",
                },
                timeout=60,
            )
        except requests.RequestException:
            raise UploadError("Could not reach Supabase Storage. Check SUPABASE_URL and your network.")
        if res.status_code >= 300:
            raise UploadError("Supabase rejected the upload. Check the service key and that the bucket exists.")
        public = f"{cfg['SUPABASE_URL']}/storage/v1/object/public/{cfg['SUPABASE_BUCKET']}/{name}"
        return {"url": public, "kind": kind, "name": original, "storage": "supabase"}

    # ── local development fallback
    target = Path(cfg["UPLOAD_DIR"]) / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return {"url": f"/uploads/{name}", "kind": kind, "name": original, "storage": "local"}
