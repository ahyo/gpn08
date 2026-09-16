"""Skema Pydantic untuk request dan response API."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.models import (
    MemberStatus,
    NotificationKind,
    PointCategory,
    PointStatus,
    UserRole,
)


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ------------------------------- Autentikasi -------------------------------


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserOut(ORMModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    level: str
    position: str
    phone: str
    province_code: str | None = None
    city: str | None = None


# --------------------------------- Provinsi --------------------------------


class ProvinceOut(ORMModel):
    code: str
    name: str
    island: str
    capital: str
    lat: float
    lng: float


# ------------------------------- Titik CPSS --------------------------------


class PointHistoryOut(ORMModel):
    at: datetime
    actor: str
    action: str
    note: str | None = None


class PointBase(BaseModel):
    name: str = Field(min_length=5, max_length=160)
    province_code: str = Field(min_length=2, max_length=4)
    city: str = Field(min_length=2, max_length=80)
    district: str = Field(default="", max_length=80)
    address: str = Field(default="", max_length=255)
    lat: float = Field(ge=-11.5, le=7.0, description="Lintang dalam cakupan Indonesia")
    lng: float = Field(ge=94.0, le=142.0, description="Bujur dalam cakupan Indonesia")
    category: PointCategory = PointCategory.SPKLU
    capacity_kw: int = Field(ge=3, le=600)
    connectors: int = Field(ge=1, le=24)
    operating_hours: str = Field(default="24 Jam", max_length=60)
    pic_name: str = Field(default="", max_length=120)
    pic_phone: str = Field(default="", max_length=32)
    notes: str = ""


class PointCreate(PointBase):
    pass


class PointOut(ORMModel):
    id: str
    code: str
    name: str
    address: str
    province_code: str
    city: str
    district: str
    lat: float
    lng: float
    category: PointCategory
    capacity_kw: int
    connectors: int
    operating_hours: str
    pic_name: str
    pic_phone: str
    notes: str
    status: PointStatus
    rejected_reason: str | None = None
    submitted_at: datetime
    verified_at: datetime | None = None
    approved_at: datetime | None = None
    history: list[PointHistoryOut] = []


class DecisionIn(BaseModel):
    note: str | None = Field(default=None, max_length=500)


class RejectIn(BaseModel):
    reason: str = Field(min_length=10, max_length=500)


# --------------------------------- Anggota ---------------------------------


class MemberCreate(BaseModel):
    full_name: str = Field(min_length=3, max_length=120)
    nik: str = Field(pattern=r"^\d{16}$")
    email: EmailStr
    phone: str = Field(pattern=r"^0\d{8,13}$")
    birth_place: str = Field(min_length=2, max_length=80)
    birth_date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    gender: str
    address: str = Field(min_length=8)
    province_code: str
    city: str
    profession: str
    education: str
    interest: str
    motivation: str = Field(min_length=20)


class MemberOut(ORMModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    province_code: str
    city: str
    profession: str
    education: str
    interest: str
    status: MemberStatus
    member_number: str | None = None
    registered_at: datetime


class MemberStatusIn(BaseModel):
    status: MemberStatus


# ------------------------------- Notifikasi --------------------------------


class NotificationOut(ORMModel):
    id: str
    title: str
    body: str
    kind: NotificationKind
    target_role: UserRole
    target_province: str | None = None
    point_id: str | None = None
    is_read: bool
    created_at: datetime


# -------------------------------- Statistik --------------------------------


class SummaryOut(BaseModel):
    total_points: int
    approved_points: int
    pending_verification: int
    pending_approval: int
    rejected_points: int
    provinces_covered: int
    cities_covered: int
    total_capacity_kw: int
    total_connectors: int
    total_members: int
    active_members: int


class IslandCount(BaseModel):
    island: str
    count: int


class ProvinceCount(BaseModel):
    province_code: str
    province_name: str
    count: int
