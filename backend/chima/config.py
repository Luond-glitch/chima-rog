
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import make_url


# ============================================================
# BASE DIRECTORY AND ENVIRONMENT VARIABLES
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Load local .env file during development.
# Render environment variables take precedence over .env values.
load_dotenv(BASE_DIR / ".env", override=False)


# ============================================================
# DATABASE CONFIGURATION
# ============================================================

def _db_url():
    """
    Resolve the database connection URL.

    Production:
        Supabase PostgreSQL

    Local development:
        SQLite database inside the backend folder
    """

    url = os.getenv("DATABASE_URL", "").strip()

    # Use SQLite locally if DATABASE_URL is not configured.
    if not url:
        url = "sqlite:///chima.db"

    # Convert legacy PostgreSQL URL scheme.
    if url.startswith("postgres://"):
        url = url.replace(
            "postgres://",
            "postgresql://",
            1
        )

    # Make relative SQLite paths absolute.
    if url.startswith("sqlite:///") and not url.startswith("sqlite:////"):

        database_path = BASE_DIR / url.replace(
            "sqlite:///",
            "",
            1
        )

        url = f"sqlite:///{database_path}"

    # Configure PostgreSQL connections.
    if url.startswith("postgresql://"):

        parsed_url = make_url(url)

        # Supabase PostgreSQL requires SSL.
        if "sslmode" not in parsed_url.query:

            parsed_url = parsed_url.update_query_dict({
                "sslmode": "require"
            })

        url = parsed_url.render_as_string(
            hide_password=False
        )

    return url


# ============================================================
# FLASK APPLICATION CONFIGURATION
# ============================================================

class Config:

    # --------------------------------------------------------
    # SECURITY
    # --------------------------------------------------------

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "dev-only-insecure-key"
    )

    # --------------------------------------------------------
    # DATABASE
    # --------------------------------------------------------

    SQLALCHEMY_DATABASE_URI = _db_url()

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

    # --------------------------------------------------------
    # CORS
    # --------------------------------------------------------

    CORS_ORIGINS = [
        origin.strip().rstrip("/")
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,https://chima-cbo.vercel.app"
        ).split(",")
        if origin.strip()
    ]

    # --------------------------------------------------------
    # ADMINISTRATOR CONFIGURATION
    # --------------------------------------------------------

    ADMIN_EMAIL = os.getenv(
        "ADMIN_EMAIL",
        "admin@chima.or.ke"
    )

    ADMIN_PASSWORD = os.getenv(
        "ADMIN_PASSWORD",
        "ChangeMe!2026"
    )

    # --------------------------------------------------------
    # SUPABASE STORAGE CONFIGURATION
    # --------------------------------------------------------

    SUPABASE_URL = os.getenv(
        "SUPABASE_URL",
        ""
    ).rstrip("/")

    SUPABASE_SERVICE_KEY = os.getenv(
        "SUPABASE_SERVICE_KEY",
        ""
    )

    SUPABASE_BUCKET = os.getenv(
        "SUPABASE_BUCKET",
        "chima-media"
    )

    # --------------------------------------------------------
    # FILE UPLOAD CONFIGURATION
    # --------------------------------------------------------

    UPLOAD_DIR = BASE_DIR / "uploads"

    MAX_UPLOAD_MB = int(
        os.getenv("MAX_UPLOAD_MB", "25")
    )

    MAX_CONTENT_LENGTH = (
        MAX_UPLOAD_MB * 1024 * 1024
    )

    # --------------------------------------------------------
    # AUTHENTICATION
    # --------------------------------------------------------

    JWT_HOURS = 12

    # --------------------------------------------------------
    # DATABASE INITIALIZATION
    # --------------------------------------------------------

    AUTO_INIT_DATABASE = (
        os.getenv("AUTO_INIT_DATABASE", "false").lower()
        in ("true", "1", "yes")
    )

    # --------------------------------------------------------
    # SUPABASE CONFIGURATION CHECK
    # --------------------------------------------------------

    @property
    def supabase_configured(self):
        """
        Check whether valid-looking Supabase Storage
        credentials have been provided.
        """

        return bool(
            self.SUPABASE_URL
            and self.SUPABASE_SERVICE_KEY
            and "YOUR-PROJECT-REF" not in self.SUPABASE_URL
            and "REPLACE-ME" not in self.SUPABASE_SERVICE_KEY
        )
