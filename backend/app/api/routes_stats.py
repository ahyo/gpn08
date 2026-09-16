"""Endpoint statistik dan data referensi."""

from fastapi import APIRouter
from sqlalchemy import func, select

from app.api.deps import DbSession
from app.models.models import CpssPoint, Member, MemberStatus, PointStatus, Province
from app.schemas.schemas import (
    IslandCount,
    ProvinceCount,
    ProvinceOut,
    SummaryOut,
)

router = APIRouter(tags=["Statistik & Referensi"])


@router.get("/provinces", response_model=list[ProvinceOut], summary="Daftar provinsi")
def list_provinces(db: DbSession) -> list[Province]:
    return list(db.scalars(select(Province).order_by(Province.name)))


@router.get("/stats/summary", response_model=SummaryOut, summary="Ringkasan nasional")
def summary(db: DbSession) -> SummaryOut:
    def count_status(s: PointStatus) -> int:
        return (
            db.scalar(
                select(func.count()).select_from(CpssPoint).where(CpssPoint.status == s)
            )
            or 0
        )

    approved = select(CpssPoint).where(CpssPoint.status == PointStatus.DISETUJUI).subquery()

    return SummaryOut(
        total_points=db.scalar(select(func.count()).select_from(CpssPoint)) or 0,
        approved_points=count_status(PointStatus.DISETUJUI),
        pending_verification=count_status(PointStatus.DIAJUKAN),
        pending_approval=count_status(PointStatus.DIVERIFIKASI),
        rejected_points=count_status(PointStatus.DITOLAK),
        provinces_covered=db.scalar(
            select(func.count(func.distinct(approved.c.province_code)))
        )
        or 0,
        cities_covered=db.scalar(select(func.count(func.distinct(approved.c.city)))) or 0,
        total_capacity_kw=db.scalar(select(func.coalesce(func.sum(approved.c.capacity_kw), 0)))
        or 0,
        total_connectors=db.scalar(select(func.coalesce(func.sum(approved.c.connectors), 0)))
        or 0,
        total_members=db.scalar(select(func.count()).select_from(Member)) or 0,
        active_members=db.scalar(
            select(func.count()).select_from(Member).where(Member.status == MemberStatus.AKTIF)
        )
        or 0,
    )


@router.get(
    "/stats/by-island",
    response_model=list[IslandCount],
    summary="Sebaran titik disetujui per pulau",
)
def by_island(db: DbSession) -> list[IslandCount]:
    rows = db.execute(
        select(Province.island, func.count(CpssPoint.id))
        .join(CpssPoint, CpssPoint.province_code == Province.code)
        .where(CpssPoint.status == PointStatus.DISETUJUI)
        .group_by(Province.island)
        .order_by(func.count(CpssPoint.id).desc())
    ).all()
    return [IslandCount(island=r[0], count=r[1]) for r in rows]


@router.get(
    "/stats/by-province",
    response_model=list[ProvinceCount],
    summary="Sebaran titik disetujui per provinsi",
)
def by_province(db: DbSession) -> list[ProvinceCount]:
    rows = db.execute(
        select(Province.code, Province.name, func.count(CpssPoint.id))
        .join(CpssPoint, CpssPoint.province_code == Province.code)
        .where(CpssPoint.status == PointStatus.DISETUJUI)
        .group_by(Province.code, Province.name)
        .order_by(func.count(CpssPoint.id).desc())
    ).all()
    return [
        ProvinceCount(province_code=r[0], province_name=r[1], count=r[2]) for r in rows
    ]
