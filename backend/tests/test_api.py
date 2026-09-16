"""Uji alur utama API GPN 08."""


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_provinces_seeded(client):
    res = client.get("/api/v1/provinces")
    assert res.status_code == 200
    assert len(res.json()) == 38


def test_login_invalid_credentials(client):
    res = client.post(
        "/api/v1/auth/login", data={"username": "pusat@gpn08.id", "password": "salah"}
    )
    assert res.status_code == 401


def test_public_points_only_approved(client):
    res = client.get("/api/v1/points/public")
    assert res.status_code == 200
    assert all(p["status"] == "DISETUJUI" for p in res.json())
    assert len(res.json()) > 0


def test_points_require_auth(client):
    assert client.get("/api/v1/points").status_code == 401


def test_kota_scope_is_limited(client, auth_kota):
    res = client.get("/api/v1/points", headers=auth_kota)
    assert res.status_code == 200
    assert {p["city"] for p in res.json()} <= {"Kota Bandung"}


NEW_POINT = {
    "name": "CPSS Uji Coba Dago Atas",
    "province_code": "JB",
    "city": "Kota Bandung",
    "district": "Coblong",
    "address": "Jl. Ir. H. Juanda No. 200",
    "lat": -6.8712,
    "lng": 107.6132,
    "category": "SPKLU",
    "capacity_kw": 120,
    "connectors": 3,
    "operating_hours": "24 Jam",
    "pic_name": "Agus Firmansyah",
    "pic_phone": "08132208201",
    "notes": "Lahan milik komunitas, daya 3 fase tersedia.",
}


def test_full_approval_flow(client, auth_kota, auth_provinsi, auth_pusat):
    # 1. DPD mengajukan titik baru
    created = client.post("/api/v1/points", json=NEW_POINT, headers=auth_kota)
    assert created.status_code == 201, created.text
    point = created.json()
    assert point["status"] == "DIAJUKAN"
    point_id = point["id"]

    # Titik belum tayang di peta publik
    public_ids = {p["id"] for p in client.get("/api/v1/points/public").json()}
    assert point_id not in public_ids

    # 2. DPP belum boleh menyetujui sebelum diverifikasi DPW
    premature = client.post(
        f"/api/v1/points/{point_id}/approve", json={}, headers=auth_pusat
    )
    assert premature.status_code == 409

    # DPD tidak berwenang memverifikasi
    assert (
        client.post(f"/api/v1/points/{point_id}/verify", json={}, headers=auth_kota).status_code
        == 403
    )

    # 3. DPW memverifikasi
    verified = client.post(
        f"/api/v1/points/{point_id}/verify",
        json={"note": "Survei lapangan sesuai."},
        headers=auth_provinsi,
    )
    assert verified.status_code == 200
    assert verified.json()["status"] == "DIVERIFIKASI"

    # DPP menerima notifikasi persetujuan
    notifs = client.get("/api/v1/notifications", headers=auth_pusat).json()
    assert any(n["point_id"] == point_id and n["kind"] == "PERSETUJUAN" for n in notifs)

    # 4. DPP menyetujui
    approved = client.post(
        f"/api/v1/points/{point_id}/approve", json={}, headers=auth_pusat
    )
    assert approved.status_code == 200
    assert approved.json()["status"] == "DISETUJUI"
    assert len(approved.json()["history"]) == 3

    # 5. Titik kini tayang di peta publik
    public_ids = {p["id"] for p in client.get("/api/v1/points/public").json()}
    assert point_id in public_ids


def test_reject_flow(client, auth_kota, auth_provinsi):
    payload = dict(NEW_POINT, name="CPSS Uji Coba Penolakan")
    point_id = client.post("/api/v1/points", json=payload, headers=auth_kota).json()["id"]

    short = client.post(
        f"/api/v1/points/{point_id}/reject", json={"reason": "tidak"}, headers=auth_provinsi
    )
    assert short.status_code == 422

    rejected = client.post(
        f"/api/v1/points/{point_id}/reject",
        json={"reason": "Daya listrik lokasi belum memenuhi standar minimum."},
        headers=auth_provinsi,
    )
    assert rejected.status_code == 200
    assert rejected.json()["status"] == "DITOLAK"


def test_member_registration_and_verification(client, auth_provinsi):
    member = {
        "full_name": "Sinta Dewi Lestari",
        "nik": "3273010101990123",
        "email": "sinta.dewi@email.com",
        "phone": "08123456789",
        "birth_place": "Bandung",
        "birth_date": "1999-01-01",
        "gender": "Perempuan",
        "address": "Jl. Sukajadi No. 45, Kota Bandung",
        "province_code": "JB",
        "city": "Kota Bandung",
        "profession": "Wiraswasta",
        "education": "S1",
        "interest": "Tim Lapangan CPSS",
        "motivation": "Ingin ikut membangun kemandirian energi di daerah saya.",
    }
    created = client.post("/api/v1/members", json=member)
    assert created.status_code == 201, created.text
    assert created.json()["status"] == "MENUNGGU"
    member_id = created.json()["id"]

    # NIK ganda ditolak
    assert client.post("/api/v1/members", json=member).status_code == 409

    activated = client.patch(
        f"/api/v1/members/{member_id}/status",
        json={"status": "AKTIF"},
        headers=auth_provinsi,
    )
    assert activated.status_code == 200
    assert activated.json()["member_number"].startswith("GPN08-JB-")


def test_summary_stats(client):
    data = client.get("/api/v1/stats/summary").json()
    assert data["approved_points"] > 0
    assert data["provinces_covered"] > 0
    assert data["total_capacity_kw"] > 0
