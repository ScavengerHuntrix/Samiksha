"""
SAMIKSHA Scrutiny Committee & AI Document Validation Test Suite
Tests Role 2 Scrutiny Dashboard, PaddleOCR, OpenCV, Sentence-BERT,
Deficiency Management, and Re-Scrutiny Workflows.
Adheres strictly to the 5 primary validation statuses:
- Verified
- Mismatch Detected
- Document Tampered
- Source Unavailable
- Manual Review Needed
"""

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Application, Deficiency, WorkflowEvent
from app.services.cv_service import OpenCVDocumentService
from app.services.ocr_service import PaddleOCRDocumentService
from app.services.sbert_service import SentenceBERTComparisonService
from app.services.scrutiny_pipeline import ScrutinyValidationPipeline

client = TestClient(app)


def test_opencv_service():
    print("\n--- 1. Testing OpenCV Document Image Service ---")
    cv_service = OpenCVDocumentService()
    # Test on synthetic image array
    import numpy as np
    blank_img = np.ones((1000, 750, 3), dtype=np.uint8) * 255
    res = cv_service.preprocess_document_image(blank_img, "test_doc", 1)
    assert res["denoised"] is True
    assert res["binarized"] is True
    print("[PASS] OpenCV preprocessing (deskew, denoise, adaptive binarization) operational.")

    analysis_res = cv_service.analyze_visual_anomalies(blank_img, "State NOC Certificate", 1)
    assert isinstance(analysis_res, dict)
    assert "checks_completed" in analysis_res
    assert "findings" in analysis_res
    print(f"[PASS] OpenCV visual anomaly checks completed (checks: {analysis_res['checks_completed']}, anomalies: {analysis_res['anomalies_detected']}).")


def test_paddleocr_service():
    print("\n--- 2. Testing PaddleOCR Document Text Service ---")
    ocr_service = PaddleOCRDocumentService()
    # Test regex entity extractor
    sample_text = (
        "GOVERNMENT OF MAHARASHTRA\n"
        "Vivekananda Institute of Technology & Management\n"
        "Fire Safety NOC Order No: DTE/NOC/2023/8892 dated 15/02/2023\n"
        "Land parcel admeasuring 7.50 Acres at Katraj-Kondhwa Bypass Road.\n"
        "Signed by Dr. S. K. Kulkarni (Principal)"
    )
    entities = ocr_service._extract_regulatory_entities(sample_text)
    assert len(entities["institutions_detected"]) > 0
    assert "7.50 Acres" in entities["land_measurements"]
    assert "15/02/2023" in entities["dates_detected"]
    assert "DTE/NOC/2023/8892" in entities["certificate_numbers"]
    print("[PASS] PaddleOCR entity parser extracted: institutions, dates, certificate numbers, land measurements.")


def test_sbert_service():
    print("\n--- 3. Testing Sentence-BERT Semantic Text Comparison Service ---")
    sbert_service = SentenceBERTComparisonService()

    # Identical text
    sim_exact = sbert_service.compute_similarity("Vivekananda Institute", "Vivekananda Institute")
    assert sim_exact == 1.0

    # Semantically aligned text
    text_a = "Vivekananda Institute of Technology & Management"
    text_b = "Vivekananda Institute of Technology and Management, Pune"
    res = sbert_service.compare_field_passages(
        field_type="INSTITUTION_NAME",
        field_name="Institution Legal Name",
        text_a=text_a,
        source_a_label="Application Profile",
        text_b=text_b,
        source_b_label="Registered Land Sale Deed",
        page_a=1,
        page_b=1,
        custom_threshold=0.850
    )
    assert res["similarity_score"] >= 0.850
    assert res["status"] == "Verified"
    print(f"[PASS] SBERT semantic comparison operational (Score: {res['similarity_score'] * 100:.1f}% -> {res['status']}).")


def test_scrutiny_api_endpoints():
    print("\n--- 4. Testing Scrutiny API Endpoints ---")
    # A. Applications queue
    resp = client.get("/api/scrutiny/applications")
    assert resp.status_code == 200
    data = resp.json()
    metrics = data["metrics"]
    apps = data["applications"]
    print(f"[PASS] GET /api/scrutiny/applications: Found {len(apps)} apps (Total assigned: {metrics['total_assigned']}).")
    assert metrics["total_assigned"] >= 3

    # B. Application Detail
    app_id = apps[0]["id"]
    detail_resp = client.get(f"/api/scrutiny/applications/{app_id}")
    assert detail_resp.status_code == 200
    detail = detail_resp.json()
    assert detail["aph_version"] == "APH-2024-27-v1.0"
    print(f"[PASS] GET /api/scrutiny/applications/{app_id}: Bound to APH version '{detail['aph_version']}'.")

    # C. Document Checklist with 5 Primary Statuses
    check_resp = client.get(f"/api/scrutiny/applications/{app_id}/checklist")
    assert check_resp.status_code == 200
    checklist = check_resp.json()["checklist"]
    assert len(checklist) >= 5
    valid_statuses = {"Verified", "Mismatch Detected", "Document Tampered", "Source Unavailable", "Manual Review Needed"}
    for item in checklist:
        assert item["current_status"] in valid_statuses
    print(f"[PASS] GET /api/scrutiny/applications/{app_id}/checklist: {len(checklist)} statutory items validated with primary statuses.")

    # D. Full AI Validation Run
    val_resp = client.post(f"/api/scrutiny/applications/{app_id}/validate-documents")
    assert val_resp.status_code == 200
    val_data = val_resp.json()
    assert "cross_document_inconsistencies" in val_data
    assert "aph_rule_findings" in val_data
    assert "visual_anomaly_findings" in val_data
    assert "semantic_comparison_findings" in val_data
    assert "validation_score" in val_data
    score_info = val_data["validation_score"]
    print(f"[PASS] POST /api/scrutiny/applications/{app_id}/validate-documents: Validation score: {score_info['score_label']}, rating: '{score_info['rating']}'.")

    # E. Save Officer Findings
    save_resp = client.post(
        f"/api/scrutiny/applications/{app_id}/findings",
        json={
            "officer_id": "AICTE-SCR-0001",
            "general_observations": "Automated verification audit test run.",
            "checklist_updates": [
                {"code": "DOC-LAND", "status": "Mismatch Detected", "remarks": "0.30 acre discrepancy noted."}
            ],
            "deficiencies": []
        }
    )
    assert save_resp.status_code == 200
    assert save_resp.json()["status"] == "SAVED"
    print(f"[PASS] POST /api/scrutiny/applications/{app_id}/findings: Saved successfully.")


def test_rescrutiny_workflow():
    print("\n--- 5. Testing Re-Scrutiny Workflow ---")
    resp = client.get("/api/scrutiny/applications?status_filter=RE_SCRUTINY")
    assert resp.status_code == 200
    rescrutiny_apps = resp.json()["applications"]
    if len(rescrutiny_apps) > 0:
        res_app_id = rescrutiny_apps[0]["id"]
        res_dossier = client.get(f"/api/scrutiny/applications/{res_app_id}/rescrutiny")
        assert res_dossier.status_code == 200
        d_data = res_dossier.json()
        assert d_data["is_rescrutiny_mode"] is True
        assert len(d_data["deficiencies"]) > 0
        first_def = d_data["deficiencies"][0]
        assert "applicant_response" in first_def
        print(f"[PASS] GET /api/scrutiny/applications/{res_app_id}/rescrutiny: Dossier contains {len(d_data['deficiencies'])} deficiency item(s) with institution response.")


if __name__ == "__main__":
    test_opencv_service()
    test_paddleocr_service()
    test_sbert_service()
    test_scrutiny_api_endpoints()
    test_rescrutiny_workflow()
    print("\n=======================================================")
    print("ALL SAMIKSHA SCRUTINY & AI VALIDATION TESTS PASSED (100%)")
    print("=======================================================")
