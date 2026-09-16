"""Hashing kata sandi dan penerbitan JSON Web Token.

Hashing memakai scrypt dari pustaka standar Python sehingga tidak memerlukan
dependensi terkompilasi tambahan. Parameter mengikuti rekomendasi OWASP
(N=2^15, r=8, p=1).
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.core.config import settings

_SCRYPT_N = 2**15
_SCRYPT_R = 8
_SCRYPT_P = 1
_SALT_BYTES = 16
_KEY_LEN = 32
# OpenSSL membatasi memori scrypt pada 32 MiB secara bawaan; N=2^15 & r=8
# membutuhkan 128*N*r = 32 MiB sehingga batasnya perlu dinaikkan.
_MAX_MEM = 96 * 1024 * 1024


def hash_password(password: str) -> str:
    """Menghasilkan string hash berformat ``scrypt$<salt_b64>$<hash_b64>``."""
    salt = os.urandom(_SALT_BYTES)
    digest = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=_SCRYPT_N,
        r=_SCRYPT_R,
        p=_SCRYPT_P,
        maxmem=_MAX_MEM,
        dklen=_KEY_LEN,
    )
    return "scrypt${}${}".format(
        base64.b64encode(salt).decode(), base64.b64encode(digest).decode()
    )


def verify_password(password: str, stored: str) -> bool:
    try:
        scheme, salt_b64, hash_b64 = stored.split("$", 2)
    except ValueError:
        return False
    if scheme != "scrypt":
        return False
    salt = base64.b64decode(salt_b64)
    expected = base64.b64decode(hash_b64)
    candidate = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=_SCRYPT_N,
        r=_SCRYPT_R,
        p=_SCRYPT_P,
        maxmem=_MAX_MEM,
        dklen=len(expected),
    )
    return hmac.compare_digest(candidate, expected)


def create_access_token(subject: str, extra: dict[str, Any] | None = None) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
