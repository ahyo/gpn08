"""Endpoint pendaftaran dan pengelolaan anggota."""

import random

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select

from app.api.deps import DbSession, require_roles
from app.models.models import (
    Member,
    MemberStatus,
    Notification,
    NotificationKind,
    Province,
    User,
    UserRole,
)
from app.schemas.schemas import MemberCreate, MemberOut, MemberStatusIn

router = APIRouter(prefix="/members", tags=["Keanggotaan"])


@router.post(
    "",
    response_model=MemberOut,
    status_code=status.HTTP_201_CREATED,
    summary="Pendaftaran anggota baru (terbuka untuk publik)",
)
def register_member(payload: MemberCreate, db: DbSession) -> Member:
    if db.get(Province, payload.province_code) is None:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Kode provinsi tidak dikenal.")
    if db.scalar(select(Member).where(Member.nik == payload.nik)):
        raise HTTPException(status.HTTP_409_CONFLICT, "NIK sudah terdaftar sebagai anggota.")

    member = Member(**payload.model_dump(), status=MemberStatus.MENUNGGU)
    db.add(member)
    db.add(
        Notification(
            title="Pendaftaran anggota baru",
            body=f"{member.full_name} dari {member.city} mendaftar sebagai anggota.",
            kind=NotificationKind.INFO,
            target_role=UserRole.PROVINSI,
            target_province=member.province_code,
        )
    )
    db.commit()
    db.refresh(member)
    return member


@router.get(
    "",
    response_model=list[MemberOut],
    summary="Daftar anggota dalam cakupan wewenang",
)
def list_members(
    db: DbSession,
    status_filter: MemberStatus | None = Query(default=None, alias="status"),
    user: User = Depends(require_roles(UserRole.PUSAT, UserRole.PROVINSI)),
) -> list[Member]:
    stmt = select(Member)
    if user.role == UserRole.PROVINSI:
        stmt = stmt.where(Member.province_code == user.province_code)
    if status_filter:
        stmt = stmt.where(Member.status == status_filter)
    return list(db.scalars(stmt.order_by(Member.registered_at.desc())))


@router.patch(
    "/{member_id}/status",
    response_model=MemberOut,
    summary="Verifikasi atau tolak keanggotaan",
)
def set_member_status(
    member_id: str,
    payload: MemberStatusIn,
    db: DbSession,
    user: User = Depends(require_roles(UserRole.PUSAT, UserRole.PROVINSI)),
) -> Member:
    member = db.get(Member, member_id)
    if member is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Anggota tidak ditemukan.")
    if user.role == UserRole.PROVINSI and member.province_code != user.province_code:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Anggota berada di luar wilayah kepengurusan Anda."
        )

    member.status = payload.status
    if payload.status == MemberStatus.AKTIF and not member.member_number:
        member.member_number = (
            f"GPN08-{member.province_code}-{random.randint(1000, 9999)}"
        )
    db.commit()
    db.refresh(member)
    return member
