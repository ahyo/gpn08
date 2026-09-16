"""Pengisian data awal basis data untuk pengembangan dan demo."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.models import (
    CpssPoint,
    Member,
    MemberStatus,
    Notification,
    NotificationKind,
    PointCategory,
    PointHistory,
    PointStatus,
    Province,
    User,
    UserRole,
)
from app.services.seed_data import DEMO_PASSWORD, POINTS, PROVINCES, USERS

_MEMBER_ROWS = [
    ("Rizky Pratama", "JB", "Kota Bandung", "Wiraswasta", "S1", "AKTIF", 320),
    ("Anisa Rahmadani", "JK", "Jakarta Selatan", "Karyawan Swasta", "S1", "AKTIF", 298),
    ("Bagus Prakoso", "JI", "Kota Surabaya", "Teknisi", "SMA/SMK", "AKTIF", 264),
    ("Citra Maharani", "BA", "Kota Denpasar", "Pelaku UMKM", "D3", "AKTIF", 221),
    ("Dedi Kurniawan", "SU", "Kota Medan", "Mahasiswa", "SMA/SMK", "AKTIF", 190),
    ("Eka Suryani", "JT", "Kota Semarang", "Guru", "S1", "AKTIF", 176),
    ("Fajar Nugroho", "YO", "Kota Yogyakarta", "Mahasiswa", "SMA/SMK", "MENUNGGU", 12),
    ("Gita Permatasari", "JB", "Kota Bekasi", "Karyawan Swasta", "S1", "MENUNGGU", 8),
    ("Hasan Basri", "SN", "Kota Makassar", "Wiraswasta", "D3", "MENUNGGU", 5),
    ("Indah Lestari", "BT", "Kota Tangerang", "Ibu Rumah Tangga", "SMA/SMK", "MENUNGGU", 3),
]

_PIC_NAMES = [
    "Budi Santoso",
    "Andi Nugraha",
    "Sari Melati",
    "Joko Prasetyo",
    "Rina Marlina",
    "Dimas Aryo",
    "Fitri Handayani",
    "Eko Wibowo",
]
_HOURS = ["24 Jam", "06.00 – 22.00 WIB", "07.00 – 21.00 WIB", "24 Jam (dengan petugas jaga)"]


def _ago(days: int) -> datetime:
    return datetime.now(timezone.utc) - timedelta(days=days)


def seed_provinces(db: Session) -> None:
    if db.scalar(select(func.count()).select_from(Province)):
        return
    db.add_all(
        Province(code=c, name=n, island=i, capital=cap, lat=lat, lng=lng)
        for c, n, i, cap, lat, lng in PROVINCES
    )
    db.commit()


def seed_users(db: Session) -> None:
    if db.scalar(select(func.count()).select_from(User)):
        return
    db.add_all(
        User(
            email=email,
            name=name,
            password_hash=hash_password(DEMO_PASSWORD),
            role=UserRole(role),
            position=position,
            province_code=province,
            city=city,
            phone=phone,
        )
        for email, name, role, position, province, city, phone in USERS
    )
    db.commit()


def seed_points(db: Session) -> None:
    if db.scalar(select(func.count()).select_from(CpssPoint)):
        return

    pusat = db.scalar(select(User).where(User.role == UserRole.PUSAT))

    for idx, row in enumerate(POINTS):
        (
            code,
            name,
            province_code,
            city,
            district,
            lat,
            lng,
            category,
            capacity,
            connectors,
            status,
            submitter,
            days_ago,
        ) = row

        submitted_at = _ago(days_ago)
        point = CpssPoint(
            code=code,
            name=name,
            address=f"{district}, {city}",
            province_code=province_code,
            city=city,
            district=district,
            lat=lat,
            lng=lng,
            category=PointCategory(category),
            capacity_kw=capacity,
            connectors=connectors,
            operating_hours=_HOURS[idx % len(_HOURS)],
            pic_name=_PIC_NAMES[idx % len(_PIC_NAMES)],
            pic_phone=f"0812{1000 + idx:04d}{8800 + idx:04d}"[:14],
            notes="Lokasi strategis dengan akses jalan utama dan daya listrik memadai.",
            status=PointStatus(status),
            submitted_at=submitted_at,
        )
        point.history.append(
            PointHistory(
                at=submitted_at,
                actor=submitter,
                action="Pengajuan titik dibuat oleh tim lapangan",
            )
        )

        if status in ("DIVERIFIKASI", "DISETUJUI"):
            verified_at = _ago(max(0, days_ago - 2))
            point.verified_at = verified_at
            point.history.append(
                PointHistory(
                    at=verified_at,
                    actor=f"DPW {province_code}",
                    action="Verifikasi wilayah selesai",
                    note="Survei lapangan sesuai, koordinat valid.",
                )
            )

        if status == "DISETUJUI":
            approved_at = _ago(max(0, days_ago - 4))
            point.approved_at = approved_at
            point.approved_by = pusat.id if pusat else None
            point.history.append(
                PointHistory(
                    at=approved_at,
                    actor="DPP GPN 08",
                    action="Disetujui dan ditayangkan di dashboard CPSS",
                )
            )

        if status == "DITOLAK":
            point.rejected_reason = (
                "Kapasitas daya lokasi belum memenuhi standar minimum CPSS. "
                "Mohon ajukan ulang setelah peningkatan daya."
            )
            point.history.append(
                PointHistory(
                    at=_ago(max(0, days_ago - 2)),
                    actor=f"DPW {province_code}",
                    action="Ditolak pada tahap verifikasi",
                    note=point.rejected_reason,
                )
            )

        db.add(point)

    db.commit()


def seed_members(db: Session) -> None:
    if db.scalar(select(func.count()).select_from(Member)):
        return
    for idx, (name, province, city, profession, education, status, days) in enumerate(
        _MEMBER_ROWS
    ):
        db.add(
            Member(
                full_name=name,
                nik=f"32{73010101000000 + idx * 7919}"[:16],
                email=name.lower().replace(" ", ".") + "@email.com",
                phone=f"0812{3000 + idx}{7000 + idx}",
                birth_place=city.replace("Kota ", "").replace("Kab. ", ""),
                birth_date=f"19{85 + idx % 15}-0{idx % 9 + 1}-1{idx % 9}",
                gender="Perempuan" if idx % 3 == 0 else "Laki-laki",
                address=f"Jl. Merdeka No. {10 + idx}, {city}",
                province_code=province,
                city=city,
                profession=profession,
                education=education,
                interest=["Tim Lapangan CPSS", "Kaderisasi", "Humas & Media", "UMKM"][idx % 4],
                motivation=(
                    "Ingin berkontribusi pada penguatan persatuan nasional "
                    "dan kemandirian energi daerah."
                ),
                status=MemberStatus(status),
                member_number=(
                    f"GPN08-{province}-{1000 + idx}" if status == "AKTIF" else None
                ),
                registered_at=_ago(days),
            )
        )
    db.commit()


def seed_notifications(db: Session) -> None:
    if db.scalar(select(func.count()).select_from(Notification)):
        return

    for point in db.scalars(select(CpssPoint).where(CpssPoint.status == PointStatus.DIAJUKAN)):
        db.add(
            Notification(
                title="Pengajuan titik baru menunggu verifikasi",
                body=f"{point.name} ({point.city}) menunggu verifikasi DPW.",
                kind=NotificationKind.VERIFIKASI,
                target_role=UserRole.PROVINSI,
                target_province=point.province_code,
                point_id=point.id,
                created_at=point.submitted_at,
            )
        )

    for point in db.scalars(
        select(CpssPoint).where(CpssPoint.status == PointStatus.DIVERIFIKASI)
    ):
        db.add(
            Notification(
                title="Titik telah diverifikasi DPW, menunggu persetujuan DPP",
                body=f"{point.name} ({point.city}) siap disetujui.",
                kind=NotificationKind.PERSETUJUAN,
                target_role=UserRole.PUSAT,
                point_id=point.id,
                created_at=point.verified_at or point.submitted_at,
            )
        )

    db.commit()


def seed_all(db: Session) -> None:
    """Menjalankan seluruh tahap seeding secara idempoten."""
    seed_provinces(db)
    seed_users(db)
    seed_points(db)
    seed_members(db)
    seed_notifications(db)
