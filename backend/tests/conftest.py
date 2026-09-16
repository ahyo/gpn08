import os
import tempfile

os.environ.setdefault("SEED_ON_STARTUP", "true")
_db_path = os.path.join(tempfile.mkdtemp(), "test.db")
os.environ["DATABASE_URL"] = f"sqlite+pysqlite:///{_db_path}"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c


def _token(client, email: str) -> str:
    res = client.post(
        "/api/v1/auth/login", data={"username": email, "password": "demo1234"}
    )
    assert res.status_code == 200, res.text
    return res.json()["access_token"]


@pytest.fixture(scope="session")
def auth_kota(client):
    return {"Authorization": f"Bearer {_token(client, 'kota@gpn08.id')}"}


@pytest.fixture(scope="session")
def auth_provinsi(client):
    return {"Authorization": f"Bearer {_token(client, 'provinsi@gpn08.id')}"}


@pytest.fixture(scope="session")
def auth_pusat(client):
    return {"Authorization": f"Bearer {_token(client, 'pusat@gpn08.id')}"}
