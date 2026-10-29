from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base


class Approval(Base):
    """Central and State regulatory approvals catalog (NSWS inspired)."""
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    code = Column(String(100), unique=True, nullable=False, index=True)
    ministry = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False, default="CENTRAL")  # CENTRAL, STATE
    state = Column(String(100), nullable=True)  # Populated if STATE category
    description = Column(Text, nullable=True)
    requirements_summary = Column(Text, nullable=True)
    fee = Column(Integer, default=0)
    sla_days = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)
