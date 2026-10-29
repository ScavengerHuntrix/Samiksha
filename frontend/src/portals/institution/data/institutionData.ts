/**
 * SAMIKSHA Institution Applicant Data & Validation Engine
 * Grounded in AICTE Approval Process Handbook (APH) 2024-25 to 2026-27
 */

export interface InstitutionProfile {
  id: string;
  name: string;
  aictePid: string; // Permanent Institute ID
  trustName: string;
  establishedYear: number;
  institutionType: string;
  affiliatingUniversity: string;
  state: string;
  district: string;
  address: string;
  pinCode: string;
  currentApprovalStatus: string;
  accreditationSummary: string;
  headOfInstitution: string;
  contactEmail: string;
  contactPhone: string;
}

export type ApplicationTypeCode =
  | 'EOA'
  | 'COLLABORATION'
  | 'UNIVERSITY'
  | 'ODL_ONLINE'
  | 'OTHER_CATEGORIES';

export interface DocumentItem {
  id: string;
  code: string;
  title: string;
  description: string;
  isRequired: boolean;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  isDigitallySigned?: boolean;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'DEFICIENT';
}

export interface ValidationIssue {
  id: string;
  severity: 'WARNING' | 'DEFICIENCY' | 'INFO';
  category: string;
  ruleCode: string;
  message: string;
  aphReference: string;
  fieldReference?: string;
  suggestedAction: string;
  evidence?: string;
}

export interface CriteriaBreakdownItem {
  key: string;
  name: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface CrossDocumentFinding {
  id: string;
  checkName: string;
  applicationField: string;
  documentSource: string;
  applicationValue: string;
  documentValue: string;
  status: 'CONSISTENT' | 'DISCREPANCY' | 'PENDING_UPLOAD';
  observation: string;
  aphClause: string;
}

export interface AnomalyFlag {
  id: string;
  checkType: 'DIGITAL_SIGNATURE' | 'DATE_CONSISTENCY' | 'METADATA_INTEGRITY' | 'OCR_ALIGNMENT';
  documentName: string;
  severity: 'ADVISORY_NOTICE' | 'ATTENTION_NEEDED';
  description: string;
  scrutinyAction: string;
}

export interface ConfiguredRuleResult {
  code: string;
  name: string;
  category: string;
  fieldPath: string;
  status: 'PASSED' | 'DEFICIENT' | 'WARNING';
  aphClause: string;
  evidence: string;
}

export interface StatutoryStage {
  stageNumber: number;
  code: string;
  name: string;
  authority: string;
  description: string;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface ValidationResult {
  score: number; // 0 to 100
  status: 'READY' | 'NEEDS_CORRECTION' | 'INCOMPLETE';
  passedCount: number;
  totalChecks: number;
  issues: ValidationIssue[];
  criteriaBreakdown?: CriteriaBreakdownItem[];
  crossDocumentFindings?: CrossDocumentFinding[];
  anomalyFlags?: AnomalyFlag[];
  ruleResults?: ConfiguredRuleResult[];
  validatedAt: string;
  ruleVersion: string;
}

export interface ApplicationRecord {
  id: string;
  referenceNo: string;
  type: ApplicationTypeCode;
  title: string;
  aphChapter: string;
  academicYear: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_SCRUTINY' | 'RE_SCRUTINY' | 'DEFICIENT' | 'APPROVED';
  currentStage: string;
  lastUpdated: string;
  submittedAt?: string;
  formData: Record<string, any>;
  documents: DocumentItem[];
  validationResult?: ValidationResult;
  deficiencyNotes?: string;
  deficiencyResponse?: string;
  deficiencyRespondedAt?: string;
}

// Default Demo Institution Profile
export const DEFAULT_INSTITUTION_PROFILE: InstitutionProfile = {
  id: 'inst-001',
  name: 'Vivekananda Institute of Technology & Management',
  aictePid: '1-10972345671',
  trustName: 'Vivekananda Educational Trust',
  establishedYear: 2014,
  institutionType: 'Private / Self-Financing Technical Institution',
  affiliatingUniversity: 'Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere',
  state: 'Maharashtra',
  district: 'Pune',
  address: 'Survey No. 42/1, Katraj-Kondhwa Bypass Road, Pune',
  pinCode: '411048',
  currentApprovalStatus: 'Approved for AY 2023-24 (Regular EoA)',
  accreditationSummary: 'NAAC Grade A (Score: 3.18) | 2 UG Programs NBA Accredited',
  headOfInstitution: 'Dr. S. K. Kulkarni (Principal / Director)',
  contactEmail: 'applicant@demo.samiksha',
  contactPhone: '+91 98112 23344',
};

// Approval Category Catalog Metadata (Strictly matching APH 2024-27)
export const APPROVAL_CATEGORY_CARDS = [
  {
    type: 'EOA' as ApplicationTypeCode,
    code: 'APH-CH2-EOA',
    title: 'Extension of Approval (EoA)',
    aphChapter: 'Chapter II — Clauses 2.1 to 2.5',
    tagline: 'Annual Regulatory Extension for Existing Approved Technical Institutions',
    description:
      'For existing approved technical institutions seeking continuation of approval for ongoing Diploma, Under Graduate, and Post Graduate programmes based on statutory self-disclosure or multi-year extended EoA.',
    eligibilitySummary:
      'Existing AICTE approved institution with valid PID. Institutions figuring in NIRF Top 200, QS World Rankings, NAAC >= 3.01, or 30% NBA accredited courses are eligible for 3-Year Extended EoA.',
    route: '/institution/applications/eoa',
    iconName: 'Building',
    color: 'emerald',
  },
  {
    type: 'COLLABORATION' as ApplicationTypeCode,
    code: 'APH-CH3-COL',
    title: 'Collaboration & Twinning Programmes',
    aphChapter: 'Chapter III — Clauses 3.1 to 3.6',
    tagline: 'Academic Collaboration with Foreign Universities (QS Top 1000) or Reputed Indian HEIs',
    description:
      'Approval for Twinning Programmes, Joint Degree Programmes, Dual Degree Programmes, or Student Exchange arrangements with accredited foreign or national institutions of repute.',
    eligibilitySummary:
      'Existing institution with Nil Deficiency. Partner foreign university must be in QS/THE World Ranking Top 1000, or Indian partner with NAAC >= 3.01, NBA >= 650 points, or NIRF Top 200. Max 40% credits abroad; max 1 division (60 seats).',
    route: '/institution/applications/collaboration',
    iconName: 'Globe',
    color: 'blue',
  },
  {
    type: 'UNIVERSITY' as ApplicationTypeCode,
    code: 'APH-CH4-UNIV',
    title: 'University Technical Approval',
    aphChapter: 'Chapter IV — Clauses 4.1 to 4.5',
    tagline: 'Approval for Technical Departments, Constituent Colleges & Off-Campuses of Universities',
    description:
      'Applicable for Central Universities, State Public Universities, State Private Universities, and Institutions Deemed to be Universities offering or expanding technical programmes under AICTE norms.',
    eligibilitySummary:
      'Recognized under UGC Act 1956 (Section 2f and 12B) or established by Act of Parliament/State Legislature. Must fulfill AICTE physical infrastructure, instructional area, and statutory faculty cadre norms.',
    route: '/institution/applications/university',
    iconName: 'GraduationCap',
    color: 'purple',
  },
  {
    type: 'ODL_ONLINE' as ApplicationTypeCode,
    code: 'APH-CH5-ODL',
    title: 'Open & Distance Learning (ODL) / Online Programmes',
    aphChapter: 'Chapter V — Clauses 5.1 to 5.3',
    tagline: 'Approval for Approved Programmes in ODL and 100% Online Learning Mode',
    description:
      'Applicable for Standalone Institutions and Universities seeking approval for PGDM, MCA, MBA, Artificial Intelligence, Data Science, and allied domains in Open & Distance Learning or Online mode.',
    eligibilitySummary:
      'Valid NAAC score >= 3.01 or NBA accreditation. Mandatory designated CDOE with Professor Head. Note: AICTE strictly prohibits ODL/OL in Engineering & Technology, Architecture, and Hotel Management.',
    route: '/institution/applications/odl-online',
    iconName: 'Laptop',
    color: 'indigo',
  },
  {
    type: 'OTHER_CATEGORIES' as ApplicationTypeCode,
    code: 'APH-CH2-OTH',
    title: 'Other Applicable Approval Categories',
    aphChapter: 'Chapter II — Clauses 2.6, 2.7, 2.9, 2.15',
    tagline: 'Increase in Intake, Working Professionals, New Level & Supernumerary Quotas',
    description:
      'Expansion options for existing institutions: Increase in Intake (no upper limit in APH 2024-27 subject to EVC readiness), Programmes for Working Professionals in flexible timings, Supernumerary NRI/FN seats, or Level Conversion.',
    eligibilitySummary:
      'Existing approved institution with proportionate instructional land, laboratories, and faculty cadre. Working Professionals mode requires employer MoUs and flexible class schedules.',
    route: '/institution/applications/other-categories',
    iconName: 'Layers',
    color: 'amber',
  },
];

// Initial Seed Applications to demonstrate full lifecycle
const INITIAL_DEMO_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-eoa-001',
    referenceNo: 'SAMIKSHA-EOA-2024-0091',
    type: 'EOA',
    title: 'Extension of Approval (EoA) — AY 2024-25',
    aphChapter: 'Chapter II (Clause 2.1)',
    academicYear: '2024-25',
    status: 'DRAFT',
    currentStage: 'Application Preparation (Draft In Progress)',
    lastUpdated: '2026-10-28T09:30:00Z',
    formData: {
      appliedTrack: '3_YEAR_EXTENDED',
      naacScore: '3.18',
      nbaAccreditedPercentage: '35%',
      isAutonomous: true,
      totalApprovedIntake: 480,
      proposedIntake: 480,
      totalFaculty: 28,
      professors: 3,
      assocProfessors: 6,
      asstProfessors: 19,
      totalBuiltUpArea: 8450,
      classroomsAvailable: 16,
      classroomsRequired: 14,
      fireSafetyExpiry: '2025-08-30',
      landLiveLeaseYears: 32,
      barrierFreePwBD: true,
      antiRaggingFormed: true,
    },
    documents: [
      {
        id: 'doc-eoa-1',
        code: 'ANNEX-2-COMPLIANCE',
        title: 'Annual Compliance Self-Disclosure Statement',
        description: 'Digitally signed declaration of infrastructure and faculty availability',
        isRequired: true,
        fileName: 'Annual_Compliance_2024_Signed.pdf',
        fileSize: '1.8 MB',
        uploadedAt: '2026-10-27T14:20:00Z',
        isDigitallySigned: true,
        status: 'UPLOADED',
      },
      {
        id: 'doc-eoa-2',
        code: 'ANNEX-2-FACULTY',
        title: 'Faculty Cadre & Salary Payment Ledger',
        description: 'Bank payment vouchers and EPF return statement for previous 12 months',
        isRequired: true,
        fileName: 'Faculty_Cadre_EPF_Statement.pdf',
        fileSize: '3.4 MB',
        uploadedAt: '2026-10-27T14:25:00Z',
        isDigitallySigned: true,
        status: 'UPLOADED',
      },
      {
        id: 'doc-eoa-3',
        code: 'ANNEX-2-FIRE',
        title: 'Valid Fire Safety Certificate',
        description: 'Issued by State/Municipal Fire Services Authority',
        isRequired: true,
        fileName: 'Fire_Safety_NOC_2024_2025.pdf',
        fileSize: '950 KB',
        uploadedAt: '2026-10-27T14:30:00Z',
        isDigitallySigned: false,
        status: 'UPLOADED',
      },
      {
        id: 'doc-eoa-4',
        code: 'ANNEX-2-AUDIT',
        title: 'Audited Financial Statements & Balance Sheet',
        description: 'Certified by Chartered Accountant for preceding financial year',
        isRequired: true,
        status: 'PENDING',
      },
      {
        id: 'doc-eoa-5',
        code: 'ANNEX-2-LAND',
        title: 'Registered Land Deed / Lease Deed (>30 Years)',
        description: 'Registered Sale Deed or Govt Lease Deed for technical campus',
        isRequired: true,
        fileName: 'Registered_Lease_Deed_32Yrs.pdf',
        fileSize: '5.2 MB',
        uploadedAt: '2026-10-27T14:35:00Z',
        isDigitallySigned: true,
        status: 'UPLOADED',
      },
    ],
    validationResult: {
      score: 88,
      status: 'READY',
      passedCount: 8,
      totalChecks: 10,
      issues: [
        {
          id: 'v-eoa-1',
          severity: 'WARNING',
          category: 'Document Completeness',
          ruleCode: 'APH-DOC-AUDIT-01',
          message: 'Audited Financial Statements & Balance Sheet for the preceding year is not yet uploaded.',
          aphReference: 'Chapter II, Clause 2.3.4 (Annexure-2)',
          suggestedAction: 'Upload the CA-certified audited balance sheet before final submission.',
        },
        {
          id: 'v-eoa-2',
          severity: 'INFO',
          category: 'Safety & Digital Signature',
          ruleCode: 'APH-DOC-FIRE-DSC',
          message: 'Fire Safety Certificate is uploaded without a detected Digital Signature (DSC).',
          aphReference: 'Chapter II, Clause 2.3.4.a',
          suggestedAction: 'Ensure official municipal seal is clearly legible or re-upload with DSC.',
        },
      ],
      validatedAt: '2026-10-28T09:30:00Z',
      ruleVersion: 'APH-2024-27-v1.0',
    },
  },
  {
    id: 'app-col-002',
    referenceNo: 'SAMIKSHA-COL-2024-0018',
    type: 'COLLABORATION',
    title: 'Twinning Programme with University of Melbourne',
    aphChapter: 'Chapter III (Clauses 3.1 to 3.6)',
    academicYear: '2024-25',
    status: 'UNDER_SCRUTINY',
    currentStage: 'Regulatory Scrutiny by Scrutiny Committee',
    lastUpdated: '2026-10-25T11:45:00Z',
    submittedAt: '2026-10-24T16:00:00Z',
    formData: {
      collaborationType: 'Twinning Programme',
      partnerInstitution: 'University of Melbourne',
      partnerCountry: 'Australia',
      partnerRankingRank: '33',
      partnerRankingSource: 'QS World University Rankings 2024',
      proposedCourse: 'B.Tech in Computer Science & Engineering (Twinning Mode)',
      level: 'Under Graduate Degree',
      intakeSought: 60,
      creditsAbroadPercent: 37.5,
      semestersInIndia: 5,
      semestersAbroad: 3,
      affiliatingNocRef: 'DBATU/AFF/NOC/2024/771',
    },
    documents: [
      {
        id: 'doc-col-1',
        code: 'APH-CH3-MOU',
        title: 'Bipartite Agreement / Signed MoU',
        description: 'Formal agreement executed between Indian and Foreign Institution',
        isRequired: true,
        fileName: 'Bipartite_MoU_Melbourne_Signed.pdf',
        fileSize: '4.1 MB',
        uploadedAt: '2026-10-24T14:00:00Z',
        isDigitallySigned: true,
        status: 'VERIFIED',
      },
      {
        id: 'doc-col-2',
        code: 'APH-CH3-QS-PROOF',
        title: 'Proof of Global Ranking (QS Top 1000)',
        description: 'Official QS / THE World Ranking certificate',
        isRequired: true,
        fileName: 'QS_Ranking_Proof_Melbourne_Top100.pdf',
        fileSize: '1.2 MB',
        uploadedAt: '2026-10-24T14:10:00Z',
        isDigitallySigned: true,
        status: 'VERIFIED',
      },
      {
        id: 'doc-col-3',
        code: 'APH-CH3-CREDIT-MATRIX',
        title: 'Curriculum & Credit Transfer Mapping Matrix',
        description: 'Demonstrating foreign credit transfer <= 40% as per Clause 3.2.k',
        isRequired: true,
        fileName: 'Credit_Transfer_Mapping_37_5_Percent.pdf',
        fileSize: '2.5 MB',
        uploadedAt: '2026-10-24T14:15:00Z',
        isDigitallySigned: true,
        status: 'VERIFIED',
      },
      {
        id: 'doc-col-4',
        code: 'APH-CH3-NOC',
        title: 'Affiliating University NOC',
        description: 'No Objection Certificate from DBATU Lonere',
        isRequired: true,
        fileName: 'DBATU_Twinning_NOC.pdf',
        fileSize: '890 KB',
        uploadedAt: '2026-10-24T14:20:00Z',
        isDigitallySigned: true,
        status: 'VERIFIED',
      },
    ],
    validationResult: {
      score: 96,
      status: 'READY',
      passedCount: 9,
      totalChecks: 9,
      issues: [],
      validatedAt: '2026-10-24T15:30:00Z',
      ruleVersion: 'APH-2024-27-v1.0',
    },
  },
  {
    id: 'app-oth-003',
    referenceNo: 'SAMIKSHA-OTH-2024-0044',
    type: 'OTHER_CATEGORIES',
    title: 'Additional Course & Intake in Artificial Intelligence & Data Science',
    aphChapter: 'Chapter II (Clause 2.6 & 2.7)',
    academicYear: '2024-25',
    status: 'DEFICIENT',
    currentStage: 'Action Required: Deficiency Response Pending',
    lastUpdated: '2026-10-26T16:15:00Z',
    submittedAt: '2026-10-20T11:00:00Z',
    deficiencyNotes:
      'Scrutiny Committee Observation: 1. Faculty roster indicates a shortage in Associate Professor cadre (1 required for proposed AI & DS division, 0 present). 2. Fire Safety Certificate expiration date is within 30 days of academic session start.',
    formData: {
      subCategory: 'INCREASE_INTAKE_NEW_COURSE',
      targetDepartment: 'Artificial Intelligence and Data Science',
      currentApprovedIntake: 60,
      additionalIntakeRequested: 60,
      totalProposedIntake: 120,
      additionalInstructionalArea: 480,
      dedicatedLaboratoriesAdded: 2,
      workingProfessionalsMode: false,
    },
    documents: [
      {
        id: 'doc-oth-1',
        code: 'ANNEX-2-DPR',
        title: 'Detailed Project Report (DPR) on Infrastructure Scaling',
        description: 'Laboratory and classroom augmentation plan',
        isRequired: true,
        fileName: 'DPR_AI_Data_Science_Expansion.pdf',
        fileSize: '3.1 MB',
        uploadedAt: '2026-10-20T10:00:00Z',
        isDigitallySigned: true,
        status: 'UPLOADED',
      },
      {
        id: 'doc-oth-2',
        code: 'ANNEX-2-ARCH-PLAN',
        title: 'Chartered Architect Carpet Area Certificate',
        description: 'Verifying additional instructional area >= 400 sq.m',
        isRequired: true,
        fileName: 'Architect_Certificate_AI_Labs.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2026-10-20T10:15:00Z',
        isDigitallySigned: true,
        status: 'UPLOADED',
      },
      {
        id: 'doc-oth-3',
        code: 'ANNEX-2-AFF-NOC',
        title: 'Affiliating University NOC for Additional Intake',
        description: 'DBATU syllabus alignment and examination capacity NOC',
        isRequired: true,
        fileName: 'DBATU_NOC_Additional_Intake.pdf',
        fileSize: '1.4 MB',
        uploadedAt: '2026-10-20T10:30:00Z',
        isDigitallySigned: true,
        status: 'UPLOADED',
      },
    ],
    validationResult: {
      score: 72,
      status: 'NEEDS_CORRECTION',
      passedCount: 6,
      totalChecks: 9,
      issues: [
        {
          id: 'v-oth-1',
          severity: 'DEFICIENCY',
          category: 'Faculty Cadre Adequacy',
          ruleCode: 'APH-RULE-FAC-CADRE-02',
          message: 'Cadre ratio deficit: Proposed +60 division in AI & DS requires at least 1 Associate Professor.',
          aphReference: 'Chapter II, Clause 2.6.a & Chapter VI Table 6.1',
          suggestedAction: 'Submit appointment letter or joining report for designated Associate Professor.',
        },
        {
          id: 'v-oth-2',
          severity: 'WARNING',
          category: 'Statutory Safety',
          ruleCode: 'APH-RULE-FIRE-VALIDITY',
          message: 'Fire Safety Certificate renewal is due within 30 days.',
          aphReference: 'Chapter II, Clause 2.3.4 (Annexure-2)',
          suggestedAction: 'Upload the renewed fire safety NOC from municipal authorities.',
        },
      ],
      validatedAt: '2026-10-26T16:00:00Z',
      ruleVersion: 'APH-2024-27-v1.0',
    },
  },
  {
    id: 'app-eoa-hist',
    referenceNo: 'SAMIKSHA-EOA-2023-0182',
    type: 'EOA',
    title: 'Extension of Approval (EoA) — AY 2023-24',
    aphChapter: 'Chapter II',
    academicYear: '2023-24',
    status: 'APPROVED',
    currentStage: 'Extension of Approval Granted (Completed)',
    lastUpdated: '2023-06-15T12:00:00Z',
    submittedAt: '2023-04-10T10:30:00Z',
    formData: {
      totalApprovedIntake: 480,
      status: 'EOA_ISSUED',
      letterNumber: 'F.No. Western/1-10972345671/2023/EOA',
    },
    documents: [],
    validationResult: {
      score: 98,
      status: 'READY',
      passedCount: 10,
      totalChecks: 10,
      issues: [],
      validatedAt: '2023-04-10T10:30:00Z',
      ruleVersion: 'APH-2023-24-v1.0',
    },
  },
];

const STORAGE_KEY_APPLICATIONS = 'samiksha_institution_applications_v1';
const STORAGE_KEY_PROFILE = 'samiksha_institution_profile_v1';

export const InstitutionDataService = {
  getProfile(): InstitutionProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading institution profile from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(DEFAULT_INSTITUTION_PROFILE));
    return DEFAULT_INSTITUTION_PROFILE;
  },

  getAllApplications(): ApplicationRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading applications from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(INITIAL_DEMO_APPLICATIONS));
    return INITIAL_DEMO_APPLICATIONS;
  },

  getApplicationById(id: string): ApplicationRecord | undefined {
    const list = this.getAllApplications();
    return list.find((a) => a.id === id);
  },

  getApplicationByType(type: ApplicationTypeCode): ApplicationRecord | undefined {
    const list = this.getAllApplications();
    // Return draft first if exists, else most recent of that type
    const draft = list.find((a) => a.type === type && a.status === 'DRAFT');
    if (draft) return draft;
    return list.find((a) => a.type === type);
  },

  saveApplicationDraft(
    type: ApplicationTypeCode,
    title: string,
    aphChapter: string,
    formData: Record<string, any>,
    documents: DocumentItem[],
    validationResult?: ValidationResult
  ): ApplicationRecord {
    const list = this.getAllApplications();
    const existingIndex = list.findIndex((a) => a.type === type && a.status === 'DRAFT');

    const now = new Date().toISOString();
    let record: ApplicationRecord;

    if (existingIndex >= 0) {
      record = {
        ...list[existingIndex],
        title,
        aphChapter,
        formData,
        documents,
        validationResult,
        lastUpdated: now,
      };
      list[existingIndex] = record;
    } else {
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      record = {
        id: `app-${type.toLowerCase()}-${Date.now()}`,
        referenceNo: `SAMIKSHA-${type.substring(0, 3)}-2024-${randomSeq}`,
        type,
        title,
        aphChapter,
        academicYear: '2024-25',
        status: 'DRAFT',
        currentStage: 'Application Preparation (Draft Saved)',
        lastUpdated: now,
        formData,
        documents,
        validationResult,
      };
      list.unshift(record);
    }

    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(list));
    this.syncWithBackend(list);
    return record;
  },

  async syncWithBackend(applications?: ApplicationRecord[]) {
    try {
      const list = applications || this.getAllApplications();
      await fetch('http://localhost:8000/api/scrutiny/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applications: list }),
      });
    } catch (e) {
      console.warn('Backend sync deferred (running offline or API starting):', e);
    }
  },

  submitApplication(type: ApplicationTypeCode): ApplicationRecord {
    const list = this.getAllApplications();
    const existingIndex = list.findIndex((a) => a.type === type && (a.status === 'DRAFT' || a.status === 'DEFICIENT'));

    if (existingIndex < 0) {
      throw new Error(`No active draft or deficient application found for type ${type}`);
    }

    const now = new Date().toISOString();
    const updated = {
      ...list[existingIndex],
      status: 'SUBMITTED' as const,
      currentStage: 'Submitted — Queued for Scrutiny Committee Verification',
      lastUpdated: now,
      submittedAt: now,
    };

    list[existingIndex] = updated;
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(list));
    this.syncWithBackend(list);
    return updated;
  },

  submitDeficiencyResponse(appId: string, responseNotes: string, revisedDocuments?: DocumentItem[]): ApplicationRecord {
    const list = this.getAllApplications();
    const existingIndex = list.findIndex((a) => a.id === appId);
    if (existingIndex < 0) {
      throw new Error(`Application ${appId} not found`);
    }

    const now = new Date().toISOString();
    const current = list[existingIndex];
    const updated: ApplicationRecord = {
      ...current,
      status: 'UNDER_SCRUTINY',
      currentStage: 'Re-Scrutiny: Institutional Response Under Evaluation',
      lastUpdated: now,
      deficiencyResponse: responseNotes,
      deficiencyRespondedAt: now,
      documents: revisedDocuments || current.documents,
      validationResult: current.validationResult
        ? {
            ...current.validationResult,
            status: 'READY',
            score: Math.min(100, current.validationResult.score + 18),
            passedCount: Math.min(current.validationResult.totalChecks, current.validationResult.passedCount + 2),
            issues: current.validationResult.issues.filter((i) => i.severity !== 'DEFICIENCY'),
          }
        : undefined,
    };

    list[existingIndex] = updated;
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(list));
    this.syncWithBackend(list);
    return updated;
  },

  // =========================================================================
  // AUTOMATED VALIDATION CHECKS (Grounding in APH 2024-27 Norms)
  // =========================================================================

  validateEOA(formData: Record<string, any>, documents: DocumentItem[]): ValidationResult {
    const issues: ValidationIssue[] = [];
    let passed = 0;
    const totalChecks = 6;

    // Check 1: Teacher-to-Student Ratio
    const students = Number(formData.totalApprovedIntake) || 480;
    const faculty = Number(formData.totalFaculty) || 0;
    const ratio = faculty > 0 ? (students / faculty).toFixed(1) : 0;
    if (Number(ratio) <= 20.0 && faculty > 0) {
      passed++;
    } else {
      issues.push({
        id: 'iss-eoa-tsr',
        severity: 'DEFICIENCY',
        category: 'Faculty Adequacy',
        ruleCode: 'APH-RULE-FAC-TSR-01',
        message: `Student-to-Teacher Ratio is 1:${ratio} (Required norm for UG Engineering is at least 1:20 under APH Chapter VI).`,
        aphReference: 'Chapter VI, Table 6.1 (Norms for Teacher:Student Ratio)',
        suggestedAction: 'Increase full-time faculty roster to achieve a minimum 1:20 ratio.',
      });
    }

    // Check 2: Cadre Ratio (Prof : Assoc Prof : Asst Prof -> 1:2:6)
    const prof = Number(formData.professors) || 0;
    const assoc = Number(formData.assocProfessors) || 0;
    if (prof >= 1 && assoc >= 2) {
      passed++;
    } else {
      issues.push({
        id: 'iss-eoa-cadre',
        severity: 'WARNING',
        category: 'Cadre Balance',
        ruleCode: 'APH-RULE-FAC-CADRE-01',
        message: 'Faculty cadre distribution does not satisfy the 1:2:6 cadre proportion (Professors and Associate Professors underrepresented).',
        aphReference: 'Chapter VI, Clause 6.3 (Cadre Distribution Norms)',
        suggestedAction: 'Appoint senior faculty in Professor and Associate Professor cadres.',
      });
    }

    // Check 3: Built-up Area & Classrooms
    const availClassrooms = Number(formData.classroomsAvailable) || 0;
    const reqClassrooms = Number(formData.classroomsRequired) || 14;
    if (availClassrooms >= reqClassrooms) {
      passed++;
    } else {
      issues.push({
        id: 'iss-eoa-classrooms',
        severity: 'DEFICIENCY',
        category: 'Instructional Area',
        ruleCode: 'APH-RULE-INFRA-CLASSROOM-01',
        message: `Available classrooms (${availClassrooms}) is below the statutory requirement of ${reqClassrooms}.`,
        aphReference: 'Chapter VI, Table 6.2 (Instructional Area Requirements)',
        suggestedAction: 'Ensure all required lecture halls/classrooms are earmarked and furnished.',
      });
    }

    // Check 4: Land live lease period >= 30 years
    const leaseYears = Number(formData.landLiveLeaseYears) || 0;
    if (leaseYears >= 30) {
      passed++;
    } else {
      issues.push({
        id: 'iss-eoa-lease',
        severity: 'DEFICIENCY',
        category: 'Land & Title',
        ruleCode: 'APH-RULE-LAND-LEASE-30',
        message: `Remaining live lease period is ${leaseYears} years (AICTE APH Clause 2.1.e mandates a minimum 30-year live lease).`,
        aphReference: 'Chapter II, Clause 2.1.e & Chapter I Clause 1.4',
        suggestedAction: 'Execute a registered lease extension deed for not less than 30 years.',
      });
    }

    // Check 5: Mandatory Document Checklist
    const missingDocs = documents.filter((d) => d.isRequired && d.status !== 'UPLOADED' && d.status !== 'VERIFIED');
    if (missingDocs.length === 0) {
      passed++;
    } else {
      missingDocs.forEach((d) => {
        issues.push({
          id: `iss-doc-${d.code}`,
          severity: 'DEFICIENCY',
          category: 'Mandatory Document Missing',
          ruleCode: d.code,
          message: `Mandatory statutory document "${d.title}" is missing from upload.`,
          aphReference: 'Chapter II, Clause 2.3.4 (Annexure-2)',
          suggestedAction: `Upload a valid copy of ${d.title}.`,
        });
      });
    }

    // Check 6: Fire Safety Validity
    if (formData.fireSafetyExpiry && new Date(formData.fireSafetyExpiry) > new Date()) {
      passed++;
    } else {
      issues.push({
        id: 'iss-eoa-fire',
        severity: 'WARNING',
        category: 'Statutory Safety',
        ruleCode: 'APH-RULE-DOC-FIRE-01',
        message: 'Fire Safety Certificate expiration date is expired or expiring within current academic session.',
        aphReference: 'Chapter II, Annexure 2 & Safety Norms',
        suggestedAction: 'Submit municipal renewal application or renewed certificate.',
      });
    }

    const score = Math.round((passed / totalChecks) * 100);
    const hasDeficiency = issues.some((i) => i.severity === 'DEFICIENCY');

    return {
      score,
      status: hasDeficiency ? 'NEEDS_CORRECTION' : 'READY',
      passedCount: passed,
      totalChecks,
      issues,
      validatedAt: new Date().toISOString(),
      ruleVersion: 'APH-2024-27-v1.0',
    };
  },

  validateCollaboration(formData: Record<string, any>, documents: DocumentItem[]): ValidationResult {
    const issues: ValidationIssue[] = [];
    let passed = 0;
    const totalChecks = 5;

    // Check 1: QS / THE Ranking threshold
    const rank = Number(formData.partnerRankingRank) || 0;
    if (rank > 0 && rank <= 1000) {
      passed++;
    } else {
      issues.push({
        id: 'iss-col-rank',
        severity: 'DEFICIENCY',
        category: 'Partner University Eligibility',
        ruleCode: 'APH-CH3-RANK-1000',
        message: `Foreign partner ranking (#${rank || 'N/A'}) does not satisfy the top 1000 QS/THE World Ranking threshold.`,
        aphReference: 'Chapter III, Clause 3.2.b (Ranking of Foreign Partner)',
        suggestedAction: 'Partner must be accredited within the top 1000 in latest QS or THE world rankings.',
      });
    }

    // Check 2: Credit transfer ceiling (Max 40%)
    const creditPercent = Number(formData.creditsAbroadPercent) || 0;
    if (creditPercent > 0 && creditPercent <= 40.0) {
      passed++;
    } else {
      issues.push({
        id: 'iss-col-credit',
        severity: 'DEFICIENCY',
        category: 'Curriculum & Credit Transfer',
        ruleCode: 'APH-CH3-CREDIT-CAP-40',
        message: `Proposed credit transfer (${creditPercent}%) exceeds statutory ceiling of 40% under Clause 3.2.k.`,
        aphReference: 'Chapter III, Clause 3.2.k & UGC Regulation 2022',
        suggestedAction: 'Harmonize syllabus so foreign credits earned do not exceed 40% of total programme credits.',
      });
    }

    // Check 3: Max Intake (Strictly 1 division / 60 seats)
    const intake = Number(formData.intakeSought) || 0;
    if (intake > 0 && intake <= 60) {
      passed++;
    } else {
      issues.push({
        id: 'iss-col-intake',
        severity: 'DEFICIENCY',
        category: 'Intake Ceiling',
        ruleCode: 'APH-CH3-INTAKE-MAX-60',
        message: `Requested collaboration intake (${intake}) exceeds the ceiling of 1 division (max 60 seats).`,
        aphReference: 'Chapter III, Preamble & Clause 3.2',
        suggestedAction: 'Reduce intake request to a maximum of 60 seats.',
      });
    }

    // Check 4: Affiliating University NOC
    if (formData.affiliatingNocRef && String(formData.affiliatingNocRef).trim().length > 3) {
      passed++;
    } else {
      issues.push({
        id: 'iss-col-noc',
        severity: 'DEFICIENCY',
        category: 'Statutory NOC',
        ruleCode: 'APH-CH3-AFF-NOC',
        message: 'Affiliating University NOC reference number is missing.',
        aphReference: 'Chapter III, Clause 3.2.g',
        suggestedAction: 'Enter valid NOC dispatch number and upload copy from affiliating university.',
      });
    }

    // Check 5: Documents
    const missingDocs = documents.filter((d) => d.isRequired && d.status !== 'UPLOADED' && d.status !== 'VERIFIED');
    if (missingDocs.length === 0) {
      passed++;
    } else {
      missingDocs.forEach((d) => {
        issues.push({
          id: `iss-doc-${d.code}`,
          severity: 'DEFICIENCY',
          category: 'Document Missing',
          ruleCode: d.code,
          message: `Mandatory document "${d.title}" is missing.`,
          aphReference: 'Chapter III, Clause 3.4',
          suggestedAction: `Upload valid copy of ${d.title}.`,
        });
      });
    }

    const score = Math.round((passed / totalChecks) * 100);
    const hasDeficiency = issues.some((i) => i.severity === 'DEFICIENCY');

    return {
      score,
      status: hasDeficiency ? 'NEEDS_CORRECTION' : 'READY',
      passedCount: passed,
      totalChecks,
      issues,
      validatedAt: new Date().toISOString(),
      ruleVersion: 'APH-2024-27-v1.0',
    };
  },

  validateUniversity(formData: Record<string, any>, documents: DocumentItem[]): ValidationResult {
    const issues: ValidationIssue[] = [];
    let passed = 0;
    const totalChecks = 5;

    // Check 1: UGC Act Recognition
    if (formData.ugcRecognitionStatus && String(formData.ugcRecognitionStatus).includes('2(f)')) {
      passed++;
    } else {
      issues.push({
        id: 'iss-univ-ugc',
        severity: 'DEFICIENCY',
        category: 'Statutory Recognition',
        ruleCode: 'APH-CH4-UGC-RECOG',
        message: 'University must be recognized under Section 2(f) of the UGC Act 1956.',
        aphReference: 'Chapter IV, Clause 4.1.a & UGC Act',
        suggestedAction: 'Specify UGC 2(f) notification order number and date.',
      });
    }

    // Check 2: Legislative Act / Gazette
    if (formData.gazetteRef && String(formData.gazetteRef).trim().length > 3) {
      passed++;
    } else {
      issues.push({
        id: 'iss-univ-act',
        severity: 'DEFICIENCY',
        category: 'Statutory Establishment',
        ruleCode: 'APH-CH4-GAZETTE-ACT',
        message: 'State/Central Legislative Act or Gazette notification reference is required.',
        aphReference: 'Chapter IV, Clause 4.1.a',
        suggestedAction: 'Provide Act number and Gazette publication reference.',
      });
    }

    // Check 3: Campus Land Area
    const acres = Number(formData.campusAcres) || 0;
    if (acres >= 10.0) {
      passed++;
    } else {
      issues.push({
        id: 'iss-univ-land',
        severity: 'WARNING',
        category: 'Campus Area',
        ruleCode: 'APH-CH4-LAND-ACRES',
        message: `University campus land area (${acres} acres) is below recommended continuous acreage (10 acres).`,
        aphReference: 'Chapter IV, Clause 4.2 & Chapter VI',
        suggestedAction: 'Verify revenue ownership survey records for technical campus.',
      });
    }

    // Check 4: Academic Council Approval
    if (formData.academicCouncilResolution && String(formData.academicCouncilResolution).trim().length > 3) {
      passed++;
    } else {
      issues.push({
        id: 'iss-univ-council',
        severity: 'DEFICIENCY',
        category: 'Internal Governance',
        ruleCode: 'APH-CH4-ACADEMIC-COUNCIL',
        message: 'Academic Council resolution approving the technical programmes is required.',
        aphReference: 'Chapter IV, Clause 4.3',
        suggestedAction: 'Enter Academic Council meeting resolution number and date.',
      });
    }

    // Check 5: Documents
    const missingDocs = documents.filter((d) => d.isRequired && d.status !== 'UPLOADED' && d.status !== 'VERIFIED');
    if (missingDocs.length === 0) {
      passed++;
    } else {
      missingDocs.forEach((d) => {
        issues.push({
          id: `iss-doc-${d.code}`,
          severity: 'DEFICIENCY',
          category: 'Document Missing',
          ruleCode: d.code,
          message: `Mandatory document "${d.title}" is missing.`,
          aphReference: 'Chapter IV, Clause 4.4',
          suggestedAction: `Upload copy of ${d.title}.`,
        });
      });
    }

    const score = Math.round((passed / totalChecks) * 100);
    const hasDeficiency = issues.some((i) => i.severity === 'DEFICIENCY');

    return {
      score,
      status: hasDeficiency ? 'NEEDS_CORRECTION' : 'READY',
      passedCount: passed,
      totalChecks,
      issues,
      validatedAt: new Date().toISOString(),
      ruleVersion: 'APH-2024-27-v1.0',
    };
  },

  validateODLOnline(formData: Record<string, any>, documents: DocumentItem[]): ValidationResult {
    const issues: ValidationIssue[] = [];
    let passed = 0;
    const totalChecks = 5;

    // Check 1: Non-Offering of Banned Engineering in ODL
    const prog = String(formData.proposedProgram || '').toLowerCase();
    if (prog.includes('b.tech') || prog.includes('b.e.') || prog.includes('engineering') || prog.includes('architecture')) {
      issues.push({
        id: 'iss-odl-banned',
        severity: 'DEFICIENCY',
        category: 'Programme Eligibility',
        ruleCode: 'APH-CH5-BANNED-ENGG',
        message: 'CRITICAL APH VIOLATION: AICTE strictly prohibits ODL/Online mode for Diploma/Degree in Engineering & Technology, Architecture, and Hotel Management.',
        aphReference: 'Chapter V, Clause 5.1.b (Prohibited Programmes under ODL)',
        suggestedAction: 'Select only permitted disciplines: Management (MBA/PGDM), Computer Applications (MCA), AI, Data Science, or Logistics.',
      });
    } else {
      passed++;
    }

    // Check 2: NAAC / NBA Score threshold
    const naac = Number(formData.naacScore) || 0;
    if (naac >= 3.01 || formData.nbaScoreAvailable) {
      passed++;
    } else {
      issues.push({
        id: 'iss-odl-naac',
        severity: 'DEFICIENCY',
        category: 'Accreditation Threshold',
        ruleCode: 'APH-CH5-NAAC-301',
        message: `NAAC score (${naac || 'None'}) is below mandatory minimum of 3.01 on 4.0 scale for ODL/Online programmes.`,
        aphReference: 'Chapter V, Clause 5.1.d & UGC ODL Regulations 2020',
        suggestedAction: 'Institution must possess valid NAAC >= 3.01 or NBA accreditation for ODL eligibility.',
      });
    }

    // Check 3: Head of CDOE Rank (Must be Professor)
    const headRank = String(formData.headOfCdoeRank || '').toLowerCase();
    if (headRank.includes('professor') && !headRank.includes('assistant') && !headRank.includes('associate')) {
      passed++;
    } else {
      issues.push({
        id: 'iss-odl-head',
        severity: 'DEFICIENCY',
        category: 'Administrative Setup',
        ruleCode: 'APH-CH5-CDOE-HEAD',
        message: 'Head of Centre of Distance Education must be a regular functionary not below the rank of Full Professor.',
        aphReference: 'Chapter V, Clause 5.3.3 & Table 5.1',
        suggestedAction: 'Designate a Full Professor as Head of CDOE.',
      });
    }

    // Check 4: Enrolment Intake Cap at Headquarters
    const intake = Number(formData.proposedLearnerIntake) || 0;
    if (intake > 0 && intake <= 5000) {
      passed++;
    } else {
      issues.push({
        id: 'iss-odl-intake',
        severity: 'DEFICIENCY',
        category: 'Learner Enrolment Cap',
        ruleCode: 'APH-CH5-HQ-CAP-5000',
        message: `Proposed enrolment (${intake}) exceeds the ceiling of 5,000 learners at Headquarters without proportionate infrastructure expansion.`,
        aphReference: 'Chapter V, Clause 5.3.3',
        suggestedAction: 'Limit headquarters intake to 5,000 learners or demonstrate pro-rata staff scaling.',
      });
    }

    // Check 5: Documents
    const missingDocs = documents.filter((d) => d.isRequired && d.status !== 'UPLOADED' && d.status !== 'VERIFIED');
    if (missingDocs.length === 0) {
      passed++;
    } else {
      missingDocs.forEach((d) => {
        issues.push({
          id: `iss-doc-${d.code}`,
          severity: 'DEFICIENCY',
          category: 'Document Missing',
          ruleCode: d.code,
          message: `Mandatory document "${d.title}" is missing.`,
          aphReference: 'Chapter V, Clause 5.3',
          suggestedAction: `Upload copy of ${d.title}.`,
        });
      });
    }

    const score = Math.round((passed / totalChecks) * 100);
    const hasDeficiency = issues.some((i) => i.severity === 'DEFICIENCY');

    return {
      score,
      status: hasDeficiency ? 'NEEDS_CORRECTION' : 'READY',
      passedCount: passed,
      totalChecks,
      issues,
      validatedAt: new Date().toISOString(),
      ruleVersion: 'APH-2024-27-v1.0',
    };
  },

  validateOtherCategories(formData: Record<string, any>, documents: DocumentItem[]): ValidationResult {
    const issues: ValidationIssue[] = [];
    let passed = 0;
    const totalChecks = 5;

    // Check 1: Additional Carpet Area for added intake
    const addIntake = Number(formData.additionalIntakeRequested) || 0;
    const addArea = Number(formData.additionalInstructionalArea) || 0;
    const minRequiredArea = (addIntake / 60) * 132; // ~132 sq.m per 60 seats classroom + lab proportion
    if (addArea >= minRequiredArea && addArea > 0) {
      passed++;
    } else {
      issues.push({
        id: 'iss-oth-area',
        severity: 'DEFICIENCY',
        category: 'Infrastructure Readiness',
        ruleCode: 'APH-CH2-INFRA-SCALE',
        message: `Additional instructional area (${addArea} sq.m) is deficient for proposed +${addIntake} intake (minimum ${Math.round(minRequiredArea)} sq.m required).`,
        aphReference: 'Chapter II, Clause 2.6.a (Infrastructure availability for intake expansion)',
        suggestedAction: 'Earmark adequate instructional and laboratory floor space verified by Architect.',
      });
    }

    // Check 2: Working Professionals timetable & employer consent
    if (formData.subCategory === 'WORKING_PROFESSIONALS') {
      if (formData.workingProfSchedule && String(formData.workingProfSchedule).length > 5) {
        passed++;
      } else {
        issues.push({
          id: 'iss-oth-wp-sched',
          severity: 'DEFICIENCY',
          category: 'Flexible Mode Compliance',
          ruleCode: 'APH-CH2-WP-FLEXIBLE-MODE',
          message: 'Flexible mode class timetable (evening/weekend) must be provided for Working Professionals.',
          aphReference: 'Chapter II, Clause 2.7 & NEP 2020 Guidelines',
          suggestedAction: 'Specify timetable structure and industrial shift alignment.',
        });
      }
    } else {
      passed++;
    }

    // Check 3: Affiliating University NOC
    if (formData.affiliatingNocRef && String(formData.affiliatingNocRef).trim().length > 3) {
      passed++;
    } else {
      issues.push({
        id: 'iss-oth-noc',
        severity: 'DEFICIENCY',
        category: 'Affiliation Clearance',
        ruleCode: 'APH-CH2-AFF-NOC',
        message: 'Affiliating University NOC reference number is required for expansion / additional courses.',
        aphReference: 'Chapter II, Clause 2.6.b',
        suggestedAction: 'Enter dispatch reference of University NOC.',
      });
    }

    // Check 4: Supernumerary math check (if selected)
    if (formData.subCategory === 'SUPERNUMERARY_NRI_FN') {
      const quota = Number(formData.supernumeraryPercent) || 0;
      if (quota <= 15.0) {
        passed++;
      } else {
        issues.push({
          id: 'iss-oth-quota',
          severity: 'DEFICIENCY',
          category: 'Quota Limits',
          ruleCode: 'APH-CH2-SUPERNUMERARY-15',
          message: `Supernumerary quota (${quota}%) exceeds statutory limit of 15% under Clause 2.9.`,
          aphReference: 'Chapter II, Clause 2.9 (Supernumerary Seats for NRI/FN/Gulf)',
          suggestedAction: 'Cap supernumerary quota at 15% of approved intake.',
        });
      }
    } else {
      passed++;
    }

    // Check 5: Documents
    const missingDocs = documents.filter((d) => d.isRequired && d.status !== 'UPLOADED' && d.status !== 'VERIFIED');
    if (missingDocs.length === 0) {
      passed++;
    } else {
      missingDocs.forEach((d) => {
        issues.push({
          id: `iss-doc-${d.code}`,
          severity: 'DEFICIENCY',
          category: 'Document Missing',
          ruleCode: d.code,
          message: `Mandatory document "${d.title}" is missing.`,
          aphReference: 'Chapter II, Clause 2.6 (Annexure-2)',
          suggestedAction: `Upload copy of ${d.title}.`,
        });
      });
    }

    const score = Math.round((passed / totalChecks) * 100);
    const hasDeficiency = issues.some((i) => i.severity === 'DEFICIENCY');

    return {
      score,
      status: hasDeficiency ? 'NEEDS_CORRECTION' : 'READY',
      passedCount: passed,
      totalChecks,
      issues,
      validatedAt: new Date().toISOString(),
      ruleVersion: 'APH-2024-27-v1.0',
    };
  },
};
