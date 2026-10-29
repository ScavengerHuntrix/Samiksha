import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 font-sans">
      <div className="space-y-3">
        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 uppercase tracking-wider">
          Architecture & Background
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
          About SAMIKSHA
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1e3a5f] flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Problem Statement & Mission
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Technical educational institutions applying for statutory approval undergo tedious scrutiny involving dozens of legal, financial, and technical documents. SAMIKSHA automates cross-field verification, flags discrepancies, and prevents manual oversight errors.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Dual-Portal Architecture
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The platform faithfully simulates a public-facing National Single Window System (Portal A) for institution registration and approval discovery, smoothly transitioning into a specialized AICTE Regulatory Portal (Portal B) for 8-tier officer evaluation.
          </p>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-6 border border-slate-200 space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-900">
          Verified Reference: AICTE Approval Process Handbook (APH 2024-25 to 2026-27)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The validation rule engine in SAMIKSHA extracts and enforces standards directly from the official APH Handbook including land norms, building plans, faculty cadres, corpus requirements, and fire safety norms.
        </p>
      </div>
    </div>
  );
};
