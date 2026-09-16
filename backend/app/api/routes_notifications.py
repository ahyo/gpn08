"""Endpoint notifikasi berjenjang."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select, update

from app.api.deps import CurrentUser, DbSession
from app.models.models import Notification, UserRole
from app.schemas.schemas import NotificationOut

router = APIRouter(prefix="/notifications", tags=["Notifikasi"])


def _visible_to(user) -> list:
    """Filter notifikasi sesuai peran dan wilayah pengguna."""
    conditions = [Notification.target_role == user.role]
    if user.role != UserRole.PUSAT and user.province_code:
        conditions.append(
            (Notification.target_province.is_(None))
            | (Notification.target_province == user.province_code)
        )
    return conditions


@router.get("", response_model=list[NotificationOut], summary="Notifikasi untuk pengguna")
def list_notifications(db: DbSession, user: CurrentUser) -> list[Notification]:
    stmt = select(Notification).where(*_visible_to(user))
    return list(db.scalars(stmt.order_by(Notification.created_at.desc()).limit(100)))


@router.post("/{notification_id}/read", response_model=NotificationOut, summary="Tandai dibaca")
def mark_read(notification_id: str, db: DbSession, user: CurrentUser) -> Notification:
    notification = db.get(Notification, notification_id)
    if notification is None or notification.target_role != user.role:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notifikasi tidak ditemukan.")
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


@router.post("/read-all", summary="Tandai seluruh notifikasi sebagai dibaca")
def mark_all_read(db: DbSession, user: CurrentUser) -> dict[str, int]:
    result = db.execute(
        update(Notification)
        .where(*_visible_to(user), Notification.is_read.is_(False))
        .values(is_read=True)
    )
    db.commit()
    return {"updated": result.rowcount or 0}
