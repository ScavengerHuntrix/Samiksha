# SAMIKSHA Platform — Complete Project Context & Handoff Master Document

> **Platform Name:** SAMIKSHA (AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification)  
> **Target Event / Purpose:** Smart India Hackathon (SIH) Prototype  
> **Statutory Basis:** AICTE Approval Process Handbook (APH 2024-25 to 2026-27) & National Single Window System (NSWS) Integration  
> **Last Updated:** October 28, 2026 (Audit & Consistency Verification Completed)  
> **Maintainer Instruction:** *Whenever ANY modification, new feature, bugfix, or backend/frontend change is made, this file MUST be updated immediately to preserve full continuity for any future developer or agent.*

---

## 1. Executive Summary

**SAMIKSHA** is an end-to-end simulated regulatory and compliance automation platform built for India's higher technical education regulatory body (**All India Council for Technical Education - AICTE**, Ministry of Education) and integrated with the **National Single Window System (NSWS)** paradigm.

The system addresses critical challenges in technical education approvals:
1. **Manual Scrutiny Delays:** Automates multi-tiered pre-submission document inspection using rule engines and AI analysis.
2. **Document Tampering & Fraud Detection:** Validates digital signatures, creation metadata timestamps, OCR text alignment, and certificate validity dates.
3. **Cross-Document Discrepancies:** Identifies conflicting data across disparate documents (e.g., Land Title Deed area vs. Municipal Site Plan, Fire NOC coverage vs. Building Completion Plan, Faculty Roster vs. Cadre Ratios).
4. **Statutory Committee Orchestration:** Automates application routing across 8 distinct administrative and quasi-judicial roles (Scrutiny, Inspection/EVC, Coordination, Hearing/SHC, Appellate/SAC, Decision Authority).

---

## 2. Dual-Portal Architecture & Routing Map

The application is structured into two integrated portals:
- **Portal A (NSWS - National Single Window):** Public-facing discovery and investor portal.
- **Portal B (AICTE Regulatory Platform):** Institutional and officer compliance portal (primary root `/`).

### Complete Route Table

| URL Route | Portal | Layout Wrapper | Access Level / Role | Component File Path | Status |
|:---|:---:|:---:|:---:|:---|:---:|
| `/` | B | `AICTELayout` | Public / All | `src/portals/aicte/AICTEHomePage.tsx` | **Complete** |
| `/aicte` | B | `AICTELayout` | Public / All | `src/portals/aicte/AICTEHomePage.tsx` | **Complete** |
| `/aicte/login` | B | `AICTELayout` | Public | `src/portals/aicte/AICTELoginPage.tsx` | **Complete** |
| `/aicte/forgot-password` | B | `AICTELayout` | Public | `src/portals/aicte/AICTEForgotPasswordPage.tsx` | **Complete** |
| `/aicte/admin/rules` | B | `AICTELayout` | Rules Admin (`RULES_ADMIN`) | `src/portals/aicte/AICTERulesPage.tsx` | **Complete** |
| `/aicte/inbox` | B | `AICTELayout` | Authenticated Officers | `src/portals/aicte/AICTEInboxPage.tsx` | **Complete** |
| `/institution/dashboard` | B | `AICTELayout` | Institution Applicant (`APPLICANT`) | `src/portals/institution/InstitutionDashboardPage.tsx` | **Complete** |
| `/institution/applications/eoa` | B | `AICTELayout` | Institution Applicant | `src/portals/institution/EOAApplicationPage.tsx` | **Complete** |
| `/institution/applications/collaboration` | B | `AICTELayout` | Institution Applicant | `src/portals/institution/CollaborationApplicationPage.tsx` | **Complete** |
| `/institution/applications/university` | B | `AICTELayout` | Institution Applicant | `src/portals/institution/UniversityApplicationPage.tsx` | **Complete** |
| `/institution/applications/odl-online` | B | `AICTELayout` | Institution Applicant | `src/portals/institution/ODLOnlineApplicationPage.tsx` | **Complete** |
| `/institution/applications/other-categories`| B | `AICTELayout` | Institution Applicant | `src/portals/institution/OtherCategoriesApplicationPage.tsx` | **Complete** |
| `/aicte/dashboard/scrutiny` | B | `AICTELayout` | Scrutiny Officer (`SCRUTINY`) | `src/portals/aicte/scrutiny/ScrutinyDashboardPage.tsx` | **Complete** |
| `/aicte/scrutiny/review/:appId` | B | `AICTELayout` | Scrutiny Officer (`SCRUTINY`) | `src/portals/aicte/scrutiny/ScrutinyWorkspacePage.tsx` | **Complete** |
| `/aicte/dashboard/:role` | B | `AICTELayout` | Roles 3 to 7 Officers | `src/App.tsx` (`OfficerDashboardPlaceholder`) | **Placeholder** (Next Task) |
| `/nsws` | A | `NSWSLayout` | Public | `src/portals/nsws/HomePage.tsx` | **Complete** |
| `/nsws/about` or `/about` | A | `NSWSLayout` | Public | `src/portals/nsws/AboutPage.tsx` | **Complete** |
| `/nsws/approvals` or `/approvals` | A | `NSWSLayout` | Public | `src/portals/nsws/ApprovalsPage.tsx` | **Complete** |
| `/nsws/know-your-approvals` | A | `NSWSLayout` | Public | `src/portals/nsws/KnowYourApprovalsPage.tsx` | **Complete** |
| `/nsws/login` or `/login` | A | `NSWSLayout` | Public | `src/portals/nsws/LoginPage.tsx` | **Complete** |
| `/nsws/register` or `/register` | A | `NSWSLayout` | Public | `src/portals/nsws/RegisterPage.tsx` | **Complete** |
| `/nsws/dashboard` or `/dashboard` | A | `NSWSLayout` | Applicant | `src/App.tsx` (`ApplicantDashboardPlaceholder`) | **Complete** |

---

## 3. The 8 Supported Statutory Roles & Credentials

The system authenticates 8 distinct user roles as structured by AICTE regulations:

| Role # | Role Display Name | Code | Default ID | Default Password | Target Workspace |
|:---:|:---|:---:|:---|:---:|:---|
| **1** | Institution Applicant | `APPLICANT` | `applicant@demo.samiksha` | `Demo@1234` | `/institution/dashboard` |
| **2** | Scrutiny / Re-scrutiny Officer | `SCRUTINY` | `AICTE-SCR-0001` | `Demo@1234` | `/aicte/dashboard/scrutiny` |
| **3** | EVC / Inspection Officer | `EVC` | `AICTE-EVC-0001` | `Demo@1234` | `/aicte/dashboard/evc` |
| **4** | Regulation Bureau / Case Coordinator | `COORDINATOR` | `AICTE-REG-0001` | `Demo@1234` | `/aicte/dashboard/coordinator` |
| **5** | Standing Hearing Committee (SHC) Member | `SHC` | `AICTE-SHC-0001` | `Demo@1234` | `/aicte/dashboard/shc` |
| **6** | Standing Appellate Committee (SAC) Member | `SAC` | `AICTE-SAC-0001` | `Demo@1234` | `/aicte/dashboard/sac` |
| **7** | Authorized Decision Authority (Chairman/MS)| `AUTHORITY` | `AICTE-ADA-0001` | `Demo@1234` | `/aicte/dashboard/authority` |
| **8** | Dynamic Rules Administrator | `RULES_ADMIN`| `AICTE-ADM-0001` | `Demo@1234` | `/aicte/admin/rules` |

### Client Session State (in `localStorage`)
- `samiksha_auth_token`: Stored JWT token (`simulated_jwt_token_<userId>`)
- `samiksha_user_role`: User role code (e.g. `APPLICANT`, `SCRUTINY`, `RULES_ADMIN`)
- `samiksha_aicte_user_id`: Authenticated user ID (e.g. `AICTE-SCR-0001`)

---

## 4. Deep Dive: Institution Applicant Workflows (Role 1)

The applicant portal (`/institution/dashboard`) is a fully featured, stateful subsystem backed by [`institutionData.ts`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/data/institutionData.ts) and persisted in browser `localStorage`.

### A. The 5 Statutory Application Categories (APH 2024–27)

Every application follows a 4-step workflow header ([`ApplicationWorkflowHeader.tsx`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/components/ApplicationWorkflowHeader.tsx)):
`Step 1: Application Form Details -> Step 2: Upload Documents -> Step 3: Automated Scrutiny Report -> Step 4: Final Submission`.

1. **Extension of Approval (EoA) ([`EOAApplicationPage.tsx`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/EOAApplicationPage.tsx))**
   - **APH Grounding:** Chapter II, Clauses 2.1 to 2.5.
   - **Form Fields:** Track selection (Standard 1-Year EoA vs. 3-Year Extended EoA), NIRF Rank, QS Rank, NAAC Score (threshold >= 3.01), NBA Accredited % (threshold >= 30%), Autonomous HEI status, Total Approved Intake, Student Enrollment Ratio, Cadre Ratio (1:2:6), Total Land Acres (>= 7.5 rural), Built-up Area.
   - **Required Documents:** Land Registration Deed, Fire Safety NOC, Building Plan Approval, Audited Financial Statements, Faculty Cadre List.

2. **Collaboration & Twinning ([`CollaborationApplicationPage.tsx`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/CollaborationApplicationPage.tsx))**
   - **APH Grounding:** Chapter III, Clauses 3.1 to 3.6.
   - **Form Fields:** Partner Category (Foreign University Top 1000 QS/THE vs. National NIRF Top 200/NAAC A+), Foreign University Name & Country, Global Ranking, Collaboration Model (Twinning, Dual Degree, Joint Degree), Proposed Technical Program, Intake requested (capped at 60 / 1 division), Credit transfer % abroad (capped at 40%), Academic Year.
   - **Required Documents:** Bilateral MoU / Agreement, Foreign University Accreditation Credential, AIU Equivalence Certificate, Affiliating University Approval / NOC, Joint Curriculum Mapping document.

3. **University Technical Approval ([`UniversityApplicationPage.tsx`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/UniversityApplicationPage.tsx))**
   - **APH Grounding:** Chapter IV, Clauses 4.1 to 4.5.
   - **Form Fields:** University Category (Central, State Public, State Private, Deemed to be University), Establishment Act / Gazette Notification Number, Year of Establishment, UGC Recognition Status (Section 2(f) and 12(B)), Campus Type (Main Campus vs. Approved Off-Campus), Number of Constituent Technical Departments, Total Proposed Intake, Contiguous Land Area Demarcation.
   - **Required Documents:** Gazette Notification / State Act, UGC 2(f)/12(B) Recognition Letter, Land Ownership / Title in University Name, Master Campus Plan & Department Demarcation, Statutory Academic Council Resolution.

4. **Open & Distance Learning (ODL) / Online ([`ODLOnlineApplicationPage.tsx`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/ODLOnlineApplicationPage.tsx))**
   - **APH Grounding:** Chapter V, Clauses 5.1 to 5.3.
   - **Form Fields:** Mode of Offering (ODL, 100% Online, Hybrid), Accreditations (NAAC >= 3.01 or NBA), Designated Centre for Distance & Online Education (CDOE) Establishment, Full-Time Professor as Director of CDOE, Number of Proposed Non-Prohibited Courses (PGDM, MBA, MCA, AI, Data Science), In-House Audio-Video Studio Facility, AI-Proctored Examination Platform, Prohibited Programs Compliance Confirmation (Engineering/Architecture/Hotel Mgmt disallowed in ODL).
   - **Required Documents:** Statutory Body / UGC-DEB Approval, CDOE Director Appointment & Faculty Cadre, E-Content Repository & LMS Demonstration, AI-Proctored Examination Vendor MoU, NAAC / NBA Accreditation Certificate.

5. **Other Applicable Categories ([`OtherCategoriesApplicationPage.tsx`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/OtherCategoriesApplicationPage.tsx))**
   - **APH Grounding:** Chapter II, Clauses 2.6, 2.7, 2.9, 2.15.
   - **Form Fields:** Sub-Category (Increase in Intake in Existing Course, Addition of New Course/Division, Courses for Working Professionals with Flexible Timings, Introduction of Supernumerary Quota for FN/OCI/NRI, Conversion of Diploma to Degree or Vice-Versa), Target Department, Current Intake vs. Additional Intake Requested, Additional Instructional Area, Dedicated Laboratories Added, Working Professionals Schedule (Evening & Saturday Batches), Minimum Work Experience Requirement, Employer Sponsorship MoU.
   - **Required Documents:** Affiliating University NOC for Intake Expansion, State Government No Objection Certificate (NOC), Detailed Project Report (DPR) with Infrastructure Plan, Industry / Employer MoUs (for Working Professionals), Audited Endowment Fund & Corpus Statement.

---

### B. The AI Pre-Submission Scrutiny Engine ([`ValidationAdvisoryReport.tsx`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/components/ValidationAdvisoryReport.tsx))

The scrutiny report provides 5 analytical tabs before an applicant commits their submission:

1. **Tab 1: Observations & Deficiencies:**
   - Categorized by severity: `DEFICIENCY` (Red, blocks clean approval), `WARNING` (Amber, scrutiny flag), `INFO` (Blue, advisory notice).
   - Each finding cites exact **APH Handbook Clause References**, field references, and concrete corrective actions.
2. **Tab 2: Configured Rule Checks:**
   - Displays real-time evaluation against codified rules (e.g., `APH-RULE-LAND-01`, `APH-RULE-DOC-FIRE-01`, `APH-RULE-FACULTY-01`, `APH-RULE-ODL-PROHIBIT-01`).
3. **Tab 3: Cross-Document Comparison Matrix:**
   - Compares form field inputs against data extracted from submitted PDFs.
   - *Example Checks:*
     - Land Title Deed Area (`7.50 Acres`) vs. Municipal Approved Site Plan (`7.20 Acres`) -> **Discrepancy (0.30 acre mismatch)**.
     - Fire Safety NOC Expiry Date (`2024-03-31`) vs. Academic Year (`2024-25`) -> **Discrepancy (Expired certificate)**.
     - Faculty List Cadre Ratio (`1:1.2:7.1`) vs. Statutory Standard (`1:2:6`) -> **Cadre Imbalance**.
4. **Tab 4: Scoring & Criteria Breakdown:**
   - Dynamic 0–100 score computed via weighted evaluation:
     - Land & Civil Infrastructure (Max 25 pts)
     - Faculty Cadre & Ratios (Max 25 pts)
     - Statutory Safety & Affiliation NOCs (Max 20 pts)
     - Academic Readiness & Curricula (Max 15 pts)
     - Financial Soundness & Reserves (Max 15 pts)
5. **Tab 5: Statutory Stage Progression:**
   - Visualizes the 5-stage AICTE regulatory journey:
     - Stage 1: Scrutiny / Re-scrutiny Committee
     - Stage 2: Expert Visit Committee (EVC Inspection)
     - Stage 3: Regulation Bureau & Regional Office Appraisal
     - Stage 4: Standing Hearing Committee / Appellate Committee (SHC/SAC)
     - Stage 5: Final Approval Decision & LoA Generation

---

### C. Role 2 — Scrutiny / Re-Scrutiny Committee Dashboard (`/aicte/dashboard/scrutiny` & `/aicte/scrutiny/review/:appId`)

Dedicated statutory workspace for **Role 2 — Scrutiny / Re-scrutiny Officer** (`AICTE-SCR-0001`, Dr. Rajesh Sharma), integrating OpenCV, PaddleOCR, and Sentence-BERT into the live regulatory verification pipeline.

1. **Scrutiny Dashboard (`ScrutinyDashboardPage.tsx`):**
   - **Metrics derived from persisted applications:** Total Assigned, Awaiting Scrutiny, Under Re-Scrutiny, Deficient Applications, Completed Reviews.
   - **Filter Tabs:** `ALL`, `AWAITING_SCRUTINY`, `RE_SCRUTINY`, `DEFICIENT`, `COMPLETED`.
   - **Search:** Instant query matching Application Reference Number, Institution Name, and Approval Category.
   - **Table:** Real database records displaying ID, PID, Category, Stage, Status, and direct action button `Open Workspace` / `Conduct Re-Scrutiny`.

2. **Application Review Workspace (`ScrutinyWorkspacePage.tsx`):**
   - **Section A (Application Details):** Institution name, PID, applied category, submission date, current stage, assigned officer, applicable handbook version (`APH-2024-27-v1.0`), and audit event history.
   - **Section B (Statutory Document Checklist):** Required documents per category/APH clause. Supports all 6 mandated statuses: `Verified`, `Missing`, `Mismatch`, `Flagged for Review`, `Not Applicable`, `Pending Human Review`, with extracted findings and editable officer remarks.
   - **Section C (Document Inspection Viewer):** Side-by-side inspection canvas with page navigation (`Page 1 of 4`), highlighted OpenCV anomaly bounding boxes, PaddleOCR structured entities (detected parcel, deed number, date, signatory), and original file download preserving uploaded evidence.
   - **Section D (SAMIKSHA AI Validation Results Panel):** Categorized findings across:
     - *Missing Documents or Information* (statutory mandatory checklist verification).
     - *Cross-Document Inconsistencies* (e.g. Land Deed 7.20 Acres vs Form Declaration 7.50 Acres, Fire NOC Expiry 31-03-2024 vs AY 2024-25).
     - *APH Handbook Rule Checks* (`APH-RULE-LAND-01`, `APH-RULE-DOC-FIRE-01`, `APH-RULE-FACULTY-01`).
     - *OpenCV Visual Anomalies & Tampering Checks* (Image resolution/DPI, Laplacian blur variance, official colored ink seal presence, rectangular edge splice boundaries).
     - *Sentence-BERT Semantic Comparisons* (Field-specific embeddings comparing legal name, trust title, and land use purpose with cosine similarity scores, thresholds, and human review guidance).
     - *Advisory Notice:* Explicit disclaimer that AI outputs are advisory and never substitute for authorized human officer determinations.
   - **Section E (Officer Findings & Deficiency Recorder):** General observations, linked deficiency recorder (field reference + description), distinguishing confirmed deficiencies from advisory AI flags.
   - **Section F (Consequential Workflow Actions):**
     - *Save Findings:* Persists review without advancing stage.
     - *Request Corrections (Deficiency Notice):* Confirmation modal with custom notice preamble, records open deficiencies in DB, transitions status to `DEFICIENT`.
     - *Forward to Next Stage (Clear & Recommend for EVC):* Validates zero open deficiencies, records recommendation notes, transitions status to `INSPECTION` (Stage 2).
   - **Section G (Re-Scrutiny Mode):** Activated automatically when application status is `RE_SCRUTINY`. Displays previously communicated deficiencies, applicant responses, updated replacement documents, and individual resolution toggles (`Mark as Resolved`), strictly adhering to APH scope without expanding review.


---

## 5. Backend Architecture & Database Specifications

- **Location:** `backend/`
- **Engine:** Python 3.11 with FastAPI and SQLAlchemy ORM.
- **Database:** SQLite at `backend/data/samiksha.db`.

### Database Schema Table Inventory

```
                                      SQLITE DATABASE SCHEMA
                                         (samiksha.db)
                                               │
  ┌───────────────────────┬────────────────────┼───────────────────────┬──────────────────────┐
  ▼                       ▼                    ▼                       ▼                      ▼
users / aicte_users   institutions         approvals             applications           rules / versions
- id                  - id                 - id                  - id                   - id
- email               - name               - code                - reference_no         - code
- role (1 to 8)       - aicte_permanent_id - category            - status               - aph_clause
- password_hash       - accreditation      - fee / sla_days      - current_stage        - threshold_val
                                                                       │
                                              ┌────────────────────────┴──────────────────────┐
                                              ▼                                               ▼
                                     deficiencies                                     workflow_events
                                     - id                                             - id
                                     - field_reference                                - from_status / to_status
                                     - description                                    - actor_user_id / actor_role
                                     - status (OPEN/RESPONDED)                        - notes
```

### Backend Models Summary (`backend/app/models/`)
1. **`User` & `AICTEUser` (`user.py`):** User accounts for NSWS applicants and AICTE regulatory officers.
2. **`Institution` (`institution.py`):** Institutional identity, address, permanent PID, accreditation details.
3. **`Approval` (`approval.py`):** Catalog of central/state regulatory approvals.
4. **`Application` & `ApplicationSection` (`application.py`):** Main application header and section JSON payloads.
   - Valid statuses: `DRAFT`, `SUBMITTED`, `UNDER_SCRUTINY`, `DEFICIENT`, `RE_SCRUTINY`, `INSPECTION`, `SHC_REVIEW`, `SAC_REVIEW`, `DECISION`, `APPROVED`, `REJECTED`.
5. **`WorkflowEvent` (`application.py`):** Immutable audit log of every state change and decision.
6. **`Deficiency` (`application.py`):** Scrutiny-raised defects, applicant responses, resolution dates.
7. **`Document` & `DocumentCheck` (`document.py`):** File uploads, hashes, digital signature checks, OCR texts.
8. **`ValidationRuleVersion` & `ValidationRule` (`rule.py`):** Dynamic rule sets tied to specific handbook versions.

### Existing FastAPI Endpoints (`backend/app/main.py`)
- `GET /api/health` -> Health status, DB connectivity, active rule version label.
- `GET /api/system/info` -> Simulation metadata and list of the 8 supported roles.
- `GET /api/approvals` -> Filter approvals by category (`CENTRAL`/`STATE`), state, or search keyword.
- `GET /api/institution/profile` -> Institution profile and affiliations.
- `GET /api/institution/applications` -> List applications with status and open deficiency counts.

---

## 6. How to Package and Run on Another Device (Self-Host Guide)

### A. How to Prepare & Zip the Project
When moving the project folder to another laptop or device, **DO NOT copy bulky build folders** (`node_modules` and Python `venv`), as they are huge (~400MB+) and must be freshly generated on the target device:

1. **Delete or exclude these folders before zipping:**
   - `frontend/node_modules/`
   - `frontend/dist/`
   - `backend/venv/`
   - `backend/__pycache__/` (and subfolder `__pycache__` folders)
2. **Keep everything else:**
   - `frontend/` (contains `package.json`, `src/`, `index.html`, etc.)
   - `backend/` (contains `requirements.txt`, `app/`, `data/samiksha.db`, `.env`, etc.)
   - `docs/`
   - `context.md`
3. Create a ZIP file of the remaining `samiksha 2` folder and transfer it (via USB drive, Google Drive, or GitHub).

---

### B. Prerequisites on the New Device
Ensure the new device has installed:
1. **Node.js** (v18, v20, or v22 LTS) — [Download from nodejs.org](https://nodejs.org/) (Includes `npm`)
2. **Python** (v3.10 or v3.11) — [Download from python.org](https://www.python.org/) (Check the box *"Add python.exe to PATH"* during installation)

---

### C. Step-by-Step Setup on the New Device

#### 1. Start the Backend (Terminal 1)
Open PowerShell (or Command Prompt / Terminal) and run:
```powershell
# 1. Navigate into the backend directory
cd "path/to/samiksha 2/backend"

# 2. Create a clean Python virtual environment
python -m venv venv

# 3. Activate the virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# (Note: If PowerShell shows a script execution error, run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass)
# On macOS / Linux:
# source venv/bin/activate

# 4. Install all Python dependencies
pip install -r requirements.txt

# 5. Initialize & seed the database (creates demo accounts & rules)
python app/seed.py

# 6. Start the FastAPI backend server
uvicorn app.main:app --reload --port 8000
```
Backend is now running and live at: **`http://localhost:8000`** (Swagger API Docs at `http://localhost:8000/docs`).

#### 2. Start the Frontend (Terminal 2)
Open a **second** terminal window and run:
```powershell
# 1. Navigate into the frontend directory
cd "path/to/samiksha 2/frontend"

# 2. Install all node packages
npm install

# 3. Start the Vite development server
npm run dev
```
Frontend is now running and live at: **`http://localhost:5173`**.

---

### D. Testing & Accessing the Portals
Open your web browser and navigate to:
1. **AICTE Regulatory Portal (Main Root):** `http://localhost:5173/`
2. **AICTE Login & Role Switcher:** `http://localhost:5173/aicte/login`
   - Select any role from the dropdown (Applicant, Scrutiny, EVC, etc.).
   - Password for all demo accounts: **`Demo@1234`**
3. **Institution Applicant Dashboard:** `http://localhost:5173/institution/dashboard`
   - Access metrics, submit applications for EoA, Collaboration, University, ODL, and Other Categories.
   - Run the pre-submission AI scrutiny engine.
4. **NSWS Public Portal:** `http://localhost:5173/nsws` (or `http://localhost:5173/approvals`)

---

## 7. Next Tasks for Continuation (Handoff Instructions)

When continuing development on this repository, proceed in the following prioritized order:

### Priority 1: Implement Dedicated Officer Workspaces (Roles 3 to 7)
*Note: Role 2 (Scrutiny / Re-scrutiny Officer) is fully implemented at `/aicte/dashboard/scrutiny` and `/aicte/scrutiny/review/:appId`.*
Replace remaining [`OfficerDashboardPlaceholder`](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/App.tsx#L25-L70) with specialized interactive pages:
1. **EVC / Inspection Officer Workspace (`/aicte/dashboard/evc` — Role 3):**
   - View assigned inspection cases.
   - Fill EVC verification report: physical land verification, live geotagged lab photos check, equipment checklist, and safety norms.
   - Submit EVC Report with recommendation (Recommended / Not Recommended with Deficiencies).
2. **Regulation Bureau / Case Coordinator (`/aicte/dashboard/coordinator` — Role 4):**
   - High-level bird's-eye view of all applications across all regional offices.
   - Schedule Standing Hearing Committee (SHC) hearings for institutions with unaddressed deficiencies.
3. **Hearing & Appellate Committee Workspaces (`/aicte/dashboard/shc` & `/aicte/dashboard/sac` — Roles 5 & 6):**
   - Calendar of scheduled quasi-judicial hearings.
   - Review applicant oral/written representations and deficiency responses.
   - Record committee recommendations (Grant Approval / Maintain Deficiencies / Refer to SAC).
4. **Authorized Decision Authority (`/aicte/dashboard/authority` — Role 7):**
   - Chairman / Member Secretary final review panel.
   - Issue digitally signed AICTE Letter of Approval (LoA) or Letter of Rejection (LoR) with printable preview.

### Priority 2: Backend REST API Integration
- Connect the frontend [institutionData.ts](file:///c:/Users/DELL/OneDrive/Documents/samiksha%202/frontend/src/portals/institution/data/institutionData.ts) client service to FastAPI endpoints:
  - `POST /api/applications` (Create/Save Draft)
  - `POST /api/applications/{id}/submit` (Final Submit)
  - `POST /api/applications/{id}/validate` (Run Scrutiny Engine)
  - `POST /api/applications/{id}/deficiencies/{def_id}/respond` (Submit Applicant Response)
  - `POST /api/officer/scrutiny/decision` (Issue Deficiencies / Recommend for EVC)

---

## 8. Role 2 Scrutiny Committee & AI Document Validation Architecture (Audit Completed)

Following the comprehensive **SAMIKSHA Scrutiny Validation Consistency Audit**, the Scrutiny Committee Dashboard (`/aicte/dashboard/scrutiny`) and Application Review Workspace (`/aicte/scrutiny/review/:appId`) adhere to strict regulatory compliance standards:

### A. The 5 Primary Validation Statuses
All checklist items, findings, badges, and rule evaluations map strictly to:
1. `Verified`: Document or rule check meets all statutory criteria and cross-document consistency checks.
2. `Mismatch Detected`: Contradiction detected between submitted declaration and source documents, or between documents.
3. `Document Tampered`: Reserved strictly for substantiated, corroborated forensic evidence. Edge/contour or compression flags ALONE never establish tampering.
4. `Source Unavailable`: Mandatory document or required field not provided in the submission packet.
5. `Manual Review Needed`: Visual anomalies, borderline semantic similarity, or recruitment deficits requiring authorized human inspection.

### B. Missing Checklist Logic
- Previous contradictory state ("Missing Checklist Items — 5" displaying 5 PASS entries) has been fixed.
- `_evaluate_missing_documents` returns **strictly genuinely missing documents**.
- When all 5 mandatory documents for an EoA application are uploaded, tab count = `0` and a clean empty state renders: *"All Mandatory Statutory Documents Present"*.
- Document presence is explicitly distinguished from document validity and regulatory compliance.

### C. Land-Area Separation & Calculation
Separates three distinct regulatory dimensions:
1. **Statutory Threshold Check:** Declared `7.50 Acres` >= `7.50 Acres` rural campus requirement (APH Chapter 1, Clause 1.4) -> `Verified`.
2. **Documentary Consistency Check:** Declared `7.50 Acres` vs. Registered Sale Deed `7.20 Acres` (Page 4, Schedule B) -> dynamically calculated: `|7.50 - 7.20| = 0.30 Acres` discrepancy -> `Mismatch Detected`.
3. **Evidence Verification:** Unverified title for remaining 0.30 acre parcel -> `Manual Review Needed`.
*Rule:* The overall land claim is not marked fully verified while the 0.30-acre discrepancy remains unresolved.

### D. Calibrated Sentence-BERT Comparisons
- **Institution Name:** 91.9% score vs. 85.0% threshold -> `Verified`. Note added: Semantic similarity does not establish legal entity identity.
- **Sponsoring Trust Title:** 84.7% score vs. 85.0% threshold -> `Manual Review Needed`. Explanation: Score 84.7% is below the calibrated threshold of 85.0% due to the phrase "& Charitable".
- **Infrastructure Purpose:** 79.2% score vs. 75.0% threshold -> `Verified`.

### E. OpenCV Image Inspection Clarification
- Clear separation between:
  - **Checks Completed (4):** Resolution/DPI, Laplacian Blur/Focus, Colored Official Seal Detection, Canny Edge Contour Analysis.
  - **Visual Anomalies Flagged (1):** Rectangular insertion border around Schedule B measurement line.
- Flagged finding is labeled `Manual Review Needed` (not `Document Tampered`).
- Explicit limitations note: Printed tables, schedules, and text boxes naturally form rectangular contours; this does not prove tampering.

### F. Fire Safety NOC & Faculty Cadre Compliance
- **Fire Safety NOC:** Extracted expiry date `31-03-2024` vs. Academic Year 2024-25 requirement (valid through June 2025) -> `Mismatch Detected` under APH Annexure 2.
- **Faculty Cadre:** 480 approved intake, SFR 1:20 (24 faculty). Expected cadre 1:2:6 (3 Prof, 5 Assoc, 16 Asst) vs Actual (3 Prof, 4 Assoc, 17 Asst). SFR is `Verified`; Cadre distribution has a 1 Assoc Prof deficit -> `Manual Review Needed`.

### G. Overall Validation Score Card
- Composite Score: `round([(Verified * 1.0 + Manual Review * 0.5) / Total Checks] * 100)`.
- Prominently displays score, rating, formula, and complete breakdown of Verified, Mismatch, Manual Review, Unavailable, and Tampered counts.
- Footnote reinforces that AI outputs are advisory only and cannot independently reject applications or declare fraud.

### H. Officer Findings & Deficiencies Integration
- All finding cards provide a one-click **"+ Add to Deficiencies"** action button, linking automated findings directly to the Officer Findings panel with exact field references and descriptions.
- Document inspection viewer DSC badge updated to reflect that scanned uploads require independent e-Sign certificate validation.

### I. Profile Menu & Session Logout (Scrutiny Dashboard)
- Scrutiny Dashboard header features an officer profile/avatar icon in the top-right corner displaying officer initials ("RS"), name ("Dr. Rajesh Sharma"), and role subtitle.
- Interactive dropdown displays:
  - Authenticated Session indicator
  - Officer Full Name (`Dr. Rajesh Sharma`)
  - Role Badge (`Role 2: Scrutiny / Re-scrutiny Officer`)
  - Assigned AICTE ID (`AICTE-SCR-0001`)
  - Official Email (`scrutiny.sharma@aicte.gov.in`)
  - Functional **Logout** button with clear session removal.
- **Route Guard Protection:** Scrutiny routes (`/aicte/dashboard/scrutiny` and `/aicte/scrutiny/review/:appId`) automatically verify `samiksha_auth_token` and `samiksha_user_role`. Unauthenticated access redirects immediately to `/aicte/login`.
- **Data Integrity:** Logging out clears session credentials (`samiksha_auth_token`, `samiksha_user_role`, `samiksha_aicte_user_id`) without clearing application records, findings, or database state.

---

> **MANDATORY FOR ALL AGENTS:** Update this `context.md` file after every feature, bugfix, or schema update to ensure that any developer or agent who receives this repository can immediately continue without losing context.
