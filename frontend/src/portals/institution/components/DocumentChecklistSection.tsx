import React from 'react';
import { Upload, FileCheck2, AlertCircle, CheckCircle, Trash2, KeyRound } from 'lucide-react';
import type { DocumentItem } from '../data/institutionData';

interface Props {
  documents: DocumentItem[];
  onUploadSimulate: (docId: string) => void;
  onRemoveDoc: (docId: string) => void;
  onToggleDsc: (docId: string) => void;
}

export const DocumentChecklistSection: React.FC<Props> = ({
  documents,
  onUploadSimulate,
  onRemoveDoc,
  onToggleDsc,
}) => {
  const uploadedCount = documents.filter((d) => d.status === 'UPLOADED' || d.status === 'VERIFIED').length;
  const requiredCount = documents.filter((d) => d.isRequired).length;

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-heading font-extrabold text-xl text-slate-900">
              Supporting Documents Checklist & Digital Signature (DSC)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Upload statutory annexure files as prescribed under AICTE Approval Process Handbook (APH 2024–27).
              Digitally sign documents using Class 3 DSC where required.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-600">Completion Status:</span>
            <div className="text-sm font-extrabold font-mono text-[#7b1113]">
              {uploadedCount} / {documents.length} Files Ready ({requiredCount} Mandatory)
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {documents.map((doc, idx) => {
            const isUploaded = doc.status === 'UPLOADED' || doc.status === 'VERIFIED';

            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isUploaded
                    ? 'bg-slate-50 border-emerald-300'
                    : doc.isRequired
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                      Doc #{idx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{doc.title}</h3>
                    {doc.isRequired ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Optional / As Applicable
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{doc.description}</p>

                  {isUploaded && (
                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{doc.fileName}</span>
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">{doc.fileSize}</span>

                      {/* DSC Badge and Toggle */}
                      <button
                        type="button"
                        onClick={() => onToggleDsc(doc.id)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition ${
                          doc.isDigitallySigned
                            ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                        title="Click to toggle Class-3 DSC digital signature simulation"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>{doc.isDigitallySigned ? 'DSC Attached (Class 3)' : 'No DSC (Click to Sign)'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isUploaded ? (
                    <>
                      <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Uploaded</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveDoc(doc.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Remove uploaded file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUploadSimulate(doc.id)}
                      className="bg-[#7b1113] hover:bg-[#600e10] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Upload PDF Document</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
          <p>
            <strong>Note on Digital Signature (DSC):</strong> Under APH Clause 2.3.4, documents uploaded must be digitally signed using a valid Class-3 Digital Signature Certificate of the Head of Institution or Authorized Trustee. Use the DSC button to toggle the simulated cryptographic token signature.
          </p>
        </div>
      </div>
    </div>
  );
};
