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
  GraduationCap,
  Building,
  Scale,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const UniversityApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApp, setSubmittedApp] = useState<ApplicationRecord | null>(null);

  // Form State grounded in APH Chapter IV
  const [formData, setFormData] = useState({
    universityType: 'State Private University',
    universityName: 'Savitribai Technical & Research University',
    gazetteRef: 'Maharashtra Act No. 18 of 2018 / Gazette STR-2018-04',
    gazetteDate: '2018-06-22',
    ugcRecognitionStatus: 'UGC Act 1956 Section 2(f) and 12(B) Listed',
    ugcNotificationOrder: 'F.No. 8-12/2019 (CPP-I/PU)',
    constituentUnitName: 'School of Engineering, Technology & Advanced Computing',
    territorialJurisdiction: 'State of Maharashtra',
    campusAcres: 25.5,
    totalTechnicalIntake: 720,
    academicCouncilResolution: 'AC/RES/2024/09 dated 15-Jan-2024',
    endowmentFundCrores: 5.0,
    ugcPayScaleCompliant: true,
  });

  // Document Checklist grounded in APH Chapter IV
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-univ-1',
      code: 'APH-CH4-ACT-GAZETTE',
      title: 'State/Central Legislative Act & Official Gazette Notification',
      description: 'Statutory Act establishing the University and Gazette notification order (Clause 4.1)',
      isRequired: true,
      fileName: 'State_Legislative_Act_Gazette.pdf',
      fileSize: '3.6 MB',
      uploadedAt: '2026-10-22T10:00:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-univ-2',
      code: 'APH-CH4-UGC-ORDER',
      title: 'UGC 2(f) / 12(B) Recognition Letter',
      description: 'Order issued by University Grants Commission confirming listing in UGC university directory',
      isRequired: true,
      fileName: 'UGC_2f_Listing_Order.pdf',
      fileSize: '1.4 MB',
      uploadedAt: '2026-10-22T10:15:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-univ-3',
      code: 'APH-CH4-COUNCIL-RES',
      title: 'Academic Council & Governing Body Resolution',
      description: 'Statutory resolution approving technical programmes, intake, and curriculum',
      isRequired: true,
      fileName: 'Academic_Council_Resolution_2024.pdf',
      fileSize: '1.8 MB',
      uploadedAt: '2026-10-22T10:30:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-univ-4',
      code: 'APH-CH4-LAND-DEED',
      title: 'University Campus Land Ownership Master Plan',
      description: 'Title deeds registered in the name of the University (>10 acres)',
      isRequired: true,
      fileName: 'University_Campus_Land_Survey.pdf',
      fileSize: '5.8 MB',
      uploadedAt: '2026-10-22T10:45:00Z',
      isDigitallySigned: true,
      status: 'UPLOADED',
    },
    {
      id: 'doc-univ-5',
      code: 'APH-CH4-FACULTY-ROSTER',
      title: 'University Faculty Cadre & UGC Pay Scale Roster',
      description: 'Designated appointment orders adhering to AICTE/UGC qualifications and pay scales',
      isRequired: true,
      status: 'PENDING',
    },
  ]);

  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>(undefined);
  const [referenceNo, setReferenceNo] = useState<string>('SAMIKSHA-UNI-2024-0052');

  useEffect(() => {
    const existing = InstitutionDataService.getApplicationByType('UNIVERSITY');
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
        'UNIVERSITY',
        'University Technical Approval — Technical Department & Constituent Units',
        'Chapter IV (Clauses 4.1 to 4.5)',
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
            fileSize: '2.4 MB',
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
      const res = InstitutionDataService.validateUniversity(formData, documents);
      setValidationResult(res);
      setIsValidating(false);
      InstitutionDataService.saveApplicationDraft(
        'UNIVERSITY',
        'University Technical Approval — Technical Department & Constituent Units',
        'Chapter IV (Clauses 4.1 to 4.5)',
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
      'UNIVERSITY',
      'University Technical Approval — Technical Department & Constituent Units',
      'Chapter IV (Clauses 4.1 to 4.5)',
      formData,
      documents,
      validationResult
    );

    setTimeout(() => {
      try {
        const submitted = InstitutionDataService.submitApplication('UNIVERSITY');
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
        title="University Technical Approval Application"
        aphChapter="Chapter IV — Clauses 4.1 to 4.5"
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
                  <GraduationCap className="w-5 h-5 text-purple-700" />
                  <span>1. University Statutory Status & UGC Recognition</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  AICTE APH Chapter IV covers Central, State Public, State Private Universities, and Institutions Deemed to be Universities conducting technical courses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">University Category</label>
                  <select
                    name="universityType"
                    value={formData.universityType}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900 focus:outline-none focus:border-[#7b1113]"
                  >
                    <option value="State Private University">State Private University (Clause 4.1.a.ii)</option>
                    <option value="State Public University">State Public University (Clause 4.1.a.ii)</option>
                    <option value="Central University">Central University (Clause 4.1.a.i)</option>
                    <option value="Institution Deemed to be University">Institution Deemed to be University (Clause 4.1.a.iii)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">University Name</label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Legislative Act & Gazette Reference</label>
                  <input
                    type="text"
                    name="gazetteRef"
                    value={formData.gazetteRef}
                    onChange={handleInputChange}
                    placeholder="e.g. State Act No. 18 of 2018"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Gazette Publication Date</label>
                  <input
                    type="date"
                    name="gazetteDate"
                    value={formData.gazetteDate}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">UGC Recognition Status</label>
                  <input
                    type="text"
                    name="ugcRecognitionStatus"
                    value={formData.ugcRecognitionStatus}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Must include 2(f) and/or 12(B)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">UGC Listing Order Number</label>
                  <input
                    type="text"
                    name="ugcNotificationOrder"
                    value={formData.ugcNotificationOrder}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Section 2: Technical Constituent Units & Infrastructure */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-700" />
                  <span>2. Technical Constituent Units, Campus Land & Intake</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-800">Technical School / Constituent College Name</label>
                  <input
                    type="text"
                    name="constituentUnitName"
                    value={formData.constituentUnitName}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Territorial Jurisdiction</label>
                  <input
                    type="text"
                    name="territorialJurisdiction"
                    value={formData.territorialJurisdiction}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Continuous Campus Land (in Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="campusAcres"
                    value={formData.campusAcres}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900 font-bold"
                  />
                  <span className="text-[11px] text-slate-500">Min 10 acres recommended for University</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Total Proposed Technical Intake</label>
                  <input
                    type="number"
                    name="totalTechnicalIntake"
                    value={formData.totalTechnicalIntake}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Endowment / Corpus Fund (Rs. Crores)</label>
                  <input
                    type="number"
                    step="0.5"
                    name="endowmentFundCrores"
                    value={formData.endowmentFundCrores}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Section 3: Governance & Pay Scale Compliance */}
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-700" />
                  <span>3. Academic Council Approval & Pay Scales</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Academic Council Approval Resolution</label>
                  <input
                    type="text"
                    name="academicCouncilResolution"
                    value={formData.academicCouncilResolution}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg p-2.5 font-mono text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500">Clause 4.3 statutory resolution</span>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="ugcPayScaleCompliant"
                      checked={formData.ugcPayScaleCompliant}
                      onChange={handleInputChange}
                      className="rounded text-[#7b1113] focus:ring-[#7b1113]"
                    />
                    <span className="font-bold text-slate-800">
                      UGC/AICTE 7th Pay Commission pay scales implemented for technical faculty
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
                  University Technical Application Review
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Confirm statutory establishment documents and constituent faculty allocations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    University Legal Identity
                  </h3>
                  <div><strong>University:</strong> {formData.universityName}</div>
                  <div><strong>Type:</strong> {formData.universityType}</div>
                  <div><strong>Act:</strong> {formData.gazetteRef} ({formData.gazetteDate})</div>
                  <div><strong>UGC:</strong> {formData.ugcRecognitionStatus}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1">
                    Technical Constituent Unit & Campus
                  </h3>
                  <div><strong>Unit:</strong> {formData.constituentUnitName}</div>
                  <div><strong>Campus Land:</strong> {formData.campusAcres} Acres</div>
                  <div><strong>Technical Intake:</strong> {formData.totalTechnicalIntake} Seats</div>
                  <div><strong>Endowment:</strong> Rs. {formData.endowmentFundCrores} Crores</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 rounded text-[#7b1113] focus:ring-[#7b1113]" />
                  <span>
                    We confirm that the University is established in accordance with applicable Law, duly recognized by the UGC, and that all technical programmes conform to AICTE Approval Process Handbook Chapter IV norms.
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

      {submittedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                University Application Submitted!
              </h3>
              <p className="text-xs text-slate-600">
                Your application under Chapter IV has been successfully recorded in the AICTE university validation queue.
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
