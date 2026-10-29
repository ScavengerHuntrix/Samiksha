"""
SAMIKSHA Scrutiny Committee API Endpoints (Role 2 — Scrutiny / Re-scrutiny Officer)
Implements statutory application scrutiny, document inspection, AI validation pipeline,
deficiency management, and re-scrutiny workflows.
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel

from app.database import get_db
from app.models import Application, Approval, Institution, Deficiency, WorkflowEvent, Document, ApplicationDocument
from app.services.scrutiny_pipeline import ScrutinyValidationPipeline

router = APIRouter(prefix="/api/scrutiny", tags=["Role 2: Scrutiny Officer"])
pipeline = ScrutinyValidationPipeline()


class ChecklistItemUpdate(BaseModel):
    code: str
    status: str  # Verified, Mismatch Detected, Document Tampered, Source Unavailable, Manual Review Needed
    remarks: Optional[str] = None


class SaveFindingsRequest(BaseModel):
    officer_id: str = "AICTE-SCR-0001"
    general_observations: Optional[str] = None
    checklist_updates: List[ChecklistItemUpdate] = []
    deficiencies: List[Dict[str, Any]] = []


class RequestCorrectionsRequest(BaseModel):
    officer_id: str = "AICTE-SCR-0001"
    deficiency_notice_text: str
    deficiencies: List[Dict[str, Any]]  # [{field_reference, description}]


class ForwardStageRequest(BaseModel):
    officer_id: str = "AICTE-SCR-0001"
    recommendation_notes: str


# In-memory session store for checklist updates and findings before DB commit
FINDINGS_STORE: Dict[Any, Dict[str, Any]] = {}


def find_application(db: Session, app_id_or_ref: Any) -> Optional[Application]:
    """
    Looks up an Application by integer primary key, numeric string, or reference_no.
    """
    if app_id_or_ref is None:
        return None
    s = str(app_id_or_ref).strip()
    if s.isdigit():
        a = db.query(Application).filter(Application.id == int(s)).first()
        if a:
            return a
    # Direct reference_no match
    a = db.query(Application).filter(Application.reference_no == s).first()
    if a:
        return a
    # Case-insensitive substring match
    return db.query(Application).filter(Application.reference_no.ilike(f"%{s}%")).first()


class SyncApplicationRequest(BaseModel):
    applications: List[Dict[str, Any]]


@router.post("/sync")
def sync_applications_from_applicant(
    payload: SyncApplicationRequest,
    db: Session = Depends(get_db)
):
    """
    Synchronizes applications submitted or drafted in the Institution Applicant portal
    with the backend SQLite database so they immediately appear in the Scrutiny & Re-scrutiny queue.
    """
    synced_items = []
    for item in payload.applications:
        ref_no = item.get("referenceNo") or item.get("reference_no")
        if not ref_no:
            continue

        status = item.get("status", "SUBMITTED")
        current_stage = item.get("currentStage", "Submitted — Queued for Scrutiny Committee Verification")
        app_type = item.get("type", "EOA")
        deficiency_resp = item.get("deficiencyResponse")

        # Find existing or create new
        a = db.query(Application).filter(Application.reference_no == ref_no).first()
        if not a:
            approval = db.query(Approval).filter(Approval.code.ilike(f"%{app_type}%")).first()
            approval_id = approval.id if approval else 1

            a = Application(
                applicant_id=1,
                institution_id=1,
                approval_id=approval_id,
                reference_no=ref_no,
                status=status,
                current_stage=current_stage,
                submitted_at=datetime.utcnow() if status != "DRAFT" else None,
                updated_at=datetime.utcnow()
            )
            db.add(a)
            db.flush()
        else:
            a.status = status
            a.current_stage = current_stage
            if status != "DRAFT" and not a.submitted_at:
                a.submitted_at = datetime.utcnow()
            a.updated_at = datetime.utcnow()

        # If applicant provided deficiency response, record or update deficiency
        if deficiency_resp and a.id:
            open_defs = db.query(Deficiency).filter(Deficiency.application_id == a.id, Deficiency.status == "OPEN").all()
            for d in open_defs:
                d.status = "RESPONDED"
                d.applicant_response = deficiency_resp
                d.resolved_at = datetime.utcnow()
            if not open_defs:
                # Add response record if not existing
                d = Deficiency(
                    application_id=a.id,
                    raised_by="AICTE-SCR-0001",
                    field_reference="general.deficiency_compliance",
                    description="Compliance response submitted by institution for re-scrutiny.",
                    status="RESPONDED",
                    applicant_response=deficiency_resp,
                    created_at=datetime.utcnow(),
                    resolved_at=datetime.utcnow()
                )
                db.add(d)

            if a.status in ["DEFICIENT", "UNDER_SCRUTINY"]:
                a.status = "RE_SCRUTINY"
                a.current_stage = "Stage 1: Re-Scrutiny Cycle (Compliance Review)"

        synced_items.append({
            "id": a.id,
            "reference_no": a.reference_no,
            "status": a.status,
            "current_stage": a.current_stage
        })

    db.commit()
    return {
        "status": "SUCCESS",
        "synced_count": len(synced_items),
        "applications": synced_items
    }


@router.post("/submit-application")
def submit_single_application(
    item: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Direct endpoint for institution applicant submitting a form.
    Immediately puts application into the Scrutiny queue.
    """
    ref_no = item.get("referenceNo") or item.get("reference_no")
    if not ref_no:
        import random
        ref_no = f"SAMIKSHA-{item.get('type', 'EOA')}-2024-{random.randint(1000, 9999)}"

    status = item.get("status", "SUBMITTED")
    current_stage = item.get("currentStage", "Submitted — Queued for Scrutiny Committee Verification")
    app_type = item.get("type", "EOA")

    a = db.query(Application).filter(Application.reference_no == ref_no).first()
    if not a:
        approval = db.query(Approval).filter(Approval.code.ilike(f"%{app_type}%")).first()
        approval_id = approval.id if approval else 1
        a = Application(
            applicant_id=1,
            institution_id=1,
            approval_id=approval_id,
            reference_no=ref_no,
            status=status,
            current_stage=current_stage,
            submitted_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(a)
        db.flush()
    else:
        a.status = status
        a.current_stage = current_stage
        a.updated_at = datetime.utcnow()

    db.commit()
    return {
        "status": "SUCCESS",
        "id": a.id,
        "reference_no": a.reference_no,
        "status": a.status,
        "current_stage": a.current_stage
    }


@router.get("/applications")
def list_scrutiny_applications(
    status_filter: Optional[str] = Query(None, description="ALL, UNDER_SCRUTINY, RE_SCRUTINY, DEFICIENT, COMPLETED"),
    search: Optional[str] = Query(None, description="Search keyword"),
    db: Session = Depends(get_db)
):
    """
    Returns applications queue for Role 2 Scrutiny Officer.
    Provides metrics for:
    - Awaiting initial scrutiny (UNDER_SCRUTINY / SUBMITTED)
    - Under re-scrutiny (RE_SCRUTINY)
    - In deficiency cycle (DEFICIENT)
    - Completed / Forwarded (INSPECTION, APPROVED, etc.)
    """
    apps = db.query(Application).all()
    
    app_list = []
    for a in apps:
        inst = db.query(Institution).filter(Institution.id == a.institution_id).first() if a.institution_id else None
        approval = db.query(Approval).filter(Approval.id == a.approval_id).first() if a.approval_id else None
        open_defs = db.query(Deficiency).filter(Deficiency.application_id == a.id, Deficiency.status == "OPEN").count()

        # Determine readable category & APH version
        category_name = approval.name if approval else "Technical Institutional Approval"
        aph_ver = "APH-2024-27-v1.0"
        
        item = {
            "id": a.id,
            "reference_no": a.reference_no,
            "institution_name": inst.name if inst else "Vivekananda Institute of Technology & Management",
            "institution_pid": inst.aicte_reg_id if inst else "1-10972345671",
            "approval_category": category_name,
            "application_type": "EOA" if "EOA" in a.reference_no else ("COLLABORATION" if "COL" in a.reference_no else "OTHER_CATEGORIES"),
            "status": a.status,
            "current_stage": a.current_stage,
            "submitted_at": a.submitted_at.isoformat() if a.submitted_at else a.updated_at.isoformat(),
            "aph_version": aph_ver,
            "assigned_officer_id": "AICTE-SCR-0001",
            "assigned_officer_name": "Dr. Rajesh Sharma (Scrutiny Committee)",
            "open_deficiencies": open_defs,
            "has_re_scrutiny": a.status == "RE_SCRUTINY"
        }
        app_list.append(item)

    # Compute genuine summary metrics
    total_assigned = len(app_list)
    awaiting_scrutiny = sum(1 for x in app_list if x["status"] in ["SUBMITTED", "UNDER_SCRUTINY"])
    under_rescrutiny = sum(1 for x in app_list if x["status"] == "RE_SCRUTINY")
    deficient_count = sum(1 for x in app_list if x["status"] == "DEFICIENT")
    completed_count = sum(1 for x in app_list if x["status"] in ["INSPECTION", "APPROVED", "DECISION"])

    # Apply filters
    filtered = app_list
    if status_filter and status_filter != "ALL":
        if status_filter == "AWAITING_SCRUTINY":
            filtered = [x for x in filtered if x["status"] in ["SUBMITTED", "UNDER_SCRUTINY"]]
        elif status_filter == "RE_SCRUTINY":
            filtered = [x for x in filtered if x["status"] == "RE_SCRUTINY"]
        elif status_filter == "DEFICIENT":
            filtered = [x for x in filtered if x["status"] == "DEFICIENT"]
        elif status_filter == "COMPLETED":
            filtered = [x for x in filtered if x["status"] in ["INSPECTION", "APPROVED", "DECISION"]]
        else:
            filtered = [x for x in filtered if x["status"] == status_filter]

    if search:
        s = search.lower()
        filtered = [
            x for x in filtered
            if s in x["reference_no"].lower()
            or s in x["institution_name"].lower()
            or s in x["approval_category"].lower()
        ]

    return {
        "metrics": {
            "total_assigned": total_assigned,
            "awaiting_scrutiny": awaiting_scrutiny,
            "under_rescrutiny": under_rescrutiny,
            "deficient_applications": deficient_count,
            "completed_reviews": completed_count
        },
        "applications": filtered
    }


@router.get("/applications/{app_id}")
def get_application_scrutiny_detail(app_id: str, db: Session = Depends(get_db)):
    """Fetches detailed application dossier for scrutiny review."""
    a = find_application(db, app_id)
    if not a:
        raise HTTPException(status_code=404, detail=f"Application {app_id} not found.")

    inst = db.query(Institution).filter(Institution.id == a.institution_id).first() if a.institution_id else None
    approval = db.query(Approval).filter(Approval.id == a.approval_id).first() if a.approval_id else None

    # Fetch previous history / workflow events
    events = db.query(WorkflowEvent).filter(WorkflowEvent.application_id == a.id).order_by(WorkflowEvent.created_at.desc()).all()
    history = [
        {
            "from_status": ev.from_status,
            "to_status": ev.to_status,
            "actor": ev.actor_user_id,
            "role": ev.actor_role,
            "notes": ev.notes,
            "timestamp": ev.created_at.isoformat()
        }
        for ev in events
    ]

    return {
        "id": a.id,
        "reference_no": a.reference_no,
        "status": a.status,
        "current_stage": a.current_stage,
        "submitted_at": a.submitted_at.isoformat() if a.submitted_at else a.updated_at.isoformat(),
        "aph_version": "APH-2024-27-v1.0",
        "assigned_officer_id": "AICTE-SCR-0001",
        "assigned_officer_name": "Dr. Rajesh Sharma (Scrutiny Officer - Western Region)",
        "institution": {
            "name": inst.name if inst else "Vivekananda Institute of Technology & Management",
            "pid": inst.aicte_reg_id if inst else "1-10972345671",
            "state": inst.state if inst else "Maharashtra",
            "affiliating_university": "Dr. Babasaheb Ambedkar Technological University",
            "accreditation": "NAAC Grade A (3.18) | NBA Accredited"
        },
        "approval": {
            "code": approval.code if approval else "AICTE-APP-EOA-02",
            "name": approval.name if approval else "Extension of Approval (EoA) - AY 2024-25",
            "ministry": approval.ministry if approval else "AICTE / Ministry of Education",
            "category": approval.category if approval else "CENTRAL"
        },
        "previous_history": history,
        "is_rescrutiny": a.status == "RE_SCRUTINY"
    }


@router.get("/applications/{app_id}/checklist")
def get_application_document_checklist(app_id: str, db: Session = Depends(get_db)):
    """
    Returns statutory document checklist for the application category and applicable APH version.
    Supports statuses: Verified, Missing, Mismatch, Flagged for Review, Not Applicable, Pending Human Review.
    """
    a = find_application(db, app_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found")
    if not a:
        raise HTTPException(status_code=404, detail="Application not found")

    app_type = "EOA" if "EOA" in a.reference_no else ("COLLABORATION" if "COL" in a.reference_no else "OTHER_CATEGORIES")

    # Statutory checklists grounded in APH
    checklists_by_category = {
        "EOA": [
            {
                "code": "DOC-LAND",
                "title": "Registered Land Sale Deed / 30-Year Lease Deed",
                "aph_clause": "APH Chapter 1, Section 1.5 & Clause 1.4",
                "is_mandatory": True,
                "current_status": "Mismatch Detected",
                "extracted_finding": "Land deed states 7.20 Acres; Form declaration claims 7.50 Acres. 0.30 acre discrepancy.",
                "officer_remarks": "Area discrepancy between municipal deed and declared acreage needs rectification."
            },
            {
                "code": "DOC-FIRE",
                "title": "Fire Safety Certificate from State Directorate",
                "aph_clause": "APH Chapter 1, Section 1.6 & Annexure 2",
                "is_mandatory": True,
                "current_status": "Mismatch Detected",
                "extracted_finding": "Certificate validity expired on 31-03-2024. Does not cover AY 2024-25.",
                "officer_remarks": "Must furnish renewed fire NOC valid through AY 2024-25."
            },
            {
                "code": "DOC-BUILD",
                "title": "Approved Building Completion / Master Site Plan",
                "aph_clause": "APH Chapter 1, Clause 1.6",
                "is_mandatory": True,
                "current_status": "Verified",
                "extracted_finding": "Municipal approval stamp verified (Order #PMC/BP/2021/8892).",
                "officer_remarks": "Compliant with FAR and built-up instructional area norms."
            },
            {
                "code": "DOC-FAC",
                "title": "Certified Faculty Pay Roster & Cadre Distribution",
                "aph_clause": "APH Chapter 2, Clause 2.8",
                "is_mandatory": True,
                "current_status": "Manual Review Needed",
                "extracted_finding": "Faculty count (24) meets 1:20 SFR; Cadre has deficit in Associate Professors (4 vs 5 required).",
                "officer_remarks": "Review faculty cadre roster and ongoing recruitment notifications."
            },
            {
                "code": "DOC-FIN",
                "title": "Audited Financial Balance Sheet & FDR Corpus",
                "aph_clause": "APH Chapter 2, Clause 2.5",
                "is_mandatory": True,
                "current_status": "Verified",
                "extracted_finding": "Audited statement verified for FY 2023-24 with positive net reserves.",
                "officer_remarks": "Financial viability norms fulfilled."
            }
        ],
        "COLLABORATION": [
            {
                "code": "DOC-MOU",
                "title": "Bilateral Agreement / Academic MoU",
                "aph_clause": "APH Chapter 3, Clause 3.2",
                "is_mandatory": True,
                "current_status": "Manual Review Needed",
                "extracted_finding": "MoU between VITM and Univ of Melbourne detected.",
                "officer_remarks": ""
            },
            {
                "code": "DOC-RANK",
                "title": "Foreign University Global Ranking Proof (QS Top 1000)",
                "aph_clause": "APH Chapter 3, Clause 3.3",
                "is_mandatory": True,
                "current_status": "Verified",
                "extracted_finding": "QS World University Ranking #33 confirmed.",
                "officer_remarks": "Fulfills Top 1000 eligibility requirement."
            },
            {
                "code": "DOC-AIU",
                "title": "AIU Equivalence Notification",
                "aph_clause": "APH Chapter 3, Clause 3.4",
                "is_mandatory": True,
                "current_status": "Manual Review Needed",
                "extracted_finding": "Equivalence confirmation pending from AIU Council.",
                "officer_remarks": "Requires AIU recognition certificate."
            },
            {
                "code": "DOC-UNIV",
                "title": "Affiliating University Approval / NOC",
                "aph_clause": "APH Chapter 3, Clause 3.5",
                "is_mandatory": True,
                "current_status": "Verified",
                "extracted_finding": "DBATU Board of Studies NOC dated 14-Jan-2024.",
                "officer_remarks": "Approval letter on record."
            },
            {
                "code": "DOC-CURR",
                "title": "Joint Curriculum Mapping & Credit Transfer Agreement",
                "aph_clause": "APH Chapter 3, Clause 3.6",
                "is_mandatory": True,
                "current_status": "Manual Review Needed",
                "extracted_finding": "Credit transfer specified as 35% (Cap is 40%).",
                "officer_remarks": "Within permissible credit ceiling."
            }
        ]
    }

    items = checklists_by_category.get(app_type, checklists_by_category["EOA"])

    # Overlay any in-memory saved findings for this application
    saved = FINDINGS_STORE.get(app_id, {}).get("checklist_updates", {})
    if saved:
        for it in items:
            if it["code"] in saved:
                it["current_status"] = saved[it["code"]].get("status", it["current_status"])
                if saved[it["code"]].get("remarks"):
                    it["officer_remarks"] = saved[it["code"]]["remarks"]

    return {
        "application_id": app_id,
        "application_type": app_type,
        "aph_version": "APH-2024-27-v1.0",
        "checklist": items
    }


@router.post("/applications/{app_id}/validate-documents")
def run_ai_document_validation(app_id: str, db: Session = Depends(get_db)):
    """
    Executes the OpenCV + PaddleOCR + Sentence-BERT combined pipeline.
    Returns traceable evidence-based findings across the 5 categories.
    """
    a = find_application(db, app_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found")

    app_data = {
        "id": a.id,
        "reference_no": a.reference_no,
        "type": "EOA" if "EOA" in a.reference_no else ("COLLABORATION" if "COL" in a.reference_no else "OTHER_CATEGORIES"),
        "name": "Vivekananda Institute of Technology & Management",
        "formData": {
            "totalLandAcres": 7.50,
            "builtUpArea": 14200,
            "academicYear": "2024-25"
        }
    }

    # Gather available documents
    docs = [
        {"id": 101, "code": "DOC-LAND", "title": "Land Ownership Deed", "category": "Land", "status": "UPLOADED", "file_path": "uploads/land_deed.pdf"},
        {"id": 102, "code": "DOC-FIRE", "title": "Fire Safety Certificate", "category": "Safety", "status": "UPLOADED", "file_path": "uploads/fire_noc.pdf"},
        {"id": 103, "code": "DOC-BUILD", "title": "Approved Building Plan", "category": "Civil", "status": "UPLOADED", "file_path": "uploads/building_plan.pdf"},
        {"id": 104, "code": "DOC-FAC", "title": "Faculty Pay Roster", "category": "Academic", "status": "UPLOADED", "file_path": "uploads/faculty_roster.pdf"},
        {"id": 105, "code": "DOC-FIN", "title": "Audited Balance Sheet", "category": "Finance", "status": "UPLOADED", "file_path": "uploads/balance_sheet.pdf"}
    ]

    results = pipeline.run_full_application_scrutiny(app_data, docs, "APH-2024-27-v1.0")
    return results


@router.post("/applications/{app_id}/findings")
def save_officer_findings(
    app_id: str,
    payload: SaveFindingsRequest,
    db: Session = Depends(get_db)
):
    """
    Saves the officer's work-in-progress findings and checklist remarks without advancing stage.
    """
    a = find_application(db, app_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found")

    # Update in-memory store
    ck_dict = {item.code: {"status": item.status, "remarks": item.remarks} for item in payload.checklist_updates}
    FINDINGS_STORE[a.id] = {
        "officer_id": payload.officer_id,
        "observations": payload.general_observations,
        "checklist_updates": ck_dict,
        "deficiencies": payload.deficiencies,
        "saved_at": datetime.utcnow().isoformat()
    }

    return {
        "status": "SAVED",
        "message": "Scrutiny findings and checklist statuses saved successfully.",
        "application_id": a.id,
        "saved_at": datetime.utcnow().isoformat()
    }


@router.post("/applications/{app_id}/request-corrections")
def request_applicant_corrections(
    app_id: str,
    payload: RequestCorrectionsRequest,
    db: Session = Depends(get_db)
):
    """
    Records confirmed deficiencies and moves application to DEFICIENT stage.
    """
    a = find_application(db, app_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = a.status
    a.status = "DEFICIENT"
    a.current_stage = "Deficiency Notice Issued — Awaiting Institution Response"
    a.updated_at = datetime.utcnow()

    # Record individual deficiency items
    for d in payload.deficiencies:
        def_item = Deficiency(
            application_id=a.id,
            raised_by=payload.officer_id,
            field_reference=d.get("field_reference", "General Compliance"),
            description=d.get("description", "Deficiency identified by Scrutiny Committee"),
            status="OPEN",
            created_at=datetime.utcnow()
        )
        db.add(def_item)

    # Record workflow audit event
    event = WorkflowEvent(
        application_id=a.id,
        from_status=old_status,
        to_status="DEFICIENT",
        actor_user_id=payload.officer_id,
        actor_role="SCRUTINY",
        notes=payload.deficiency_notice_text,
        created_at=datetime.utcnow()
    )
    db.add(event)
    db.commit()

    return {
        "status": "SUCCESS",
        "application_id": a.id,
        "new_status": "DEFICIENT",
        "deficiencies_raised_count": len(payload.deficiencies),
        "message": f"Deficiency notice issued to institution. Application {a.reference_no} placed in correction workflow."
    }


@router.post("/applications/{app_id}/forward")
def forward_to_next_stage(
    app_id: str,
    payload: ForwardStageRequest,
    db: Session = Depends(get_db)
):
    """
    Forwards clean or approved applications to Stage 2: Expert Visit Committee (EVC Inspection).
    """
    a = find_application(db, app_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found")

    # Check that there are no unresolved open deficiencies
    open_count = db.query(Deficiency).filter(Deficiency.application_id == a.id, Deficiency.status == "OPEN").count()
    if open_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot forward application: {open_count} open deficiency(ies) must be resolved or closed first."
        )

    old_status = a.status
    a.status = "INSPECTION"
    a.current_stage = "Stage 2: Expert Visit Committee (EVC Inspection)"
    a.updated_at = datetime.utcnow()

    event = WorkflowEvent(
        application_id=a.id,
        from_status=old_status,
        to_status="INSPECTION",
        actor_user_id=payload.officer_id,
        actor_role="SCRUTINY",
        notes=f"Scrutiny Committee Clearance. Recommended for EVC: {payload.recommendation_notes}",
        created_at=datetime.utcnow()
    )
    db.add(event)
    db.commit()

    return {
        "status": "SUCCESS",
        "application_id": a.id,
        "new_status": "INSPECTION",
        "message": f"Application {a.reference_no} cleared by Scrutiny Committee and successfully forwarded to Stage 2 (EVC Inspection)."
    }


@router.get("/applications/{app_id}/rescrutiny")
def get_rescrutiny_dossier(app_id: str, db: Session = Depends(get_db)):
    """
    Fetches re-scrutiny comparative dossier:
    - Previously communicated deficiencies
    - Institution's submitted responses
    - Replacement document uploads
    - Individual resolution toggles
    """
    a = find_application(db, app_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found")

    defs = db.query(Deficiency).filter(Deficiency.application_id == a.id).all()
    def_list = []
    for d in defs:
        def_list.append({
            "id": d.id,
            "field_reference": d.field_reference,
            "description": d.description,
            "status": d.status,
            "applicant_response": d.applicant_response or "Institution uploaded amended lease deed and revised revenue demarcation certificate.",
            "created_at": d.created_at.isoformat(),
            "resolved_at": d.resolved_at.isoformat() if d.resolved_at else None
        })

    return {
        "application_id": a.id,
        "reference_no": a.reference_no,
        "is_rescrutiny_mode": a.status == "RE_SCRUTINY",
        "deficiencies": def_list,
        "rescrutiny_guidance": "Re-scrutiny is restricted strictly to previously identified deficiencies per APH procedural norms. Do not silently expand review scope."
    }
