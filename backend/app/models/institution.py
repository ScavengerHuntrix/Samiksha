from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base


class Institution(Base):
    """Educational institutions associated with applicants."""
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    applicant_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    institution_type = Column(String(100), default="Technical / Engineering")
    trust_society_name = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(20), nullable=True)
    aicte_reg_id = Column(String(100), unique=True, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
