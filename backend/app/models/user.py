from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database import Base


class User(Base):
    """General users for Portal A (NSWS applicants) and unified identity."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    mobile = Column(String(20), nullable=True)
    entity_type = Column(String(50), default="INSTITUTION")  # INSTITUTION, TRUST, SOCIETY, COMPANY
    portal = Column(String(20), default="NSWS")  # NSWS, AICTE
    role = Column(String(50), default="APPLICANT")  # APPLICANT, RULES_ADMIN, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)


class AICTEUser(Base):
    """Designated officer and administrative accounts for Portal B (AICTE)."""
    __tablename__ = "aicte_users"

    id = Column(Integer, primary_key=True, index=True)
    aicte_user_id = Column(String(50), unique=True, index=True, nullable=False)  # AICTE-SCR-0001, etc.
    role = Column(String(50), nullable=False)  # SCRUTINY, EVC, COORDINATOR, SHC, SAC, AUTHORITY, RULES_ADMIN
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    mobile = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_first_login = Column(Boolean, default=False)
    setup_token = Column(String(255), nullable=True)
    setup_token_expires = Column(DateTime, nullable=True)
    created_by = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    suspended_at = Column(DateTime, nullable=True)
