"""Titik masuk aplikasi FastAPI GPN 08."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import Base, SessionLocal, engine
from app.api import (
    routes_auth,
    routes_members,
    routes_notifications,
    routes_points,
    routes_stats,
)
from app.services.seed import seed_all

logger = logging.getLogger("gpn08")


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Untuk produksi, gantilah create_all dengan migrasi Alembic.
    Base.metadata.create_all(bind=engine)
    if settings.seed_on_startup:
        with SessionLocal() as db:
            seed_all(db)
        logger.info("Data awal GPN 08 siap digunakan.")
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description=(
        "API Gerakan Persatuan Nasional 08 — keanggotaan, struktur organisasi "
        "berjenjang, dan Charging Point Service System (CPSS) dengan alur "
        "persetujuan DPD → DPW → DPP."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (
    routes_auth.router,
    routes_points.router,
    routes_members.router,
    routes_notifications.router,
    routes_stats.router,
):
    app.include_router(router, prefix=settings.api_v1_prefix)


@app.get("/", tags=["Umum"], summary="Informasi layanan")
def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "environment": settings.environment,
        "docs": "/docs",
    }


@app.get("/health", tags=["Umum"], summary="Pemeriksaan kesehatan layanan")
def health() -> dict[str, str]:
    return {"status": "ok"}
