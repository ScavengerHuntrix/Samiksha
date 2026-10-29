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
  Layers,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const OtherCategoriesApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ApplicationRecord | null>(null);

  // Form State grounded in APH Chapter II (Clauses 2.6, 2.7, 2.9)
  const [formData, setFormData] = useState({
    subCategory: 'INCREASE_INTAKE_NEW_COURSE',
    targetDepartment: 'Artificial Intelligence and Data Science',
    currentApprovedIntake: 60,
    additionalIntakeRequested: 60,
    totalProposedIntake: 120,
    additionalInstructionalArea: 480,
    dedicatedLaboratoriesAdded: 2,
    workingProfessionalsMode: false,
    workingProfSchedule: 'Evening Sessions (6 PM - 9 PM) + Saturday Laboratory Batches',
    minimumWorkExperienceYears: 1,
    supernumeraryPercent: 15,
    affiliatingNocRef: 'DBATU/AFF/EXP/2024/902',
    evcInspectionConsent: true,
  });

  // Document Checklist grounded in APH Annexure-2
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-oth-1',
      code: 'ANNEX-2-DPR',
      title: 'Detailed Project Report (DPR) on Infrastructure Scaling',
      description: 'Comprehensive justification, curriculum mapping, and capital equipment readiness (Clause 2.6)',
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
      title: 'Chartered Architect Carpet Area Certificate & Floor Plan',
      description: 'Certifying additional instructional space of at least 132 sq.m per added division (Clause 2.6.a)',
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
      title: 'Affiliating University NOC for Expansion',
      description: 'Approval order from affiliating university endorsing the additional intake / new course',
      isRequired: true,
      fileName: 'DBATU_NOC_Additional_Intake.pdf',
      fileSize: '1.4 MB',
      uploadedAt: '2026-10-20T10:30:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-oth-4',
      code: 'ANNEX-2-FACULTY-PLAN',
      title: 'Faculty Recruitment Cadre Plan & Budget Provision',
      description: 'Designated appointment sanction orders maintaining the 1:20 TSR and 1:2:6 cadre ratio',
      isRequired: true,
      status: 'PENDING',
    },
    {
      id: 'doc-oth-5',
      code: 'ANNEX-2-INDUSTRY-MOU',
      title: 'Industry MoUs & Employer Support Letters',
      description: 'Applicable for Working Professionals programmes confirming workplace flexibility and skill alignment (Clause 2.7)',
      isRequired: false,
      status: 'PENDING',
    },
  ]);

  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
  const [referenceNo, setReferenceNo] = useState<string>('SAMIKSHA-OTH-2024-0044');

  useEffect(() => {
    const existing = InstitutionDataService.getApplicationByType('OTHER_CATEGORIES');
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
        'OTHER_CATEGORIES',
        'Other Approval Categories — Expansion & Working Professionals',
        'Chapter II (Clauses 2.6 to 2.15)',
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
            fileSize: '2.2 MB',
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
      const res = InstitutionDataService.validateOtherCategories(formData, documents);
      setValidationResult(res);
      setIsValidating(false);
      InstitutionDataService.saveApplicationDraft(
        'OTHER_CATEGORIES',
        'Other Approval Categories — Expansion & Working Professionals',
        'Chapter II (Clauses 2.6 to 2.15)',
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
      'OTHER_CATEGORIES',
      'Other Approval Categories — Expansion & Working Professionals',
      'Chapter II (Clauses 2.6 to 2.15)',
      formData,
      documents,
      validationResult
    );

    setTimeout(() => {
      try {
        const submitted = InstitutionDataService.submitApplication('OTHER_CATEGORIES');
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
        title="Other Applicable Approval Categories"
        aphChapter="Chapter II — Clauses 2.6, 2.7, 2.9, 2.15"
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
                  <Layers className="w-5 h-5 text-amber-700" />
                  <span>1. Approval Category Selection</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Under AICTE APH 2024–27, upper intake ceilings have been lifted subject to infrastructure readiness and filled faculty positions (Clause 2.6), and dedicated flexible pathways are available for working professionals (Clause 2.7).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-bold text-slate-800">Select Approval Category</label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:outline-none focus:border-[#7b1113]"
                  >
                    <option value="INCREASE_INTAKE_NEW_COURSE">Increase in Intake / Additional Course(s) (Clause 2.6)</option>
                    <option value="WORKING_PROFESSIONALS">Courses for Working Professionals in Flexible Mode (Clause 2.7 — NEP 2020)</option>
                    <option value="SUPERNUMERARY_NRI_FN">Supernumerary Seats for NRI / OCI / Foreign Nationals (Clause 2.9 — 15% Quota)</option>
                    <option value="NEW_PROGRAM_LEVEL">Introduction of New Programme / Level in Existing Institution (Clause 2.8)</option>
                    <option value="WOMEN_TO_COED">Conversion of Women's Institution into Co-ed Institution (Clause 2.15)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Target Department / Programme</label>
                  <input
                    type="text"
                    name="targetDepartment"
                    value={formData.targetDepartment}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Affiliating University NOC Reference</label>
                  <input
                    type="text"
                    name="affiliatingNocRef"
                    value={formData.affiliatingNocRef}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Section 2: Intake Expansion & Infrastructure Scaling */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  <span>2. Intake Expansion & Physical Scaling (Clause 2.6)</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Additional intake requires proportionate instructional space (~132 sq.m per 60 seats) and filled faculty positions to be physically verified via EVC.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Current Approved Intake</label>
                  <input
                    type="number"
                    name="currentApprovedIntake"
                    value={formData.currentApprovedIntake}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Additional Intake Requested</label>
                  <input
                    type="number"
                    name="additionalIntakeRequested"
                    value={formData.additionalIntakeRequested}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Additional Carpet Area (sq.m)</label>
                  <input
                    type="number"
                    name="additionalInstructionalArea"
                    value={formData.additionalInstructionalArea}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                  />
                  <span className="text-[11px] text-slate-500">Min 132 sq.m per 60 seats</span>
                </div>
              </div>

              {/* Section 3: Working Professionals (Clause 2.7) */}
              {formData.subCategory === 'WORKING_PROFESSIONALS' && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-700" />
                    <span>3. Working Professionals Pathway (NEP 2020 Provisions)</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="font-bold text-slate-800">Flexible Timetable & Delivery Model</label>
                      <input
                        type="text"
                        name="workingProfSchedule"
                        value={formData.workingProfSchedule}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                      />
                      <span className="text-[11px] text-slate-500">e.g. Evening batches (6 PM - 9 PM) / Weekend laboratory modules</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800">Minimum Work Experience Required</label>
                      <input
                        type="number"
                        name="minimumWorkExperienceYears"
                        value={formData.minimumWorkExperienceYears}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                      />
                      <span className="text-[11px] text-slate-500">Clause 2.7 stipulates minimum 1 year experience</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Supernumerary Quota (Clause 2.9) */}
              {formData.subCategory === 'SUPERNUMERARY_NRI_FN' && (
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-700" />
                    <span>3. Supernumerary Quota (NRI / Foreign Nationals)</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800">Requested Supernumerary Quota (%)</label>
                      <input
                        type="number"
                        name="supernumeraryPercent"
                        value={formData.supernumeraryPercent}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                      />
                      <span className="text-[11px] text-slate-500">Statutory cap: Max 15% under Clause 2.9</span>
                    </div>
                  </div>
                </div>
              )}

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
                  Expansion & Category Review
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Confirm physical readiness and statutory affiliations for proposed capacity augmentation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Approval Track & Department
                  </h3>
                  <div><strong>Category:</strong> {formData.subCategory}</div>
                  <div><strong>Department:</strong> {formData.targetDepartment}</div>
                  <div><strong>Affiliating NOC:</strong> {formData.affiliatingNocRef}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Intake & Physical Infrastructure
                  </h3>
                  <div><strong>Current Intake:</strong> {formData.currentApprovedIntake} Seats</div>
                  <div><strong>Additional Intake:</strong> +{formData.additionalIntakeRequested} Seats (Total: {Number(formData.currentApprovedIntake) + Number(formData.additionalIntakeRequested)})</div>
                  <div><strong>Carpet Area Added:</strong> {formData.additionalInstructionalArea} sq.m</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded text-[#7b1113] focus:ring-[#7b1113]" />
                  <span>
                    We confirm that the additional physical infrastructure and laboratory equipment are fully ready, and consent to an on-site or digital Expert Visit Committee (EVC) verification in accordance with AICTE APH Clause 2.6.
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
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Application Submitted!
              </h3>
              <p className="text-xs text-slate-600">
                Your application under Chapter II has been queued for Scrutiny and EVC inspection scheduling.
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
