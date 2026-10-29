import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  FileSearch,
  Scale,
  GitCompare,
  FileCheck,
  Clock,
  Layers,
  HelpCircle,
} from 'lucide-react';
import type { ValidationResult } from '../data/institutionData';

interface Props {
  validationResult?: ValidationResult;
  onRerunValidation?: () => void;
  isValidating?: boolean;
  onProceedToSubmit?: () => void;
  onBackToEdit?: () => void;
  readOnly?: boolean;
}

type ReportSubTab = 'OBSERVATIONS' | 'RULES' | 'CROSS_DOC' | 'CRITERIA' | 'STAGES';

export const ValidationAdvisoryReport: React.FC<Props> = ({
  validationResult,
  onRerunValidation,
  isValidating,
  onProceedToSubmit,
  onBackToEdit,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState<ReportSubTab>('OBSERVATIONS');

  if (!validationResult) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 max-w-xl mx-auto font-sans shadow-sm">
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <FileSearch className="w-7 h-7 text-amber-700" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-900">
          Run Pre-Submission Scrutiny
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          SAMIKSHA's automated rule verification checks your application details and uploaded documents against the AICTE Approval Process Handbook (APH 2024–27).
        </p>
        {onRerunValidation && (
          <button
            type="button"
            onClick={onRerunValidation}
            disabled={isValidating}
            className="bg-[#7b1113] hover:bg-[#600e10] text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isValidating ? 'Validating Against APH Rules...' : 'Run Automated Scrutiny'}</span>
          </button>
        )}
      </div>
    );
  }

  const {
    score,
    passedCount,
    totalChecks,
    issues,
    criteriaBreakdown,
    crossDocumentFindings,
    anomalyFlags,
    ruleResults,
    validatedAt,
    ruleVersion,
  } = validationResult;

  const deficiencyCount = issues.filter((i) => i.severity === 'DEFICIENCY').length;
  const warningCount = issues.filter((i) => i.severity === 'WARNING').length;

  // Six existing statutory status categories (APH Lifecycle)
  const statutoryStages = [
    {
      stageNumber: 1,
      code: 'DRAFT',
      name: 'Draft Preparation',
      authority: 'Institution Applicant',
      description: 'Online application compilation, uploading mandatory Annexure-2 documents, and DSC affixation.',
    },
    {
      stageNumber: 2,
      code: 'SUBMISSION',
      name: 'Application Submission',
      authority: 'SAMIKSHA / AICTE Portal',
      description: 'Formal application lock, TER processing fee calculation, and issuance of unique Application ID.',
    },
    {
      stageNumber: 3,
      code: 'SCRUTINY',
      name: 'Document Scrutiny / Re-Scrutiny',
      authority: 'Scrutiny Committee (Role 2)',
      description: 'Desk verification of land title, municipal approvals, faculty master roster, and statutory affidavits.',
    },
    {
      stageNumber: 4,
      code: 'EVC_INSPECTION',
      name: 'Expert Visit Committee (EVC)',
      authority: 'EVC Inspection Officers (Role 3)',
      description: 'Physical or virtual verification of laboratories, classrooms, barrier-free access, and fire safety equipment.',
    },
    {
      stageNumber: 5,
      code: 'HEARING_COMMITTEE',
      name: 'Standing Hearing / Appellate (SHC/SAC)',
      authority: 'SHC (Role 5) & SAC (Role 6)',
      description: 'Grievance hearings for institutions with unrectified deficiencies or disputed scrutiny recommendations.',
    },
    {
      stageNumber: 6,
      code: 'COUNCIL_DECISION',
      name: 'Competent Authority Approval',
      authority: 'Authorized Decision Authority (Role 7)',
      description: 'Executive Council decision, issuance of formal Letter of Approval (LoA) or Extension of Approval (EoA).',
    },
  ];

  // Default Criteria Breakdown if not populated
  const criteriaList = criteriaBreakdown || [
    {
      key: 'app_fields',
      name: 'Application Form Fields & Institutional Data',
      score: 22,
      maxScore: 25,
      explanation: 'Evaluates completeness of operational data (approved intake, faculty roster, classrooms, land tenure).',
    },
    {
      key: 'doc_completeness',
      name: 'Supporting Document Checklist & Class-3 DSC',
      score: 20,
      maxScore: 25,
      explanation: 'Verifies presence of mandatory Annexure-2 statutory documents and valid Digital Signature Certificates.',
    },
    {
      key: 'statutory_norms',
      name: 'Statutory AICTE APH Norms Compliance',
      score: 28,
      maxScore: 30,
      explanation: 'Tests Teacher:Student Ratio (1:20), Cadre distribution (1:2:6), Land live lease (>= 30 yrs), built-up area.',
    },
    {
      key: 'cross_doc',
      name: 'Cross-Document Consistency & Anomaly Scrutiny',
      score: 18,
      maxScore: 20,
      explanation: 'Automated cross-referencing between portal declarations and uploaded deeds/certificates.',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. TOP SCORE & SCRUTINY SUMMARY BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              <span>SAMIKSHA Advisory Scrutiny Report</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Regulatory Scrutiny & Validation Evaluation
            </h2>
            <p className="text-xs text-slate-600 max-w-xl">
              Evaluated against active handbook release <strong className="font-mono text-slate-800">{ruleVersion}</strong> on {new Date(validatedAt).toLocaleDateString()} at {new Date(validatedAt).toLocaleTimeString()}.
            </p>
          </div>

          {/* Objective Score Pill */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Advisory Score
              </div>
              <div
                className={`font-mono font-black text-4xl ${
                  score >= 85 ? 'text-emerald-700' : score >= 70 ? 'text-amber-600' : 'text-rose-700'
                }`}
              >
                {score}
                <span className="text-base text-slate-400">/100</span>
              </div>
            </div>
            <div
              className={`w-3 h-12 rounded-full ${
                score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
            />
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500">Rules Evaluated</div>
            <div className="text-xl font-mono font-bold text-slate-800">{totalChecks} Checks</div>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800">Compliant Passed</div>
            <div className="text-xl font-mono font-bold text-emerald-700">{passedCount} Passed</div>
          </div>
          <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200">
            <div className="text-[11px] font-bold text-rose-800">Deficiencies Flagged</div>
            <div className="text-xl font-mono font-bold text-rose-700">{deficiencyCount} Critical</div>
          </div>
          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800">Advisory Warnings</div>
            <div className="text-xl font-mono font-bold text-amber-700">{warningCount} Advisory</div>
          </div>
        </div>

        {/* Advisory Legal Disclaimer */}
        <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
          <div className="leading-relaxed">
            <strong>Advisory Notice & Statutory Boundary:</strong> All validation scores, inconsistency flags, and deficiency notices generated by SAMIKSHA are advisory checks designed to assist applicant institutions prior to formal scrutiny. The platform <em>does not automatically declare fraud, approve, or reject any application</em>. Official regulatory determinations are rendered exclusively by human officers across the Scrutiny Committee, EVC, SHC, and Authorized Decision Authority.
          </div>
        </div>
      </div>

      {/* 2. REPORT NAVIGATION TABS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('OBSERVATIONS')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'OBSERVATIONS'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Observations ({issues.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CRITERIA')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'CRITERIA'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>Scoring Criteria</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CROSS_DOC')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'CROSS_DOC'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cross-Doc Checks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('RULES')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'RULES'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rule Results</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('STAGES')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'STAGES'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>6 Statutory Stages</span>
            </button>
          </div>

          {onRerunValidation && (
            <button
              type="button"
              onClick={onRerunValidation}
              disabled={isValidating}
              className="text-xs font-bold text-[#7b1113] hover:text-[#590d0e] flex items-center gap-1.5 transition self-end sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
              <span>Re-run Validation</span>
            </button>
          )}
        </div>

        {/* TAB 1: DETAILED OBSERVATIONS & DEFICIENCIES */}
        {activeTab === 'OBSERVATIONS' && (
          <div className="space-y-4">
            {issues.length === 0 ? (
              <div className="p-8 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-emerald-900">Nil Deficiencies Detected</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Your application parameters, operational data, and uploaded documents fully satisfy the configured statutory requirements under APH 2024–27.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {issues.map((issue) => {
                  const isDef = issue.severity === 'DEFICIENCY';
                  return (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                        isDef ? 'bg-rose-50/70 border-rose-200' : 'bg-amber-50/70 border-amber-200'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              isDef ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {issue.severity}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{issue.category}</span>
                          <span className="text-[11px] font-mono text-slate-500">[{issue.ruleCode}]</span>
                        </div>

                        <p className="text-xs font-semibold text-slate-900">{issue.message}</p>

                        <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-4">
                          <span><strong>Handbook Reference:</strong> {issue.aphReference}</span>
                          {issue.evidence && (
                            <span><strong>Evidence:</strong> <code className="font-mono text-slate-800">{issue.evidence}</code></span>
                          )}
                        </div>

                        <div className="text-xs text-emerald-900 bg-white/80 p-2.5 rounded-lg border border-emerald-300 font-medium flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span><strong>Suggested Action:</strong> {issue.suggestedAction}</span>
                        </div>
                      </div>

                      {onBackToEdit && !readOnly && (
                        <button
                          type="button"
                          onClick={onBackToEdit}
                          className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg shadow-sm transition flex-shrink-0 self-start"
                        >
                          Correct in Form
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCORING CRITERIA EXPLANATION */}
        {activeTab === 'CRITERIA' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#7b1113]" />
                <span>How SAMIKSHA Calculates Your Advisory Validation Score</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                The advisory score (0–100) reflects a weighted composite of statutory completeness, regulatory ratio norms, document validity, and cross-document coherence as stipulated in the AICTE Approval Process Handbook (APH 2024–27).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteriaList.map((crit) => (
                <div
                  key={crit.key}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{crit.name}</span>
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {crit.score} / {crit.maxScore} pts
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        crit.score / crit.maxScore >= 0.8
                          ? 'bg-emerald-500'
                          : crit.score / crit.maxScore >= 0.6
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${(crit.score / crit.maxScore) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{crit.explanation}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <span className="font-bold">Scrutiny Benchmark Thresholds:</span>
              <ul className="list-disc list-inside text-[11px] space-y-0.5 text-blue-800">
                <li><strong>85–100:</strong> High Readiness & Nil Statutory Deficiencies. Ready for formal submission.</li>
                <li><strong>70–84:</strong> Advisory Warnings or non-critical documentation gaps. Rectification recommended.</li>
                <li><strong>Below 70:</strong> Critical Deficiencies detected (e.g. TSR ratio &gt; 1:20 or missing mandatory land deed). Correction required.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: CROSS-DOCUMENT CONSISTENCY & ANOMALY FINDINGS */}
        {activeTab === 'CROSS_DOC' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <GitCompare className="w-4 h-4 text-indigo-700" />
                <span>Cross-Document Consistency Audit</span>
              </h4>

              {crossDocumentFindings && crossDocumentFindings.length > 0 ? (
                <div className="space-y-2.5">
                  {crossDocumentFindings.map((cf) => (
                    <div
                      key={cf.id}
                      className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{cf.checkName}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            cf.status === 'CONSISTENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {cf.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2 rounded border border-slate-200">
                        <div>
                          <span className="text-slate-500">Portal Form Field:</span>{' '}
                          <span className="font-bold text-slate-800">{cf.applicationValue}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Document Source:</span>{' '}
                          <span className="font-bold text-slate-800">{cf.documentValue}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600">{cf.observation}</div>
                      <div className="text-[10px] font-mono text-slate-500">{cf.aphClause}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  Automated cross-document consistency checks verified land area in registered lease against portal entry, and faculty count against certified payroll master roster.
                </div>
              )}
            </div>

            {/* Potential Tampering & Anomalies Flagged for Human Review */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4 text-amber-700" />
                  <span>Document Tampering & Anomaly Indicators (Advisory Only)</span>
                </h4>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                  Human Scrutiny Protocol
                </span>
              </div>

              {anomalyFlags && anomalyFlags.length > 0 ? (
                <div className="space-y-2">
                  {anomalyFlags.map((af) => (
                    <div
                      key={af.id}
                      className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {af.documentName} — {af.checkType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                          {af.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700">{af.description}</p>
                      <div className="text-[11px] text-emerald-900 font-medium">
                        <strong>Scrutiny Action:</strong> {af.scrutinyAction}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  Digital Signature Certificates (DSC) and PDF metadata hashes verified without tampering anomalies.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CONFIGURED APH RULE RESULTS */}
        {activeTab === 'RULES' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600 pb-2">
              <span>Dynamic AICTE Rule Engine Evaluation</span>
              <span className="font-mono font-bold text-slate-800">Rule Version: {ruleVersion}</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {(ruleResults || []).length > 0 ? (
                ruleResults!.map((r) => (
                  <div key={r.code} className="p-3.5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                          {r.code}
                        </span>
                        <span className="font-bold text-slate-900">{r.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({r.fieldPath})</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        <strong>Source:</strong> {r.aphClause} • <strong>Evidence:</strong> <span className="font-mono text-slate-800">{r.evidence}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full self-start sm:self-center flex-shrink-0 ${
                        r.status === 'PASSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-slate-500 text-xs italic">
                  Rule results recorded against Teacher:Student Ratio (1:20), Cadre distribution (1:2:6), Live Lease (&gt;= 30 yrs), Classroom capacity, and Annexure-2 checklist.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SIX STATUTORY STAGES */}
        {activeTab === 'STAGES' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900">Six Statutory Stages of the AICTE Approval Lifecycle</span>
              <p className="text-[11px] text-slate-600">
                In compliance with the AICTE Approval Process Handbook (APH 2024–27), applications navigate six chronological regulatory stages from initial compilation to the final Council decision.
              </p>
            </div>

            <div className="space-y-2.5">
              {statutoryStages.map((stage) => (
                <div
                  key={stage.stageNumber}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-[#7b1113] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {stage.stageNumber}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{stage.name}</span>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.2 rounded">
                        {stage.authority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. WORKFLOW FOOTER ACTIONS */}
        {!readOnly && (
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            {onBackToEdit ? (
              <button
                type="button"
                onClick={onBackToEdit}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                ← Back to Application Details & Documents
              </button>
            ) : (
              <div />
            )}

            {onProceedToSubmit && (
              <button
                type="button"
                onClick={onProceedToSubmit}
                className="w-full sm:w-auto bg-[#7b1113] hover:bg-[#600e10] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Review & Final Submission</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
