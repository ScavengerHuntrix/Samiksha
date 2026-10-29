from datetime import datetime, timedelta
from typing import Optional, Any, Union
import bcrypt
from jose import jwt
from app.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored bcrypt hash."""
    try:
        pw_bytes = plain_password.encode("utf-8") if isinstance(plain_password, str) else plain_password
        hash_bytes = hashed_password.encode("utf-8") if isinstance(hashed_password, str) else hashed_password
        return bcrypt.checkpw(pw_bytes[:72], hash_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Generate a bcrypt hash of the provided password with 72-byte safe handling."""
    pw_bytes = password.encode("utf-8") if isinstance(password, str) else password
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes[:72], salt).decode("utf-8")


def create_access_token(
    subject: Union[str, Any],
    role: str,
    portal: str = "NSWS",
    extra_claims: Optional[dict] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a signed JWT access token containing subject, role, and portal."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": str(subject),
        "role": role,
        "portal": portal,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    if extra_claims:
        to_encode.update(extra_claims)

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate a signed JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None
