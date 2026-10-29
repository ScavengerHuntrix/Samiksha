from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.database import Base


class SimulatedNotification(Base):
    """Simulated internal email / SMS notifications for user journeys."""
    __tablename__ = "simulated_notifications"

    id = Column(Integer, primary_key=True, index=True)
    recipient_user_id = Column(String(100), nullable=True, index=True)
    recipient_email = Column(String(255), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    notification_type = Column(String(50), default="EMAIL")  # EMAIL, SMS, SYSTEM
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
