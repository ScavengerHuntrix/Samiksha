import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    print("Health check response:", response.status_code, response.json())
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database_connected"] is True
    assert data["active_rule_version"] == "APH-2024-27-v1.0"
    print("Health check PASSED!")

def test_system_info():
    response = client.get("/api/system/info")
    print("System info response:", response.status_code, response.json())
    assert response.status_code == 200
    data = response.json()
    assert len(data["roles"]) == 8
    print("System info PASSED!")

def test_approvals():
    response = client.get("/api/approvals")
    print("Approvals response:", response.status_code, f"Found {len(response.json())} approvals")
    assert response.status_code == 200
    assert len(response.json()) >= 4
    print("Approvals check PASSED!")

if __name__ == "__main__":
    test_health()
    test_system_info()
    test_approvals()
    print("\nALL BACKEND PHASE 1 CHECKS PASSED SUCCESSFULLY!")
