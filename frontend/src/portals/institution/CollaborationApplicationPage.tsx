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
  Globe,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const CollaborationApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ApplicationRecord | null>(null);

  // Form State grounded in APH Chapter III
  const [formData, setFormData] = useState({
    collaborationType: 'Twinning Programme',
    partnerInstitution: 'University of Melbourne',
    partnerCountry: 'Australia',
    partnerRankingRank: '33',
    partnerRankingSource: 'QS World University Rankings 2024',
    partnerAccreditingBody: 'Tertiary Education Quality and Standards Agency (TEQSA)',
    proposedCourse: 'B.Tech in Computer Science & Engineering (Twinning Mode)',
    level: 'Under Graduate Degree',
    programDurationYears: 4,
    intakeSought: 60,
    creditsAbroadPercent: 37.5,
    semestersInIndia: 5,
    semestersAbroad: 3,
    affiliatingNocRef: 'DBATU/AFF/NOC/2024/771',
    visaContingencyCompliant: true,
    annualReportAdherence: true,
  });

  // Document Checklist grounded in APH Chapter III
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-col-1',
      code: 'APH-CH3-MOU',
      title: 'Bipartite Agreement / Signed MoU',
      description: 'Executed agreement between Indian Institution and Partner Foreign/National University (Clause 3.2.h)',
      isRequired: true,
      fileName: 'Bipartite_MoU_Melbourne_Signed.pdf',
      fileSize: '4.1 MB',
      uploadedAt: '2026-10-24T14:00:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-col-2',
      code: 'APH-CH3-QS-PROOF',
      title: 'Proof of Global Ranking (QS / THE Top 1000)',
      description: 'Official ranking proof confirming partner university ranking in Top 1000 (Clause 3.2.b)',
      isRequired: true,
      fileName: 'QS_Ranking_Proof_Melbourne_Top100.pdf',
      fileSize: '1.2 MB',
      uploadedAt: '2026-10-24T14:10:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-col-3',
      code: 'APH-CH3-CREDIT-MATRIX',
      title: 'Curriculum & Credit Transfer Mapping Matrix',
      description: 'Certifying that credit transfer to foreign partner does not exceed 40% (Clause 3.2.k)',
      isRequired: true,
      fileName: 'Credit_Transfer_Mapping_37_5_Percent.pdf',
      fileSize: '2.5 MB',
      uploadedAt: '2026-10-24T14:15:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-col-4',
      code: 'APH-CH3-NOC',
      title: 'Affiliating University NOC',
      description: 'No Objection Certificate from Affiliating University (Clause 3.2.g)',
      isRequired: true,
      fileName: 'DBATU_Twinning_NOC.pdf',
      fileSize: '890 KB',
      uploadedAt: '2026-10-24T14:20:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-col-5',
      code: 'APH-CH3-MEA-AFFIDAVIT',
      title: 'MEA & MoE Compliance Affidavit',
      description: 'Affidavit adhering to Ministry of External Affairs and Ministry of Education guidelines (Clause 3.5.g)',
      isRequired: true,
      status: 'PENDING',
    },
  ]);

  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
  const [referenceNo, setReferenceNo] = useState<string>('SAMIKSHA-COL-2024-0018');

  useEffect(() => {
    const existing = InstitutionDataService.getApplicationByType('COLLABORATION');
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
        'COLLABORATION',
        'Collaboration & Twinning Programme — University of Melbourne',
        'Chapter III (Clauses 3.1 to 3.6)',
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
            fileSize: '1.9 MB',
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
      const res = InstitutionDataService.validateCollaboration(formData, documents);
      setValidationResult(res);
      setIsValidating(false);
      InstitutionDataService.saveApplicationDraft(
        'COLLABORATION',
        'Collaboration & Twinning Programme — University of Melbourne',
        'Chapter III (Clauses 3.1 to 3.6)',
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
      'COLLABORATION',
      'Collaboration & Twinning Programme — University of Melbourne',
      'Chapter III (Clauses 3.1 to 3.6)',
      formData,
      documents,
      validationResult
    );

    setTimeout(() => {
      try {
        const submitted = InstitutionDataService.submitApplication('COLLABORATION');
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
        title="Collaboration & Twinning Programme Application"
        aphChapter="Chapter III — Clauses 3.1 to 3.6"
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
                  <Globe className="w-5 h-5 text-blue-700" />
                  <span>1. Collaborating Partner Details & Global Ranking</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  AICTE APH Chapter III permits collaboration only with Foreign Universities ranking within the top 1000 QS/THE World Ranking, or Indian HEIs accredited with NAAC &gt;= 3.01 or NBA &gt;= 650.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Collaboration Type</label>
                  <select
                    name="collaborationType"
                    value={formData.collaborationType}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:outline-none focus:border-[#7b1113]"
                  >
                    <option value="Twinning Programme">Twinning Programme (Clause 3.1.b — Degree by Parent Indian HEI)</option>
                    <option value="Joint Degree Programme">Joint Degree Programme (Clause 3.1.c — Single Joint Certificate)</option>
                    <option value="Dual Degree Programme">Dual Degree Programme (Clause 3.1.d — Two Degrees as per UGC Norms)</option>
                    <option value="Student Exchange Programme">Student Exchange Programme (1-2 Semesters)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Partner University / HEI Name</label>
                  <input
                    type="text"
                    name="partnerInstitution"
                    value={formData.partnerInstitution}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Partner Country</label>
                  <input
                    type="text"
                    name="partnerCountry"
                    value={formData.partnerCountry}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Global Ranking Position (QS / THE World Ranking)</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-bold">#</span>
                    <input
                      type="number"
                      name="partnerRankingRank"
                      value={formData.partnerRankingRank}
                      onChange={handleInputChange}
                      className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">Statutory threshold: Rank must be &lt;= 1000 under Clause 3.2.b</span>
                </div>
              </div>

              {/* Section 2: Programme & Credit Transfer Ceiling */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-700" />
                  <span>2. Course Nomenclature & Credit Transfer Limits</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Under Clause 3.2.k, credits earned at the foreign partner university <strong>shall not exceed 40 percent</strong> of total programme credits. Maximum additional intake is strictly 1 division (60 seats).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-800">Proposed Course Nomenclature</label>
                  <input
                    type="text"
                    name="proposedCourse"
                    value={formData.proposedCourse}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Must conform to approved AICTE nomenclature (Clause 3.2.d)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Proposed Intake (Max 60 Seats)</label>
                  <input
                    type="number"
                    name="intakeSought"
                    value={formData.intakeSought}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                  />
                  <span className="text-[11px] text-slate-500">Clause 3.2 cap: 1 division / 60 seats</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Credits Earned Abroad (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="creditsAbroadPercent"
                    value={formData.creditsAbroadPercent}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                  />
                  <span className="text-[11px] text-slate-500">Statutory cap: Max 40% under Clause 3.2.k</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Semesters in India</label>
                  <input
                    type="number"
                    name="semestersInIndia"
                    value={formData.semestersInIndia}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Semesters at Partner HEI</label>
                  <input
                    type="number"
                    name="semestersAbroad"
                    value={formData.semestersAbroad}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Section 3: Statutory Safeguards */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-700" />
                  <span>3. Affiliation, Visa Contingency & State Fee Norms</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Affiliating University NOC Reference No.</label>
                  <input
                    type="text"
                    name="affiliatingNocRef"
                    value={formData.affiliatingNocRef}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Mandatory under Clause 3.2.g</span>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="visaContingencyCompliant"
                      checked={formData.visaContingencyCompliant}
                      onChange={handleInputChange}
                      className="rounded text-[#7b1113] focus:ring-[#7b1113]"
                    />
                    <span className="font-bold text-slate-800">
                      Clause 3.2.l Visa Contingency: Students failing visa absorbable in regular batch
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
                  Collaboration & Twinning Review
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Verify academic partnership arrangements and credit transfer compliance before regulatory filing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Partner & Programme Profile
                  </h3>
                  <div><strong>Partner HEI:</strong> {formData.partnerInstitution} ({formData.partnerCountry})</div>
                  <div><strong>QS Ranking:</strong> #{formData.partnerRankingRank} (Top 1000 Eligible)</div>
                  <div><strong>Arrangement:</strong> {formData.collaborationType}</div>
                  <div><strong>Course:</strong> {formData.proposedCourse}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Credit & Intake Limits
                  </h3>
                  <div><strong>Credits Abroad:</strong> {formData.creditsAbroadPercent}% (Statutory Ceiling: 40%)</div>
                  <div><strong>Intake Sought:</strong> {formData.intakeSought} Seats (Ceiling: 60 Seats)</div>
                  <div><strong>Split:</strong> {formData.semestersInIndia} Semesters (India) / {formData.semestersAbroad} Semesters (Abroad)</div>
                  <div><strong>Affiliating NOC:</strong> {formData.affiliatingNocRef}</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded text-[#7b1113] focus:ring-[#7b1113]" />
                  <span>
                    We declare that the foreign collaborative programme complies with UGC 2022 Regulations, MEA requirements, and AICTE APH Chapter III. We confirm that supernumerary and lateral entry seats will not be admitted in this collaborative arrangement (Clause 3.5.a).
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
                    <span>{isSubmitting ? 'Transmitting to Scrutiny Committee...' : 'Confirm & Submit Application'}</span>
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Collaboration Application Submitted!
              </h3>
              <p className="text-xs text-slate-600">
                Your application under Chapter III has been submitted to the AICTE Scrutiny Committee queue.
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
