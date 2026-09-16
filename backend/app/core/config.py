"""Konfigurasi aplikasi yang dibaca dari environment variable."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "GPN 08 API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"

    secret_key: str = "kunci-pengembangan-jangan-dipakai-di-produksi-0123456789"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 720

    database_url: str = "postgresql+psycopg://gpn08:gpn08@localhost:5432/gpn08"

    cors_origins: str = "http://localhost:3000"
    seed_on_startup: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
