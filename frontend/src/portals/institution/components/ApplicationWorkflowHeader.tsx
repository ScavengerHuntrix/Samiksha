import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  title: string;
  aphChapter: string;
  referenceNo?: string;
  currentStep: number;
  onStepChange: (step: number) => void;
  onSaveDraft: () => void;
  isSaving?: boolean;
  saveMessage?: string | null;
}

export const ApplicationWorkflowHeader: React.FC<Props> = ({
  title,
  aphChapter,
  referenceNo,
  currentStep,
  onStepChange,
  onSaveDraft,
  isSaving,
  saveMessage,
}) => {
  const steps = [
    { number: 1, label: 'Application Details' },
    { number: 2, label: 'Upload Documents' },
    { number: 3, label: 'Validation & Advisory' },
    { number: 4, label: 'Review & Submit' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm font-sans">
      <div className="container mx-auto px-4 py-3">
        {/* Top Row: Navigation and Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Link
              to="/institution/dashboard"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="Return to Institution Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  {title}
                </h1>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  {aphChapter}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>PID: 1-10972345671</span>
                <span>•</span>
                <span>Ref: <strong className="font-mono text-slate-700">{referenceNo || 'Draft (Unassigned)'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveMessage && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </span>
            )}
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: 4-Step Stepper */}
        <div className="pt-3 flex items-center justify-between overflow-x-auto">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.number;
            const isCompleted = currentStep > s.number;

            return (
              <React.Fragment key={s.number}>
                <button
                  type="button"
                  onClick={() => onStepChange(s.number)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                    isActive
                      ? 'bg-[#7b1113] text-white shadow'
                      : isCompleted
                      ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCompleted ? '✓' : s.number}
                  </span>
                  <span>{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-grow h-0.5 mx-2 hidden md:block ${
                      currentStep > idx + 1 ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Advisory Banner */}
        <div className="mt-2.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-900 rounded p-1.5 px-3 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Educational Prototype Advisory:</strong> Validation results and discrepancy checks are consultative and intended for administrative pre-submission scrutiny. Final regulatory decisions are issued only after statutory committee examination.
          </span>
        </div>
      </div>
    </div>
  );
};
