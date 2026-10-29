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
  Laptop,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const ODLOnlineApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ApplicationRecord | null>(null);

  // Form State grounded in APH Chapter V
  const [formData, setFormData] = useState({
    deliveryMode: 'ONLINE', // ODL, ONLINE, DUAL_MODE
    naacScore: '3.18',
    nbaScoreAvailable: false,
    cdoeHeadquartersAddress: 'Centre for Distance & Online Learning, Pune Campus',
    headOfCdoeName: 'Prof. Dr. Arvind Joshi',
    headOfCdoeRank: 'Professor (Full-Time)',
    proposedProgram: 'Master of Computer Applications (MCA - Online)',
    programLevel: 'Post Graduate Degree',
    proposedLearnerIntake: 1200,
    learnerSupportCentresCount: 4,
    lmsPlatformName: 'AICTE-Compliant Cloud LMS with SWAYAM Integration',
    slmFourQuadrantReady: true,
    aiProctoredExamsReady: true,
  });

  // Document Checklist grounded in APH Chapter V
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-odl-1',
      code: 'APH-CH5-NAAC-CERT',
      title: 'Valid NAAC Accreditation Certificate (Score >= 3.01)',
      description: 'Accreditation certificate validating eligibility under Clause 5.1.d',
      isRequired: true,
      fileName: 'NAAC_Grade_A_Certificate_3_18.pdf',
      fileSize: '1.2 MB',
      uploadedAt: '2026-10-23T11:00:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-odl-2',
      code: 'APH-CH5-CDOE-APPOINTMENTS',
      title: 'CDOE Core Faculty & Administrative Staff Appointment Orders',
      description: 'Appointment letters for Professor Head + Associate + Assistant Professors as per Table 5.1',
      isRequired: true,
      fileName: 'CDOE_Faculty_Appointment_Orders.pdf',
      fileSize: '2.8 MB',
      uploadedAt: '2026-10-23T11:15:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-odl-3',
      code: 'APH-CH5-SLM-READINESS',
      title: 'Self-Learning Material (SLM) 4-Quadrant Readiness Certificate',
      description: 'Demonstrating e-text, audio-video, self-assessment and discussion forum alignment',
      isRequired: true,
      fileName: 'SLM_4_Quadrant_Compliance_Report.pdf',
      fileSize: '4.2 MB',
      uploadedAt: '2026-10-23T11:30:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-odl-4',
      code: 'APH-CH5-LMS-SECURITY',
      title: 'LMS Platform & AI-Proctored Examination Architecture Report',
      description: 'Technical architecture, bandwidth, and cybersecurity compliance for online delivery',
      isRequired: true,
      fileName: 'LMS_Proctoring_System_Architecture.pdf',
      fileSize: '2.1 MB',
      uploadedAt: '2026-10-23T11:45:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-odl-5',
      code: 'APH-CH5-TERRITORIAL-AFFIDAVIT',
      title: 'Affidavit on Territorial Jurisdiction & Non-Offering of Banned ODL Courses',
      description: 'Affirming non-conduct of engineering/architecture in ODL as per Clause 5.1.b',
      isRequired: true,
      status: 'PENDING',
    },
  ]);

  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
  const [referenceNo, setReferenceNo] = useState<string>('SAMIKSHA-ODL-2024-0033');

  useEffect(() => {
    const existing = InstitutionDataService.getApplicationByType('ODL_ONLINE');
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
        'ODL_ONLINE',
        'Open & Distance Learning (ODL) / Online Learning (OL) Programme Application',
        'Chapter V (Clauses 5.1 to 5.3)',
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
            fileName: `${d.code}_Uploaded_Verified.pdf`,
            fileSize: '1.7 MB',
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
      const res = InstitutionDataService.validateODLOnline(formData, documents);
      setValidationResult(res);
      setIsValidating(false);
      InstitutionDataService.saveApplicationDraft(
        'ODL_ONLINE',
        'Open & Distance Learning (ODL) / Online Learning (OL) Programme Application',
        'Chapter V (Clauses 5.1 to 5.3)',
        formData,
        documents,
        res
      );
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    InstitutionDataService.saveApplicationDraft(
      'ODL_ONLINE',
      'Open & Distance Learning (ODL) / Online Learning (OL) Programme Application',
      'Chapter V (Clauses 5.1 to 5.3)',
      formData,
      documents,
      validationResult
    );

    setTimeout(() => {
      try {
        const submitted = InstitutionDataService.submitApplication('ODL_ONLINE');
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
        title="Open & Distance Learning / Online Application"
        aphChapter="Chapter V — Clauses 5.1 to 5.3"
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
                  <Laptop className="w-5 h-5 text-indigo-700" />
                  <span>1. Mode of Delivery & Institutional Eligibility</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  AICTE APH Chapter V mandates valid NAAC score &gt;= 3.01 or NBA accreditation.
                  <strong> Note: AICTE strictly prohibits ODL/OL in Engineering, Architecture, and Hotel Management (Clause 5.1.b).</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Delivery Mode</label>
                  <select
                    name="deliveryMode"
                    value={formData.deliveryMode}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:outline-none focus:border-[#7b1113]"
                  >
                    <option value="ONLINE">Online Learning (OL) Mode (Pan-India & International Learners)</option>
                    <option value="ODL">Open & Distance Learning (ODL) Mode (State Territorial Jurisdiction)</option>
                    <option value="DUAL_MODE">Dual Mode (Both ODL and Online Offerings)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">NAAC Score (Must be &gt;= 3.01)</label>
                  <input
                    type="text"
                    name="naacScore"
                    value={formData.naacScore}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                  />
                  <span className="text-[11px] text-slate-500">Statutory threshold under Clause 5.1.d</span>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-slate-800">Centre of Distance & Online Education (CDOE) Headquarters</label>
                  <input
                    type="text"
                    name="cdoeHeadquartersAddress"
                    value={formData.cdoeHeadquartersAddress}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Head of CDOE (Name)</label>
                  <input
                    type="text"
                    name="headOfCdoeName"
                    value={formData.headOfCdoeName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Head of CDOE Designation / Rank</label>
                  <input
                    type="text"
                    name="headOfCdoeRank"
                    value={formData.headOfCdoeRank}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500">Clause 5.3.3 mandates Full Professor rank</span>
                </div>
              </div>

              {/* Section 2: Programme Selection & Intake Ceiling */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-700" />
                  <span>2. Permitted Programme & Learner Enrolment Cap</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-800">Proposed Programme Name</label>
                  <select
                    name="proposedProgram"
                    value={formData.proposedProgram}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold"
                  >
                    <option value="Master of Computer Applications (MCA - Online)">Master of Computer Applications (MCA - Online)</option>
                    <option value="Master of Business Administration (MBA - ODL)">Master of Business Administration (MBA - ODL)</option>
                    <option value="Post Graduate Diploma in Management (PGDM - Online)">Post Graduate Diploma in Management (PGDM - Online)</option>
                    <option value="Post Graduate Certificate in Artificial Intelligence & Data Science">PG Certificate in AI & Data Science (Online)</option>
                    <option value="PG Diploma in Cyber Security and Blockchain (Online)">PG Diploma in Cyber Security and Blockchain</option>
                  </select>
                  <span className="text-[11px] text-emerald-700 font-medium">Permitted under APH Clause 5.1.a</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Annual Enrolment at HQ</label>
                  <input
                    type="number"
                    name="proposedLearnerIntake"
                    value={formData.proposedLearnerIntake}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                  />
                  <span className="text-[11px] text-slate-500">Max 5,000 at HQ under Table 5.1</span>
                </div>
              </div>

              {/* Section 3: Digital Delivery & LMS */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-700" />
                  <span>3. LMS, 4-Quadrant SLM & Proctored Examination</span>
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Learning Management System (LMS) Platform</label>
                  <input
                    type="text"
                    name="lmsPlatformName"
                    value={formData.lmsPlatformName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      name="slmFourQuadrantReady"
                      checked={formData.slmFourQuadrantReady}
                      onChange={handleInputChange}
                      className="rounded text-[#7b1113] focus:ring-[#7b1113]"
                    />
                    <span className="font-bold text-slate-800">
                      UGC 4-Quadrant E-Content (Video, Text, Quiz, Forum) Ready
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      name="aiProctoredExamsReady"
                      checked={formData.aiProctoredExamsReady}
                      onChange={handleInputChange}
                      className="rounded text-[#7b1113] focus:ring-[#7b1113]"
                    />
                    <span className="font-bold text-slate-800">
                      AI-Assisted Remote Proctored Examination System Enabled
                    </span>
                  </label>
                </div>
              </div>

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
                ← Back to Details
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

        {/* STEP 3: VALIDATION ADVISORY REPORT */}
        {currentStep === 3 && (
          <ValidationAdvisoryReport
            validationResult={validationResult}
            onRerunValidation={handleRunValidation}
            isValidating={isValidating}
            onProceedToSubmit={() => setCurrentStep(4)}
            onBackToEdit={() => setCurrentStep(1)}
          />
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="font-heading font-extrabold text-2xl text-slate-900">
                  ODL / Online Application Review
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Ensure all CDOE staffing, accreditation scores, and 4-quadrant e-content declarations are accurate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Delivery Mode & CDOE
                  </h3>
                  <div><strong>Mode:</strong> {formData.deliveryMode} Mode</div>
                  <div><strong>NAAC Score:</strong> {formData.naacScore} / 4.0 (&gt;= 3.01 Compliant)</div>
                  <div><strong>CDOE Head:</strong> {formData.headOfCdoeName} ({formData.headOfCdoeRank})</div>
                  <div><strong>Campus:</strong> {formData.cdoeHeadquartersAddress}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Programme & Digital Infrastructure
                  </h3>
                  <div><strong>Programme:</strong> {formData.proposedProgram}</div>
                  <div><strong>Annual Enrolment:</strong> {formData.proposedLearnerIntake} Learners (Cap: 5,000)</div>
                  <div><strong>LMS Platform:</strong> {formData.lmsPlatformName}</div>
                  <div><strong>4-Quadrant SLM:</strong> Verified Ready</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded text-[#7b1113] focus:ring-[#7b1113]" />
                  <span>
                    We declare that no technical programmes in Engineering & Technology, Architecture, or Hotel Management are offered in ODL/OL mode, in strict adherence to AICTE APH Clause 5.1.b. All study materials conform to UGC 4-quadrant format.
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
                    <span>{isSubmitting ? 'Transmitting to AICTE Regulation Bureau...' : 'Confirm & Submit Application'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {submittedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                ODL / Online Application Submitted!
              </h3>
              <p className="text-xs text-slate-600">
                Your application under Chapter V has been successfully queued for statutory scrutiny.
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
