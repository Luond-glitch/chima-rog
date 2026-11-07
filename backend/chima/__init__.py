import logging

from flask import Flask, jsonify
from flask_cors import CORS

from .config import Config
from .extensions import db


def create_app(config_overrides=None):
    app = Flask(__name__)
    cfg = Config()
    app.config_obj = cfg
    app.config.from_object(Config)
    if config_overrides:
        app.config.update(config_overrides)

    if not app.config.get("TESTING") and app.config["SECRET_KEY"].startswith(("dev-only", "change-me")):
        logging.warning("SECRET_KEY is the insecure default – set a strong one in backend/.env before deploying!")

    CORS(app, origins=app.config["CORS_ORIGINS"], supports_credentials=False)
    db.init_app(app)

    from .routes import admin, public
    app.register_blueprint(public)
    app.register_blueprint(admin)

    @app.after_request
    def security_headers(resp):
        resp.headers.setdefault("X-Content-Type-Options", "nosniff")
        resp.headers.setdefault("X-Frame-Options", "DENY")
        resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        return resp

    @app.errorhandler(404)
    def not_found(_):
        return jsonify(error="Not found"), 404

    @app.errorhandler(405)
    def bad_method(_):
        return jsonify(error="Method not allowed"), 405

    @app.errorhandler(413)
    def too_large(_):
        return jsonify(error=f"File too large (max {app.config['MAX_UPLOAD_MB']} MB)."), 413

    @app.errorhandler(500)
    def server_error(_):
        return jsonify(error="Something went wrong on our side. Please try again."), 500

    with app.app_context():
        from .seed import seed
        db.create_all()
        seed(cfg)

    return app
