
import logging

from flask import Flask, jsonify
from flask_cors import CORS

from .config import Config
from .extensions import db


def create_app(config_overrides=None):
    """
    Create and configure the Chima Flask application.
    """

    # 1. Create Flask application
    app = Flask(__name__)

    # 2. Load application configuration
    cfg = Config()
    app.config.from_object(cfg)

    # Apply optional configuration overrides
    if config_overrides:
        app.config.update(config_overrides)

    app.config_obj = cfg

    # 3. Validate security configuration
    secret_key = app.config.get("SECRET_KEY")

    if not secret_key:
        raise RuntimeError(
            "SECRET_KEY is missing. Configure it in your environment."
        )

    if (
        not app.config.get("TESTING")
        and secret_key.startswith(("dev-only", "change-me"))
    ):
        logging.warning(
            "SECRET_KEY is using an insecure default. "
            "Configure a strong SECRET_KEY in Render."
        )

    # 4. Configure CORS
    cors_origins = app.config.get("CORS_ORIGINS", [])

    CORS(
        app,
        origins=cors_origins,
        supports_credentials=False,
        allow_headers=[
            "Content-Type",
            "Authorization"
        ],
        methods=[
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ]
    )

    # 5. Initialize database
    db.init_app(app)

    # 6. Import and register application routes
    from .routes import admin, public

    app.register_blueprint(public)
    app.register_blueprint(admin)

    # 7. Homepage route
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "status": "success",
            "message": "Chima API is running successfully.",
            "application": "Chima Backend"
        }), 200

    # 8. Health check route
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "message": "Chima backend is operational."
        }), 200

    # 9. Security headers
    @app.after_request
    def security_headers(response):

        response.headers.setdefault(
            "X-Content-Type-Options", "nosniff"
        )

        response.headers.setdefault(
            "X-Frame-Options", "DENY"
        )

        response.headers.setdefault(
            "Referrer-Policy",
            "strict-origin-when-cross-origin"
        )

        response.headers.setdefault(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()"
        )

        return response

    # 10. Error handling
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "status": "error",
            "message": "The requested endpoint was not found."
        }), 404

    @app.errorhandler(405)
    def bad_method(error):
        return jsonify({
            "status": "error",
            "message": "Method not allowed."
        }), 405

    @app.errorhandler(413)
    def too_large(error):
        max_upload = app.config.get("MAX_UPLOAD_MB", 10)

        return jsonify({
            "status": "error",
            "message": (
                f"File too large. Maximum allowed size is "
                f"{max_upload} MB."
            )
        }), 413

    @app.errorhandler(500)
    def server_error(error):
        app.logger.exception(
            "Internal server error: %s", error
        )

        return jsonify({
            "status": "error",
            "message": (
                "Something went wrong on our side. "
                "Please try again."
            )
        }), 500

    # 11. Optional database initialization
    if app.config.get("AUTO_INIT_DATABASE", False):

        with app.app_context():
            try:
                # Import models before creating tables
                from . import models

                db.create_all()

                # Load initial application data
                from .seed import seed

                seed(cfg)

                app.logger.info(
                    "Database initialization completed successfully."
                )

            except Exception:
                app.logger.exception(
                    "Database initialization failed."
                )
                raise

    # 12. Application startup confirmation
    app.logger.info(
        "Chima Flask application initialized successfully."
    )

    return app
