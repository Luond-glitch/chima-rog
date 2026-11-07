"""Entry point.  Dev:  python wsgi.py     Production:  gunicorn wsgi:app"""
from chima import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
