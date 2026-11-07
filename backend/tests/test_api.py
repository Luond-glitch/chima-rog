import io
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from chima import create_app  # noqa: E402


@pytest.fixture()
def client(tmp_path):
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{tmp_path/'t.db'}",
        "UPLOAD_DIR": tmp_path / "uploads",
    })
    return app.test_client()


@pytest.fixture()
def auth(client):
    r = client.post("/api/admin/login", json={"email": "admin@chima.or.ke", "password": "ChangeMe!2026"})
    assert r.status_code == 200
    return {"Authorization": "Bearer " + r.get_json()["token"]}


def test_public_endpoints_seeded(client):
    assert client.get("/api/health").get_json()["status"] == "ok"
    for name, minimum in [("programs", 8 - 1), ("projects", 6), ("posts", 6), ("stats", 8), ("leaders", 5), ("media", 10)]:
        data = client.get(f"/api/{name}").get_json()
        assert len(data) >= minimum, name
    home = client.get("/api/home").get_json()
    assert home["stats"] and home["projects"]
    assert client.get("/api/settings").get_json()["email"]


def test_project_detail_by_slug(client):
    first = client.get("/api/projects").get_json()[0]
    r = client.get(f"/api/projects/{first['slug']}")
    assert r.status_code == 200 and r.get_json()["id"] == first["id"]
    assert client.get("/api/projects/does-not-exist").status_code == 404


def test_contact_validation_and_save(client, auth):
    bad = client.post("/api/contact", json={"name": "A", "email": "nope", "message": "hi"})
    assert bad.status_code == 422 and set(bad.get_json()["fields"]) == {"name", "email", "message"}
    ok = client.post("/api/contact", json={"name": "Amina", "email": "a@b.co", "message": "Hello CHIMA team!"})
    assert ok.status_code == 201
    msgs = client.get("/api/admin/messages", headers=auth).get_json()
    assert msgs[0]["name"] == "Amina"
    # honeypot is silently accepted but not stored
    client.post("/api/contact", json={"name": "Bot", "email": "b@b.co", "message": "spam spam spam", "website": "x"})
    assert len(client.get("/api/admin/messages", headers=auth).get_json()) == 1


def test_admin_requires_auth(client):
    assert client.get("/api/admin/messages").status_code == 401
    assert client.post("/api/admin/projects", json={"title": "x"}).status_code == 401
    bad = client.post("/api/admin/login", json={"email": "admin@chima.or.ke", "password": "wrong"})
    assert bad.status_code == 401


def test_admin_crud_and_drafts(client, auth):
    r = client.post("/api/admin/posts", headers=auth,
                    json={"title": "Draft story", "excerpt": "Short summary", "published": False})
    assert r.status_code == 201
    pid, slug = r.get_json()["id"], r.get_json()["slug"]
    assert client.get(f"/api/posts/{slug}").status_code == 404  # drafts are hidden
    client.put(f"/api/admin/posts/{pid}", headers=auth, json={"published": True})
    assert client.get(f"/api/posts/{slug}").status_code == 200
    assert client.post("/api/admin/posts", headers=auth, json={"title": ""}).status_code == 422
    assert client.delete(f"/api/admin/posts/{pid}", headers=auth).status_code == 200
    assert client.get(f"/api/posts/{slug}").status_code == 404


def test_leader_management(client, auth):
    r = client.post("/api/admin/leaders", headers=auth,
                    json={"name": "Jane Doe", "role": "Treasurer", "group": "Executive", "bio": "Bio"})
    assert r.status_code == 201
    names = [l["name"] for l in client.get("/api/leaders?group=Executive").get_json()]
    assert "Jane Doe" in names


def test_upload_local_fallback(client, auth):
    r = client.post("/api/admin/upload", headers=auth, content_type="multipart/form-data",
                    data={"file": (io.BytesIO(b"\x89PNG fake"), "photo.png"), "folder": "stories"})
    assert r.status_code == 201 and r.get_json()["storage"] == "local"
    url = r.get_json()["url"]
    assert client.get(url).status_code == 200
    bad = client.post("/api/admin/upload", headers=auth, content_type="multipart/form-data",
                      data={"file": (io.BytesIO(b"MZ"), "virus.exe")})
    assert bad.status_code == 422


def test_settings_update(client, auth):
    client.put("/api/admin/settings", headers=auth, json={"phone": "+254 711 111 111"})
    assert client.get("/api/settings").get_json()["phone"] == "+254 711 111 111"
