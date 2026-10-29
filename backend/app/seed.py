import sys
import os
from datetime import datetime

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import engine, SessionLocal, Base
from app.models import (
    User, AICTEUser, Approval, ValidationRuleVersion, ValidationRule,
    Institution, Application, Deficiency, WorkflowEvent
)
from app.core.security import get_password_hash


def seed_database():
    """Seed the database with initial tables, administrative accounts, approvals, and default rules."""
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Rules Administrator (Role 8)
        admin_user = db.query(AICTEUser).filter(AICTEUser.aicte_user_id == "AICTE-ADM-0001").first()
        if not admin_user:
            print("Creating default Rules Administrator: AICTE-ADM-0001...")
            admin_user = AICTEUser(
                aicte_user_id="AICTE-ADM-0001",
                role="RULES_ADMIN",
                full_name="AICTE Central Rules Administrator",
                email="admin@aicte.gov.in",
                mobile="9876543210",
                department="AICTE Approval Bureau - Regulations & IT",
                password_hash=get_password_hash("Demo@1234"),
                is_active=True,
                is_first_login=False,
                created_by="SYSTEM_BOOTSTRAP",
                created_at=datetime.utcnow()
            )
            db.add(admin_user)

        # 2. Seed other demo officer accounts (Roles 2 through 7)
        officers = [
            ("AICTE-SCR-0001", "SCRUTINY", "Dr. Rajesh Sharma", "scrutiny.sharma@aicte.gov.in", "Scrutiny Committee (Western Region)"),
            ("AICTE-EVC-0001", "EVC", "Prof. Sunita Rao", "evc.rao@aicte.gov.in", "Expert Visit Committee"),
            ("AICTE-REG-0001", "COORDINATOR", "Shri Amit Verma", "coordinator.verma@aicte.gov.in", "AICTE Regulation Bureau"),
            ("AICTE-SHC-0001", "SHC", "Dr. Meenakshi Sundaram", "shc.sundaram@aicte.gov.in", "Standing Hearing Committee"),
            ("AICTE-SAC-0001", "SAC", "Justice (Retd.) K. Narayanan", "sac.narayanan@aicte.gov.in", "Standing Appellate Committee"),
            ("AICTE-ADA-0001", "AUTHORITY", "Prof. T. G. Sitharam", "chairman@aicte.gov.in", "Authorized Decision Authority"),
        ]

        for user_id, role, name, email, dept in officers:
            existing = db.query(AICTEUser).filter(AICTEUser.aicte_user_id == user_id).first()
            if not existing:
                print(f"Creating demo officer {user_id} ({role})...")
                officer = AICTEUser(
                    aicte_user_id=user_id,
                    role=role,
                    full_name=name,
                    email=email,
                    mobile="9876500000",
                    department=dept,
                    password_hash=get_password_hash("Demo@1234"),
                    is_active=True,
                    is_first_login=False,
                    created_by="AICTE-ADM-0001",
                    created_at=datetime.utcnow()
                )
                db.add(officer)

        # 3. Seed Demo Applicant User (Role 1)
        demo_applicant = db.query(User).filter(User.email == "applicant@demo.samiksha").first()
        if not demo_applicant:
            print("Creating demo applicant: applicant@demo.samiksha...")
            demo_applicant = User(
                email="applicant@demo.samiksha",
                password_hash=get_password_hash("Demo@1234"),
                full_name="Vivekananda Educational Trust",
                mobile="9811223344",
                entity_type="TRUST",
                portal="NSWS",
                role="APPLICANT",
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.add(demo_applicant)

        # 4. Seed Catalog of Approvals (NSWS-inspired Central and State Approvals)
        approvals_data = [
            {
                "code": "AICTE-APP-NEW-01",
                "name": "Grant of Approval for Setting up New Technical Institution",
                "ministry": "Ministry of Education / AICTE",
                "category": "CENTRAL",
                "state": None,
                "description": "Approval for establishment of new technical institutions offering Degree, Diploma and Post Graduate programs under AICTE APH regulations.",
                "requirements_summary": "Land ownership/lease deed, building completion plan, trust registration, NOC from State Government, Affiliating University NOC, Fire safety certificate.",
                "fee": 50000,
                "sla_days": 45
            },
            {
                "code": "AICTE-APP-EOA-02",
                "name": "Extension of Approval (EoA) for Existing Technical Institution",
                "ministry": "Ministry of Education / AICTE",
                "category": "CENTRAL",
                "state": None,
                "description": "Annual regulatory extension of approval for running ongoing technical programs.",
                "requirements_summary": "Annual compliance report, faculty details, audited balance sheet, infrastructure verification.",
                "fee": 25000,
                "sla_days": 30
            },
            {
                "code": "STATE-NOC-MH-01",
                "name": "State Government NOC for Setting up Technical Campus",
                "ministry": "Department of Higher & Technical Education",
                "category": "STATE",
                "state": "Maharashtra",
                "description": "No Objection Certificate issued by State Higher & Technical Education department for proposed technical college.",
                "requirements_summary": "District collector verification, land clearance, state perspective plan compliance.",
                "fee": 10000,
                "sla_days": 30
            },
            {
                "code": "STATE-NOC-KA-01",
                "name": "State Government NOC for Technical Institution",
                "ministry": "Department of Technical Education",
                "category": "STATE",
                "state": "Karnataka",
                "description": "State Level clearance and reservation policy adherence certification.",
                "requirements_summary": "Trust registration, location feasibility certificate, revenue department land records.",
                "fee": 10000,
                "sla_days": 30
            },
            {
                "code": "UNIV-AFF-NOC-01",
                "name": "Affiliating University Provisional Affiliation & NOC",
                "ministry": "State University / Affiliating Body",
                "category": "STATE",
                "state": "Maharashtra",
                "description": "Affiliation clearance from designated state technological university (e.g. DBATU/SPPU).",
                "requirements_summary": "Syllabus readiness, curriculum alignment, library and lab verification.",
                "fee": 20000,
                "sla_days": 40
            }
        ]

        for app_data in approvals_data:
            existing_app = db.query(Approval).filter(Approval.code == app_data["code"]).first()
            if not existing_app:
                print(f"Creating approval entry: {app_data['code']}...")
                approval = Approval(**app_data)
                db.add(approval)

        # 5. Seed Initial Active Rule Version (AICTE APH 2024-25 to 2026-27)
        rule_version = db.query(ValidationRuleVersion).filter(ValidationRuleVersion.version_label == "APH-2024-27-v1.0").first()
        if not rule_version:
            print("Creating default APH Rule Version: APH-2024-27-v1.0...")
            rule_version = ValidationRuleVersion(
                version_label="APH-2024-27-v1.0",
                aph_source_filename="AICTE_APH_2024-25_to_2026-27.pdf",
                published_at=datetime.utcnow(),
                published_by="AICTE-ADM-0001",
                is_active=True
            )
            db.add(rule_version)
            db.flush()

            # Seed basic foundational rules
            default_rules = [
                {
                    "version_id": rule_version.id,
                    "rule_code": "APH-RULE-LAND-01",
                    "category": "Land",
                    "field_path": "land_details.total_land_acres",
                    "rule_type": "NUMERIC",
                    "condition_config": '{"operator": ">=", "value": 7.5, "unit": "acres", "metro_exception": 2.5}',
                    "error_message": "Minimum land area requirement for Mega/Metro/Rural technical institutions must adhere to APH norms (min 7.5 acres rural or 2.5 acres metro).",
                    "source_section": "Chapter 1 - Section 1.4",
                    "source_page": 28,
                    "effective_from": datetime.utcnow(),
                    "is_active": True
                },
                {
                    "version_id": rule_version.id,
                    "rule_code": "APH-RULE-DOC-FIRE-01",
                    "category": "Safety & Statutory",
                    "field_path": "documents.fire_safety_certificate",
                    "rule_type": "DOCUMENT_PRESENT",
                    "condition_config": '{"required": true, "validity_check": true, "max_age_days": 365}',
                    "error_message": "Valid Fire Safety Certificate issued by Competent Fire Services Authority is mandatory.",
                    "source_section": "Chapter 1 - Annexure 2",
                    "source_page": 44,
                    "effective_from": datetime.utcnow(),
                    "is_active": True
                },
                {
                    "version_id": rule_version.id,
                    "rule_code": "APH-RULE-DOC-LAND-02",
                    "category": "Land & Title",
                    "field_path": "documents.land_registration_deed",
                    "rule_type": "DOCUMENT_PRESENT",
                    "condition_config": '{"required": true, "min_lease_period_years": 30}',
                    "error_message": "Registered Sale Deed or Registered Government Lease Deed for not less than 30 years is mandatory.",
                    "source_section": "Chapter 1 - Section 1.5",
                    "source_page": 32,
                    "effective_from": datetime.utcnow(),
                    "is_active": True
                }
            ]

            for r in default_rules:
                db.add(ValidationRule(**r))

        # 6. Seed Demo Institution
        inst = db.query(Institution).filter(Institution.aicte_reg_id == "1-10972345671").first()
        applicant_user = db.query(User).filter(User.email == "applicant@demo.samiksha").first()
        if not inst and applicant_user:
            print("Creating demo institution: Vivekananda Institute of Technology & Management...")
            inst = Institution(
                applicant_user_id=applicant_user.id,
                name="Vivekananda Institute of Technology & Management",
                state="Maharashtra",
                district="Pune",
                institution_type="Private / Self-Financing Technical Institution",
                trust_society_name="Vivekananda Educational Trust",
                contact_email="principal@vitm.edu.in",
                contact_phone="+91 80 2852 0900",
                aicte_reg_id="1-10972345671"
            )
            db.add(inst)
            db.flush()

        # 7. Seed Realistic Applications for Scrutiny Dashboard
        applicant_user = db.query(User).filter(User.email == "applicant@demo.samiksha").first()
        app_eoa_approval = db.query(Approval).filter(Approval.code == "AICTE-APP-EOA-02").first()
        app_new_approval = db.query(Approval).filter(Approval.code == "AICTE-APP-NEW-01").first()

        existing_app_count = db.query(Application).count()
        if existing_app_count == 0 and applicant_user and app_eoa_approval:
            print("Seeding scrutiny applications queue...")
            # App 1: Awaiting Scrutiny (UNDER_SCRUTINY)
            app1 = Application(
                applicant_id=applicant_user.id,
                institution_id=inst.id if inst else None,
                approval_id=app_eoa_approval.id,
                reference_no="SAMIKSHA-EOA-2024-0091",
                status="UNDER_SCRUTINY",
                current_stage="Stage 1: Scrutiny / Re-scrutiny Committee",
                rule_version_id=rule_version.id if rule_version else 1,
                submission_fee_paid=25000,
                submitted_at=datetime.utcnow()
            )
            db.add(app1)
            db.flush()

            # App 2: Under Re-scrutiny (RE_SCRUTINY) with previous deficiency & response
            app2 = Application(
                applicant_id=applicant_user.id,
                institution_id=inst.id if inst else None,
                approval_id=app_eoa_approval.id,
                reference_no="SAMIKSHA-COL-2024-0018",
                status="RE_SCRUTINY",
                current_stage="Stage 1: Scrutiny Committee (Re-Scrutiny Cycle)",
                rule_version_id=rule_version.id if rule_version else 1,
                submission_fee_paid=25000,
                submitted_at=datetime.utcnow()
            )
            db.add(app2)
            db.flush()

            # Add previous deficiency for app2
            def2 = Deficiency(
                application_id=app2.id,
                raised_by="AICTE-SCR-0001",
                field_reference="documents.aiu_equivalence_notification",
                description="Association of Indian Universities (AIU) credit equivalence notification was absent in initial submission.",
                status="OPEN",
                applicant_response="Institution has obtained and uploaded the official AIU credit transfer equivalence certificate (Ref: AIU/EV/2024/991).",
                created_at=datetime.utcnow()
            )
            db.add(def2)

            # App 3: In Deficiency Cycle (DEFICIENT)
            app3 = Application(
                applicant_id=applicant_user.id,
                institution_id=inst.id if inst else None,
                approval_id=app_eoa_approval.id,
                reference_no="SAMIKSHA-EOA-2024-0042",
                status="DEFICIENT",
                current_stage="Deficiency Notice Issued — Awaiting Institution Response",
                rule_version_id=rule_version.id if rule_version else 1,
                submission_fee_paid=25000,
                submitted_at=datetime.utcnow()
            )
            db.add(app3)
            db.flush()

            def3 = Deficiency(
                application_id=app3.id,
                raised_by="AICTE-SCR-0001",
                field_reference="documents.fire_safety_certificate",
                description="Fire Safety NOC expired on 31-03-2024. Current academic year requires renewed valid certificate.",
                status="OPEN",
                applicant_response="Application for fire renewal submitted to Pune Municipal Fire Brigade; inspection pending.",
                created_at=datetime.utcnow()
            )
            db.add(def3)

            # App 4: Completed / Cleared Scrutiny, Forwarded to EVC (INSPECTION)
            app4 = Application(
                applicant_id=applicant_user.id,
                institution_id=inst.id if inst else None,
                approval_id=app_new_approval.id if app_new_approval else app_eoa_approval.id,
                reference_no="SAMIKSHA-UNIV-2024-0007",
                status="INSPECTION",
                current_stage="Stage 2: Expert Visit Committee (EVC Inspection)",
                rule_version_id=rule_version.id if rule_version else 1,
                submission_fee_paid=50000,
                submitted_at=datetime.utcnow()
            )
            db.add(app4)
            db.flush()

            # Workflow Event for App 4
            wf4 = WorkflowEvent(
                application_id=app4.id,
                from_status="UNDER_SCRUTINY",
                to_status="INSPECTION",
                actor_user_id="AICTE-SCR-0001",
                actor_role="SCRUTINY",
                notes="All statutory documents, land title, and building NOCs verified. Recommended for physical EVC inspection.",
                created_at=datetime.utcnow()
            )
            db.add(wf4)

        db.commit()
        print("Database seed completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
