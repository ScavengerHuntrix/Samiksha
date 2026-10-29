import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationWorkflowHeader } from './components/ApplicationWorkflowHeader';
import { DocumentChecklistSection } from './components/DocumentChecklistSection';
import { ValidationAdvisoryReport } from './components/ValidationAdvisoryReport';
import {
  InstitutionDataService,
  type DocumentItem,
  type ValidationResult,
  type ApplicationRecord,
} from './data/institutionData';
import {
  Building2,
  Users,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
} from 'lucide-react';

export const EOAApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ApplicationRecord | null>(null);

  // Form State grounded in APH Chapter II
  const [formData, setFormData] = useState({
    appliedTrack: '3_YEAR_EXTENDED',
    academicYear: '2024-25',
    naacScore: '3.18',
    nbaAccreditedPercentage: '35',
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
    grievanceCellFormed: true,
  });

  // Document Checklist grounded in APH Annexure-2
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-eoa-1',
      code: 'ANNEX-2-COMPLIANCE',
      title: 'Annual Compliance Self-Disclosure Statement',
      description: 'Digitally signed declaration of infrastructure and faculty availability (Clause 2.5)',
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
      title: 'Faculty Cadre & Salary Payment Register',
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
      description: 'Registered Sale Deed or Govt Lease Deed for technical campus (Clause 2.1.e)',
      isRequired: true,
      fileName: 'Registered_Lease_Deed_32Yrs.pdf',
      fileSize: '5.2 MB',
      uploadedAt: '2026-10-27T14:35:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
  ]);

  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
  const [referenceNo, setReferenceNo] = useState<string>('SAMIKSHA-EOA-2024-0091');

  // Load existing draft if present
  useEffect(() => {
    const existing = InstitutionDataService.getApplicationByType('EOA');
    if (existing) {
      setReferenceNo(existing.referenceNo);
      if (existing.formData) {
        setFormData((prev) => ({ ...prev, ...existing.formData }));
      }
      if (existing.documents && existing.documents.length > 0) {
        setDocuments(existing.documents);
      }
      if (existing.validationResult) {
        setValidationResult(existing.validationResult);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    try {
      const record = InstitutionDataService.saveApplicationDraft(
        'EOA',
        'Extension of Approval (EoA) — AY 2024-25',
        'Chapter II (Clauses 2.1 to 2.5)',
        formData,
        documents,
        validationResult
      );
      setReferenceNo(record.referenceNo);
      setSaveMessage('Draft Saved Successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadSimulate = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'UPLOADED',
            fileName: `${d.code}_Uploaded_Sample.pdf`,
            fileSize: '2.1 MB',
            uploadedAt: new Date().toISOString(),
            isDigitallySigned: true,
          };
        }
        return d;
      })
    );
  };

  const handleRemoveDoc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            status: 'PENDING',
            fileName: undefined,
            fileSize: undefined,
            uploadedAt: undefined,
            isDigitallySigned: false,
          };
        }
        return d;
      })
    );
  };

  const handleToggleDsc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            isDigitallySigned: !d.isDigitallySigned,
          };
        }
        return d;
      })
    );
  };

  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      const res = InstitutionDataService.validateEOA(formData, documents);
      setValidationResult(res);
      setIsValidating(false);
      // Auto-save draft with validation
      InstitutionDataService.saveApplicationDraft(
        'EOA',
        'Extension of Approval (EoA) — AY 2024-25',
        'Chapter II (Clauses 2.1 to 2.5)',
        formData,
        documents,
        res
      );
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Ensure draft is saved first
    InstitutionDataService.saveApplicationDraft(
      'EOA',
      'Extension of Approval (EoA) — AY 2024-25',
      'Chapter II (Clauses 2.1 to 2.5)',
      formData,
      documents,
      validationResult
    );

    setTimeout(() => {
      try {
        const submitted = InstitutionDataService.submitApplication('EOA');
        setSubmittedApp(submitted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <ApplicationWorkflowHeader
        title="Extension of Approval (EoA) Application"
        aphChapter="Chapter II — Clauses 2.1 to 2.5"
        referenceNo={referenceNo}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSaveDraft={handleSaveDraft}
        isSaving={isSaving}
        saveMessage={saveMessage}
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* STEP 1: APPLICATION DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#7b1113]" />
                  <span>1. Institutional Identity & Approval Track</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  AICTE APH 2024–27 provides for regular 1-year EoA or 3-year Extended EoA for outstanding accredited institutions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Permanent Institute ID (PID)</label>
                  <input
                    type="text"
                    disabled
                    value="1-10972345671"
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 font-mono text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Institution Name</label>
                  <input
                    type="text"
                    disabled
                    value="Vivekananda Institute of Technology & Management"
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Approval Track Option</label>
                  <select
                    name="appliedTrack"
                    value={formData.appliedTrack}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:outline-none focus:border-[#7b1113]"
                  >
                    <option value="3_YEAR_EXTENDED">3-Year Extended EoA (Clause 2.1.a — NIRF/QS/NAAC/NBA/Autonomy)</option>
                    <option value="1_YEAR_REGULAR">1-Year Regular EoA (Clause 2.5 — Self-Disclosure)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">NAAC Accreditation Score (on 4.0 scale)</label>
                  <input
                    type="text"
                    name="naacScore"
                    value={formData.naacScore}
                    onChange={handleInputChange}
                    placeholder="e.g. 3.18"
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 focus:outline-none focus:border-[#7b1113]"
                  />
                  <span className="text-[11px] text-slate-500">APH requirement: Score &ge; 3.01 for 3-Year Extended EoA</span>
                </div>
              </div>

              {/* Section 2: Student Intake & Faculty Adequacy */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#7b1113]" />
                  <span>2. Student Intake & Faculty Cadre Distribution</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Enforces statutory Teacher-to-Student Ratio (1:20) and Cadre distribution (1 Professor : 2 Associate Professors : 6 Assistant Professors).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Approved Student Intake</label>
                  <input
                    type="number"
                    name="totalApprovedIntake"
                    value={formData.totalApprovedIntake}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Proposed Continuation Intake</label>
                  <input
                    type="number"
                    name="proposedIntake"
                    value={formData.proposedIntake}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Total Full-Time Faculty</label>
                  <input
                    type="number"
                    name="totalFaculty"
                    value={formData.totalFaculty}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Full Professors (Cadre)</label>
                  <input
                    type="number"
                    name="professors"
                    value={formData.professors}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Associate Professors (Cadre)</label>
                  <input
                    type="number"
                    name="assocProfessors"
                    value={formData.assocProfessors}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Assistant Professors (Cadre)</label>
                  <input
                    type="number"
                    name="asstProfessors"
                    value={formData.asstProfessors}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Section 3: Infrastructure & Safety */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#7b1113]" />
                  <span>3. Built-up Area, Land Lease & Safety Compliance</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Mandatory statutory checks under APH Chapter VI for land lease validity, barrier-free access, and fire clearance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Total Built-up Area (sq.m)</label>
                  <input
                    type="number"
                    name="totalBuiltUpArea"
                    value={formData.totalBuiltUpArea}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Available Classrooms</label>
                  <input
                    type="number"
                    name="classroomsAvailable"
                    value={formData.classroomsAvailable}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Land Live Lease (Remaining Years)</label>
                  <input
                    type="number"
                    name="landLiveLeaseYears"
                    value={formData.landLiveLeaseYears}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Must be at least 30 years under Clause 2.1.e</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Fire Safety Certificate Expiry Date</label>
                  <input
                    type="date"
                    name="fireSafetyExpiry"
                    value={formData.fireSafetyExpiry}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="barrierFreePwBD"
                      checked={formData.barrierFreePwBD}
                      onChange={handleInputChange}
                      className="rounded text-[#7b1113] focus:ring-[#7b1113]"
                    />
                    <span className="font-bold text-slate-800">Barrier-free PwBD Ramps & Lifts Built</span>
                  </label>
                </div>

                <div className="space-y-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="antiRaggingFormed"
                      checked={formData.antiRaggingFormed}
                      onChange={handleInputChange}
                      className="rounded text-[#7b1113] focus:ring-[#7b1113]"
                    />
                    <span className="font-bold text-slate-800">Anti-Ragging Committee Constituted</span>
                  </label>
                </div>
              </div>

              {/* Navigation button */}
              <div className="pt-6 flex justify-end border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    handleSaveDraft();
                    setCurrentStep(2);
                  }}
                  className="bg-[#7b1113] hover:bg-[#600e10] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
                >
                  <span>Continue to Supporting Documents</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SUPPORTING DOCUMENTS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <DocumentChecklistSection
              documents={documents}
              onUploadSimulate={handleUploadSimulate}
              onRemoveDoc={handleRemoveDoc}
              onToggleDsc={handleToggleDsc}
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                ← Back to Application Details
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft();
                  handleRunValidation();
                  setCurrentStep(3);
                }}
                className="bg-[#7b1113] hover:bg-[#600e10] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
              >
                <span>Save & Run Automated Scrutiny</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VALIDATION ENGINE REPORT */}
        {currentStep === 3 && (
          <ValidationAdvisoryReport
            validationResult={validationResult}
            onRerunValidation={handleRunValidation}
            isValidating={isValidating}
            onProceedToSubmit={() => setCurrentStep(4)}
            onBackToEdit={() => setCurrentStep(1)}
          />
        )}

        {/* STEP 4: REVIEW & FINAL SUBMISSION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                  Application Summary & Pre-Submission Review
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Please review your Extension of Approval declaration before generating the final digital submission packet.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Institution & Approval Track
                  </h3>
                  <div><strong>PID:</strong> 1-10972345671</div>
                  <div><strong>Track:</strong> {formData.appliedTrack === '3_YEAR_EXTENDED' ? '3-Year Extended EoA' : '1-Year Regular EoA'}</div>
                  <div><strong>NAAC Score:</strong> {formData.naacScore} / 4.0</div>
                  <div><strong>Affiliating Body:</strong> DBATU Lonere</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Intake & Faculty Metrics
                  </h3>
                  <div><strong>Approved Intake:</strong> {formData.totalApprovedIntake} Seats</div>
                  <div><strong>Full-Time Faculty:</strong> {formData.totalFaculty} Members (TSR: 1:{(formData.totalApprovedIntake / formData.totalFaculty).toFixed(1)})</div>
                  <div><strong>Cadre Ratio:</strong> {formData.professors} Prof : {formData.assocProfessors} Assoc : {formData.asstProfessors} Asst</div>
                  <div><strong>Classrooms:</strong> {formData.classroomsAvailable} Available (Req: {formData.classroomsRequired})</div>
                </div>
              </div>

              {/* Scrutiny Status Summary */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-emerald-950 text-sm">
                    Pre-Submission Validation Score: {validationResult?.score || 88}/100
                  </div>
                  <div className="text-emerald-800">
                    {validationResult?.issues.length === 0
                      ? 'Nil Deficiencies noted. Ready for submission.'
                      : `${validationResult?.issues.length} advisory observation(s) noted.`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-emerald-900 underline"
                >
                  View Scrutiny Report
                </button>
              </div>

              {/* Submission Agreement */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 rounded text-[#7b1113] focus:ring-[#7b1113]"
                  />
                  <span>
                    I solemnly declare that all data entered, faculty rosters, built-up area schedules, and supporting documents uploaded are true to the best of my knowledge and comply with AICTE Approval Process Handbook (APH 2024–27). I understand that false disclosures invite penal action under Chapter VII.
                  </span>
                </label>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Scrutiny Observations
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#7b1113] hover:bg-[#600e10] text-white text-xs sm:text-sm font-bold px-8 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>{isSubmitting ? 'Submitting to AICTE Regulation Bureau...' : 'Confirm & Submit Application'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Submission Success Modal */}
      {submittedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Application Submitted!
              </h3>
              <p className="text-xs text-slate-600">
                Your Extension of Approval application has been successfully submitted to the prototype's regulatory queue.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-1 text-left">
              <div><strong>Reference No:</strong> <span className="text-[#7b1113] font-bold">{submittedApp.referenceNo}</span></div>
              <div><strong>Status:</strong> {submittedApp.status}</div>
              <div><strong>Current Stage:</strong> {submittedApp.currentStage}</div>
              <div><strong>Submitted At:</strong> {new Date().toLocaleTimeString()}</div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/institution/dashboard')}
                className="w-full bg-[#7b1113] hover:bg-[#600e10] text-white text-xs font-bold py-3 rounded-xl shadow transition"
              >
                Go to Institution Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
