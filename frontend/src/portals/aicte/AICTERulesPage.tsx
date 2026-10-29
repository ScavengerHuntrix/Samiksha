import React from 'react';
import { Sliders, ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react';

export const AICTERulesPage: React.FC = () => {
  const rules = [
    {
      code: 'APH-RULE-LAND-01',
      category: 'Land & Site Norms',
      path: 'land_details.total_land_acres',
      type: 'NUMERIC (>= 7.5 rural, >= 2.5 metro)',
      desc: 'Minimum contiguous land area requirement under APH Chapter 1, Section 1.4.',
      source: 'Chapter 1, Page 28'
    },
    {
      code: 'APH-RULE-DOC-FIRE-01',
      category: 'Safety & Compliance',
      path: 'documents.fire_safety_certificate',
      type: 'DOCUMENT_PRESENT (Max age 365 days)',
      desc: 'Valid Fire Safety NOC issued by Competent Authority of State Government.',
      source: 'Chapter 1, Annexure 2'
    },
    {
      code: 'APH-RULE-DOC-LAND-02',
      category: 'Land Ownership & Title',
      path: 'documents.land_registration_deed',
      type: 'DOCUMENT_PRESENT (Min 30-year lease)',
      desc: 'Registered Sale Deed or Registered Government Lease Deed for not less than 30 years.',
      source: 'Chapter 1, Section 1.5'
    },
    {
      code: 'APH-RULE-FACULTY-01',
      category: 'Faculty & Academic Cadre',
      path: 'faculty_details.cadre_ratio',
      type: 'CROSS_FIELD (1:2:6 Professor : Assoc : Asst)',
      desc: 'Cadre ratio compliance for approved student intake capacity under Chapter 2.',
      source: 'Chapter 2, Section 2.8'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-5xl font-sans">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7b1113] bg-rose-50 px-2.5 py-1 rounded border border-rose-200 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Version: APH-2024-27-v1.0</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-slate-900">
          AICTE Dynamic Validation Rule Engine
        </h1>
        <p className="text-xs text-slate-500">
          Rules extracted and enforced directly from the AICTE Approval Process Handbook (2024-25 to 2026-27).
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-700">Configured Regulatory Rules</span>
          <span className="text-[11px] text-slate-500 font-mono">Total Active: {rules.length}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {rules.map((rule) => (
            <div key={rule.code} className="p-5 hover:bg-slate-50/60 transition space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {rule.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  Active Rule
                </span>
              </div>

              <div className="text-sm font-bold text-slate-900">{rule.category}</div>
              <p className="text-xs text-slate-600">{rule.desc}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                <div>Field: <span className="text-slate-800 font-bold">{rule.path}</span></div>
                <div>Rule Type: <span className="text-blue-700 font-bold">{rule.type}</span></div>
                <div>Source: <span className="text-amber-700 font-bold">{rule.source}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
