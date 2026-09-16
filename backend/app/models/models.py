"""Model ORM untuk basis data GPN 08."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class UserRole(str, enum.Enum):
    """Jenjang kepengurusan yang menentukan hak akses."""

    PUSAT = "PUSAT"
    PROVINSI = "PROVINSI"
    KOTA = "KOTA"
    ANGGOTA = "ANGGOTA"


class PointStatus(str, enum.Enum):
    """Status pengajuan titik pada alur persetujuan berjenjang."""

    DRAFT = "DRAFT"
    DIAJUKAN = "DIAJUKAN"
    DIVERIFIKASI = "DIVERIFIKASI"
    DISETUJUI = "DISETUJUI"
    DITOLAK = "DITOLAK"


class PointCategory(str, enum.Enum):
    SPKLU = "SPKLU"
    SPBKLU = "SPBKLU"
    MOBILE = "MOBILE"
    KOMUNITAS = "KOMUNITAS"


class MemberStatus(str, enum.Enum):
    MENUNGGU = "MENUNGGU"
    AKTIF = "AKTIF"
    DITOLAK = "DITOLAK"


class NotificationKind(str, enum.Enum):
    INFO = "INFO"
    VERIFIKASI = "VERIFIKASI"
    PERSETUJUAN = "PERSETUJUAN"
    PENOLAKAN = "PENOLAKAN"


class Province(Base):
    __tablename__ = "provinces"

    code: Mapped[str] = mapped_column(String(4), primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    island: Mapped[str] = mapped_column(String(40), nullable=False)
    capital: Mapped[str] = mapped_column(String(60), nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    position: Mapped[str] = mapped_column(String(160), default="")
    phone: Mapped[str] = mapped_column(String(32), default="")
    province_code: Mapped[str | None] = mapped_column(
        String(4), ForeignKey("provinces.code"), nullable=True
    )
    city: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    @property
    def level(self) -> str:
        return {
            UserRole.PUSAT: "Pusat",
            UserRole.PROVINSI: "Provinsi",
            UserRole.KOTA: "Kota/Kabupaten",
            UserRole.ANGGOTA: "Anggota",
        }[self.role]


class CpssPoint(Base):
    """Titik layanan Charging Point Service System."""

    __tablename__ = "cpss_points"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    code: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    address: Mapped[str] = mapped_column(String(255), default="")
    province_code: Mapped[str] = mapped_column(
        String(4), ForeignKey("provinces.code"), index=True, nullable=False
    )
    city: Mapped[str] = mapped_column(String(80), nullable=False)
    district: Mapped[str] = mapped_column(String(80), default="")
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[PointCategory] = mapped_column(
        Enum(PointCategory), default=PointCategory.SPKLU
    )
    capacity_kw: Mapped[int] = mapped_column(Integer, default=0)
    connectors: Mapped[int] = mapped_column(Integer, default=1)
    operating_hours: Mapped[str] = mapped_column(String(60), default="24 Jam")
    pic_name: Mapped[str] = mapped_column(String(120), default="")
    pic_phone: Mapped[str] = mapped_column(String(32), default="")
    notes: Mapped[str] = mapped_column(Text, default="")

    status: Mapped[PointStatus] = mapped_column(
        Enum(PointStatus), default=PointStatus.DIAJUKAN, index=True
    )
    rejected_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    submitted_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    verified_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    approved_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    history: Mapped[list["PointHistory"]] = relationship(
        back_populates="point",
        cascade="all, delete-orphan",
        order_by="PointHistory.at",
    )


class PointHistory(Base):
    __tablename__ = "point_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    point_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("cpss_points.id", ondelete="CASCADE"), index=True
    )
    at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    actor: Mapped[str] = mapped_column(String(120), default="")
    action: Mapped[str] = mapped_column(String(160), default="")
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    point: Mapped[CpssPoint] = relationship(back_populates="history")


class Member(Base):
    __tablename__ = "members"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    nik: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(160), index=True)
    phone: Mapped[str] = mapped_column(String(32), default="")
    birth_place: Mapped[str] = mapped_column(String(80), default="")
    birth_date: Mapped[str] = mapped_column(String(10), default="")
    gender: Mapped[str] = mapped_column(String(16), default="")
    address: Mapped[str] = mapped_column(Text, default="")
    province_code: Mapped[str] = mapped_column(
        String(4), ForeignKey("provinces.code"), index=True
    )
    city: Mapped[str] = mapped_column(String(80), default="")
    profession: Mapped[str] = mapped_column(String(80), default="")
    education: Mapped[str] = mapped_column(String(20), default="")
    interest: Mapped[str] = mapped_column(String(80), default="")
    motivation: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[MemberStatus] = mapped_column(
        Enum(MemberStatus), default=MemberStatus.MENUNGGU, index=True
    )
    member_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    registered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    body: Mapped[str] = mapped_column(Text, default="")
    kind: Mapped[NotificationKind] = mapped_column(
        Enum(NotificationKind), default=NotificationKind.INFO
    )
    target_role: Mapped[UserRole] = mapped_column(Enum(UserRole), index=True)
    target_province: Mapped[str | None] = mapped_column(String(4), nullable=True, index=True)
    point_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
