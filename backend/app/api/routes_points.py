"""Endpoint titik CPSS beserta alur persetujuan berjenjang.

Alur: DPD mengajukan (DIAJUKAN) → DPW memverifikasi (DIVERIFIKASI) →
DPP menyetujui (DISETUJUI) sehingga titik tayang di peta publik.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import CurrentUser, DbSession, require_roles
from app.models.models import (
    CpssPoint,
    Notification,
    NotificationKind,
    PointHistory,
    PointStatus,
    Province,
    User,
    UserRole,
)
from app.schemas.schemas import DecisionIn, PointCreate, PointOut, RejectIn

router = APIRouter(prefix="/points", tags=["Titik CPSS"])


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _province_name(db: Session, code: str) -> str:
    province = db.get(Province, code)
    return province.name if province else code


def _next_code(db: Session, province_code: str) -> str:
    used = db.scalar(
        select(func.count())
        .select_from(CpssPoint)
        .where(CpssPoint.province_code == province_code)
    )
    return f"CPSS-{province_code}-{(used or 0) + 1:03d}"


def _log(point: CpssPoint, actor: str, action: str, note: str | None = None) -> None:
    point.history.append(
        PointHistory(at=_now(), actor=actor, action=action, note=note)
    )


def _notify(
    db: Session,
    *,
    title: str,
    body: str,
    kind: NotificationKind,
    target_role: UserRole,
    target_province: str | None = None,
    point_id: str | None = None,
) -> None:
    db.add(
        Notification(
            title=title,
            body=body,
            kind=kind,
            target_role=target_role,
            target_province=target_province,
            point_id=point_id,
        )
    )


def _scoped_query(user: User):
    """Membatasi kueri sesuai jenjang kepengurusan pengguna."""
    stmt = select(CpssPoint).options(selectinload(CpssPoint.history))
    if user.role == UserRole.PUSAT:
        return stmt
    if user.role == UserRole.PROVINSI:
        return stmt.where(CpssPoint.province_code == user.province_code)
    stmt = stmt.where(CpssPoint.province_code == user.province_code)
    if user.city:
        stmt = stmt.where(CpssPoint.city == user.city)
    return stmt


@router.get(
    "/public",
    response_model=list[PointOut],
    summary="Titik yang telah disetujui (dapat diakses publik)",
)
def list_public_points(
    db: DbSession,
    province_code: str | None = Query(default=None, max_length=4),
    category: str | None = Query(default=None),
    q: str | None = Query(default=None, max_length=80),
) -> list[CpssPoint]:
    stmt = (
        select(CpssPoint)
        .options(selectinload(CpssPoint.history))
        .where(CpssPoint.status == PointStatus.DISETUJUI)
    )
    if province_code:
        stmt = stmt.where(CpssPoint.province_code == province_code)
    if category:
        stmt = stmt.where(CpssPoint.category == category)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(
            func.lower(CpssPoint.name).like(like) | func.lower(CpssPoint.city).like(like)
        )
    return list(db.scalars(stmt.order_by(CpssPoint.name)))


@router.get(
    "",
    response_model=list[PointOut],
    summary="Titik dalam cakupan wewenang pengguna",
)
def list_points(
    db: DbSession,
    user: CurrentUser,
    status_filter: PointStatus | None = Query(default=None, alias="status"),
) -> list[CpssPoint]:
    stmt = _scoped_query(user)
    if status_filter:
        stmt = stmt.where(CpssPoint.status == status_filter)
    return list(db.scalars(stmt.order_by(CpssPoint.submitted_at.desc())))


@router.get("/{point_id}", response_model=PointOut, summary="Detail satu titik")
def get_point(point_id: str, db: DbSession, user: CurrentUser) -> CpssPoint:
    point = db.get(CpssPoint, point_id)
    if point is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Titik tidak ditemukan.")
    if user.role != UserRole.PUSAT and point.province_code != user.province_code:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Titik berada di luar cakupan wilayah Anda."
        )
    return point


@router.post(
    "",
    response_model=PointOut,
    status_code=status.HTTP_201_CREATED,
    summary="Ajukan titik baru (tim lapangan DPD)",
)
def create_point(
    payload: PointCreate,
    db: DbSession,
    user: CurrentUser,
) -> CpssPoint:
    if db.get(Province, payload.province_code) is None:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Kode provinsi tidak dikenal.")

    if user.role in (UserRole.KOTA, UserRole.ANGGOTA) and user.province_code:
        if payload.province_code != user.province_code:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                "Anda hanya dapat mengajukan titik di wilayah kepengurusan Anda.",
            )

    point = CpssPoint(
        code=_next_code(db, payload.province_code),
        status=PointStatus.DIAJUKAN,
        submitted_by=user.id,
        submitted_at=_now(),
        **payload.model_dump(),
    )
    _log(point, user.name, "Pengajuan titik dibuat oleh tim lapangan")
    db.add(point)
    db.flush()

    _notify(
        db,
        title="Pengajuan titik baru menunggu verifikasi",
        body=f"{point.name} ({point.city}) diajukan oleh {user.name}.",
        kind=NotificationKind.VERIFIKASI,
        target_role=UserRole.PROVINSI,
        target_province=point.province_code,
        point_id=point.id,
    )
    db.commit()
    db.refresh(point)
    return point


@router.post(
    "/{point_id}/verify",
    response_model=PointOut,
    summary="Verifikasi titik oleh DPW provinsi",
)
def verify_point(
    point_id: str,
    payload: DecisionIn,
    db: DbSession,
    user: User = Depends(require_roles(UserRole.PROVINSI, UserRole.PUSAT)),
) -> CpssPoint:
    point = db.get(CpssPoint, point_id)
    if point is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Titik tidak ditemukan.")
    if user.role == UserRole.PROVINSI and point.province_code != user.province_code:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Titik berada di luar wilayah kepengurusan Anda."
        )
    if point.status != PointStatus.DIAJUKAN:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Titik berstatus {point.status.value} sehingga tidak dapat diverifikasi.",
        )

    point.status = PointStatus.DIVERIFIKASI
    point.verified_by = user.id
    point.verified_at = _now()
    _log(
        point,
        user.name,
        "Verifikasi wilayah selesai",
        payload.note or "Data lapangan sesuai, diteruskan ke DPP.",
    )
    _notify(
        db,
        title="Titik telah diverifikasi DPW, menunggu persetujuan DPP",
        body=f"{point.name} ({_province_name(db, point.province_code)}) siap disetujui.",
        kind=NotificationKind.PERSETUJUAN,
        target_role=UserRole.PUSAT,
        point_id=point.id,
    )
    db.commit()
    db.refresh(point)
    return point


@router.post(
    "/{point_id}/approve",
    response_model=PointOut,
    summary="Persetujuan akhir oleh DPP pusat",
)
def approve_point(
    point_id: str,
    payload: DecisionIn,
    db: DbSession,
    user: User = Depends(require_roles(UserRole.PUSAT)),
) -> CpssPoint:
    point = db.get(CpssPoint, point_id)
    if point is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Titik tidak ditemukan.")
    if point.status != PointStatus.DIVERIFIKASI:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Hanya titik yang telah diverifikasi DPW yang dapat disetujui.",
        )

    point.status = PointStatus.DISETUJUI
    point.approved_by = user.id
    point.approved_at = _now()
    _log(point, user.name, "Disetujui dan ditayangkan di dashboard CPSS", payload.note)
    _notify(
        db,
        title="Titik CPSS disetujui DPP",
        body=f"{point.name} kini tayang di dashboard CPSS nasional.",
        kind=NotificationKind.INFO,
        target_role=UserRole.PROVINSI,
        target_province=point.province_code,
        point_id=point.id,
    )
    _notify(
        db,
        title="Pengajuan Anda disetujui",
        body=f"{point.name} telah disetujui DPP dan tayang di peta nasional.",
        kind=NotificationKind.INFO,
        target_role=UserRole.KOTA,
        target_province=point.province_code,
        point_id=point.id,
    )
    db.commit()
    db.refresh(point)
    return point


@router.post(
    "/{point_id}/reject",
    response_model=PointOut,
    summary="Tolak pengajuan titik",
)
def reject_point(
    point_id: str,
    payload: RejectIn,
    db: DbSession,
    user: User = Depends(require_roles(UserRole.PROVINSI, UserRole.PUSAT)),
) -> CpssPoint:
    point = db.get(CpssPoint, point_id)
    if point is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Titik tidak ditemukan.")
    if user.role == UserRole.PROVINSI and point.province_code != user.province_code:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Titik berada di luar wilayah kepengurusan Anda."
        )
    if point.status in (PointStatus.DISETUJUI, PointStatus.DITOLAK):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Titik berstatus {point.status.value} sehingga tidak dapat ditolak.",
        )

    point.status = PointStatus.DITOLAK
    point.rejected_reason = payload.reason
    _log(point, user.name, "Pengajuan ditolak", payload.reason)
    _notify(
        db,
        title="Pengajuan titik ditolak",
        body=f"{point.name} ditolak oleh {user.name}. Alasan: {payload.reason}",
        kind=NotificationKind.PENOLAKAN,
        target_role=UserRole.KOTA,
        target_province=point.province_code,
        point_id=point.id,
    )
    db.commit()
    db.refresh(point)
    return point
