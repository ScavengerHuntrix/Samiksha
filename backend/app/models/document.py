from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from app.database import Base


class Document(Base):
    """Uploaded documents stored in document locker and reusable across applications."""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    owner_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True, index=True)
    category = Column(String(100), nullable=False)  # Land, Trust, NOC, Building Plan, Fire Safety, etc.
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    ocr_status = Column(String(50), default="PENDING")  # PENDING, DONE, FAILED
    ocr_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)


class ApplicationDocument(Base):
    """Mapping between applications and uploaded documents."""
    __tablename__ = "application_documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False, index=True)
    document_type = Column(String(100), nullable=False)  # e.g., LAND_DEED, OCCUPANCY_CERTIFICATE
    is_reused = Column(Boolean, default=False)
    mapped_at = Column(DateTime, default=datetime.utcnow)
