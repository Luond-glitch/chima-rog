import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def _db_url():
    url = os.getenv("DATABASE_URL", "sqlite:///chima.db")
    if url.startswith("sqlite:///") and not url.startswith("sqlite:////"):
        # make relative sqlite paths live inside the backend folder
        url = f"sqlite:///{BASE_DIR / url.replace('sqlite:///', '')}"
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-insecure-key")
    SQLALCHEMY_DATABASE_URI = _db_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]

    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@chima.or.ke")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "ChangeMe!2026")

    SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "chima-media")

    UPLOAD_DIR = BASE_DIR / "uploads"
    MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "25"))
    MAX_CONTENT_LENGTH = MAX_UPLOAD_MB * 1024 * 1024

    JWT_HOURS = 12

    @property
    def supabase_configured(self):
        """True only when real (non-placeholder) Supabase credentials are present."""
        return bool(
            self.SUPABASE_URL
            and self.SUPABASE_SERVICE_KEY
            and "YOUR-PROJECT-REF" not in self.SUPABASE_URL
            and "REPLACE-ME" not in self.SUPABASE_SERVICE_KEY
        )