from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional

from app.config import settings
from app.database import engine, get_db, Base
from app.models import Approval, ValidationRuleVersion, Institution, Application, Deficiency
from app.schemas.common import HealthResponse, SystemInfoResponse
from app.schemas.approval import ApprovalResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables are created on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="SAMIKSHA — AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification (Smart India Hackathon Prototype)",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for local development and demo access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all during prototype/local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.scrutiny import router as scrutiny_router
app.include_router(scrutiny_router)


@app.get("/api/health", response_model=HealthResponse, tags=["System"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint verifying backend and database connectivity."""
    db_ok = False
    active_version_label = None
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
        active_version = db.query(ValidationRuleVersion).filter(ValidationRuleVersion.is_active == True).first()
        if active_version:
            active_version_label = active_version.version_label
    except Exception as e:
        print(f"Health check DB error: {e}")

    return HealthResponse(
        status="ok" if db_ok else "degraded",
        app=settings.PROJECT_NAME,
        simulation_mode=settings.SIMULATION_MODE,
        notice="SIMULATED PORTAL — NOT AN OFFICIAL NSWS OR AICTE WEBSITE",
        active_rule_version=active_version_label,
        database_connected=db_ok
    )


@app.get("/api/system/info", response_model=SystemInfoResponse, tags=["System"])
def system_info():
    """Returns simulation metadata, supported role taxonomy, and active regulatory reference."""
    return SystemInfoResponse(
        project_name=settings.PROJECT_NAME,
        environment=settings.ENVIRONMENT,
        simulation_banner="SIMULATED PORTAL — NOT AN OFFICIAL NSWS OR AICTE WEBSITE",
        roles=[
            "Role 1: Institution Applicant",
            "Role 2: Scrutiny Officer",
            "Role 3: EVC/Inspection Officer",
            "Role 4: Regulation Bureau (Coordinator)",
            "Role 5: Standing Hearing Committee (SHC)",
            "Role 6: Standing Appellate Committee (SAC)",
            "Role 7: Authorized Decision Authority (Chairman)",
            "Role 8: Rules Administrator"
        ],
        active_aph_handbook="AICTE Approval Process Handbook (APH 2024-25 to 2026-27)"
    )


@app.get("/api/approvals", response_model=List[ApprovalResponse], tags=["Approvals"])
def list_approvals(
    category: Optional[str] = Query(None, description="Filter by CENTRAL or STATE"),
    state: Optional[str] = Query(None, description="Filter by State"),
    search: Optional[str] = Query(None, description="Search keyword"),
    db: Session = Depends(get_db)
):
    """Catalog of Central and State Approvals (NSWS-inspired discovery)."""
    query = db.query(Approval)
    if category:
        query = query.filter(Approval.category == category.upper())
    if state:
        query = query.filter(Approval.state == state)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Approval.name.ilike(search_fmt)) |
            (Approval.code.ilike(search_fmt)) |
            (Approval.ministry.ilike(search_fmt))
        )
    return query.all()


@app.get("/api/institution/profile", tags=["Institution Applicant"])
def get_institution_profile(db: Session = Depends(get_db)):
    """Fetch institution applicant profile and affiliation details."""
    inst = db.query(Institution).first()
    if not inst:
        return {
            "id": 1,
            "name": "Vivekananda Institute of Technology & Management",
            "code": "1-10972345671",
            "type": "TECHNICAL_INSTITUTE",
            "category": "ENGINEERING_TECHNOLOGY",
            "address": "Sector 14, Institutional Area, Electronic City Phase 1",
            "city": "Bengaluru",
            "state": "Karnataka",
            "pin_code": "560100",
            "established_year": 2012,
            "current_status": "APPROVED",
            "accreditation_status": "NAAC A+ (3.32 CGPA), NBA Accredited (CSE, ECE)",
            "aicte_permanent_id": "1-10972345671",
            "affiliating_university": "Visvesvaraya Technological University (VTU), Belagavi",
            "authorized_signatory": "Dr. Ramesh Chandra Sharma (Principal / Director)",
            "contact_email": "principal@vitm.edu.in",
            "contact_phone": "+91 80 2852 0900"
        }
    return {
        "id": inst.id,
        "name": inst.name,
        "code": inst.code,
        "type": inst.type,
        "category": inst.category,
        "address": inst.address,
        "city": inst.city,
        "state": inst.state,
        "pin_code": inst.pin_code,
        "established_year": inst.established_year,
        "current_status": inst.current_status,
        "accreditation_status": inst.accreditation_status or "NAAC A+ (3.32 CGPA), NBA Accredited (CSE, ECE)",
        "aicte_permanent_id": inst.aicte_permanent_id or "1-10972345671",
        "affiliating_university": "Visvesvaraya Technological University (VTU), Belagavi",
        "authorized_signatory": "Dr. Ramesh Chandra Sharma (Principal / Director)",
        "contact_email": "principal@vitm.edu.in",
        "contact_phone": "+91 80 2852 0900"
    }


@app.get("/api/institution/applications", tags=["Institution Applicant"])
def get_institution_applications(db: Session = Depends(get_db)):
    """List applications submitted or drafted by the institution."""
    apps = db.query(Application).all()
    results = []
    for a in apps:
        deficiencies_count = db.query(Deficiency).filter(Deficiency.application_id == a.id, Deficiency.status == "OPEN").count()
        results.append({
            "id": a.id,
            "reference_no": a.reference_no,
            "status": a.status,
            "current_stage": a.current_stage,
            "submitted_at": a.submitted_at.isoformat() if a.submitted_at else None,
            "updated_at": a.updated_at.isoformat() if a.updated_at else None,
            "open_deficiencies": deficiencies_count,
            "submission_fee_paid": bool(a.submission_fee_paid)
        })
    return results

