from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from app.database import Base


class ValidationRuleVersion(Base):
    """Versioned sets of regulatory validation rules linked to APH publications."""
    __tablename__ = "validation_rule_versions"

    id = Column(Integer, primary_key=True, index=True)
    version_label = Column(String(100), unique=True, nullable=False)  # e.g. APH-2024-25-v1
    aph_source_filename = Column(String(255), nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    published_by = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    rollback_of = Column(String(100), nullable=True)


class ValidationRule(Base):
    """Dynamic validation rules extracted from APH or configured by Rules Admin."""
    __tablename__ = "validation_rules"

    id = Column(Integer, primary_key=True, index=True)
    version_id = Column(Integer, ForeignKey("validation_rule_versions.id"), nullable=False, index=True)
    rule_code = Column(String(100), nullable=False, index=True)
    category = Column(String(100), nullable=False)  # Land, Faculty, Infrastructure, Financial, etc.
    field_path = Column(String(255), nullable=False)
    rule_type = Column(String(50), nullable=False)  # REQUIRED, FORMAT, DATE, NUMERIC, CROSS_FIELD, DOCUMENT_PRESENT
    condition_config = Column(Text, nullable=False, default="{}")  # JSON representation of condition
    error_message = Column(Text, nullable=False)
    source_section = Column(String(100), nullable=True)
    source_page = Column(Integer, nullable=True)
    effective_from = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class ValidationResult(Base):
    """Output records of rule evaluations performed on applications."""
    __tablename__ = "validation_results"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False, index=True)
    rule_version_id = Column(Integer, nullable=False)
    rule_id = Column(Integer, ForeignKey("validation_rules.id"), nullable=False)
    passed = Column(Boolean, nullable=False)
    evidence = Column(Text, nullable=True)
    remediation_hint = Column(Text, nullable=True)
    validated_at = Column(DateTime, default=datetime.utcnow)
