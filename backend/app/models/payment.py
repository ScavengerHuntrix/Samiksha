from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base


class Payment(Base):
    """Simulated payment transactions for application processing and credential allotment."""
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, nullable=True, index=True)
    institution_id = Column(Integer, nullable=True, index=True)
    amount = Column(Integer, nullable=False)
    fee_type = Column(String(100), nullable=False)  # CREDENTIAL_ALLOTMENT, APPLICATION_SUBMISSION
    status = Column(String(50), default="PENDING")  # PENDING, SUCCESS, FAILED
    reference_no = Column(String(100), unique=True, nullable=False, index=True)
    payment_method = Column(String(50), default="SIMULATED_GATEWAY")
    attempted_at = Column(DateTime, default=datetime.utcnow)
