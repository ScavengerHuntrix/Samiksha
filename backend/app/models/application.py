from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database import Base


class Application(Base):
    """Institutional applications submitted through Portal A and processed in Portal B."""
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True, index=True)
    approval_id = Column(Integer, ForeignKey("approvals.id"), nullable=False, index=True)
    reference_no = Column(String(100), unique=True, nullable=False, index=True)
    status = Column(String(50), default="DRAFT", index=True)
    # DRAFT, SUBMITTED, UNDER_SCRUTINY, DEFICIENT, RE_SCRUTINY, INSPECTION, SHC_REVIEW, SAC_REVIEW, DECISION, APPROVED, REJECTED
    current_stage = Column(String(100), default="Application Preparation")
    rule_version_id = Column(Integer, nullable=True)
    submission_fee_paid = Column(Integer, default=0)
    submitted_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ApplicationSection(Base):
    """Normalized multi-section application form data (JSON payload per section)."""
    __tablename__ = "application_sections"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, index=True)
    section_name = Column(String(100), nullable=False)  # basic_details, land, faculty, infra, etc.
    data = Column(Text, nullable=False, default="{}")  # JSON string
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WorkflowEvent(Base):
    """Audit trail of application workflow transitions."""
    __tablename__ = "workflow_events"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, index=True)
    from_status = Column(String(50), nullable=False)
    to_status = Column(String(50), nullable=False)
    actor_user_id = Column(String(100), nullable=False)
    actor_role = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Deficiency(Base):
    """Deficiencies raised during scrutiny stage."""
    __tablename__ = "deficiencies"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, index=True)
    raised_by = Column(String(100), nullable=False)
    field_reference = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="OPEN")  # OPEN, RESPONDED, CLOSED
    applicant_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
