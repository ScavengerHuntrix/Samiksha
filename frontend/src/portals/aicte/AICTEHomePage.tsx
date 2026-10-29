import React from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  UserPlus,
  FileCheck2,
  Search,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  FileText,
  FileSearch,
  Scale,
  AlertCircle,
  BarChart3,
  ClipboardList
} from 'lucide-react';

export const AICTEHomePage: React.FC = () => {
  const validationFeatures = [
    {
      step: '01',
      title: 'Application & Document Review',
      desc: 'Reviews submitted applications and documents across administrative, financial, infrastructural, and academic categories.',
      icon: FileSearch,
      tag: 'Review Phase'
    },
    {
      step: '02',
      title: 'Completeness Check & Extraction',
      desc: 'Checks document completeness against statutory checklists and extracts relevant information from submitted records.',
      icon: ClipboardList,
      tag: 'Extraction'
    },
    {
      step: '03',
      title: 'Cross-Document Comparison',
      desc: 'Compares information across documents and application fields to ensure data consistency (e.g. land title vs. site plan measurements).',
      icon: Scale,
      tag: 'Cross-Verification'
    },
    {
      step: '04',
      title: 'Requirement & Anomaly Detection',
      desc: 'Checks configured requirements and flags possible inconsistencies or tampering for human review and scrutiny.',
      icon: AlertCircle,
      tag: 'Discrepancy Flagging'
    },
    {
      step: '05',
      title: 'Validation Score Calculation',
      desc: 'Calculates an objective validation score using implemented criteria, category weightings, and compliance thresholds.',
      icon: BarChart3,
      tag: 'Scoring Engine'
    },
    {
      step: '06',
      title: 'Final Validation Reporting',
      desc: 'Generates a final validation report containing results, missing requirements, flagged issues, and items requiring review.',
      icon: FileCheck2,
      tag: 'Audit Report'
    }
  ];

  const roles = [
    { role: 'Institution Applicant', id: 'applicant@demo.samiksha', tier: 'Role 1' },
    { role: 'Scrutiny / Re-scrutiny Officer', id: 'AICTE-SCR-0001', tier: 'Role 2' },
    { role: 'EVC / Inspection Officer', id: 'AICTE-EVC-0001', tier: 'Role 3' },
    { role: 'Regulation Bureau / Case Coordinator', id: 'AICTE-REG-0001', tier: 'Role 4' },
    { role: 'SHC Member', id: 'AICTE-SHC-0001', tier: 'Role 5' },
    { role: 'SAC Member', id: 'AICTE-SAC-0001', tier: 'Role 6' },
    { role: 'Authorized Decision Authority', id: 'AICTE-ADA-0001', tier: 'Role 7' },
    { role: 'Rules Administrator', id: 'AICTE-ADM-0001', tier: 'Role 8' },
  ];

  return (
    <div className="flex flex-col space-y-12 pb-16 font-sans">
      {/* Hero Introduction Section */}
      <section className="bg-gradient-to-r from-[#7b1113] via-[#630e10] to-[#450a0b] text-white py-14 px-4 shadow-inner">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>AI-Powered Application Validation & Document Verification</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            SAMIKSHA Platform
          </h1>

          <p className="max-w-3xl text-rose-100 text-sm sm:text-base leading-relaxed">
            SAMIKSHA is an intelligent application validation and document verification platform designed to ensure
            rigorous regulatory compliance. The system automatically inspects submitted institutional applications and documents,
            verifies completeness, performs cross-field comparison, detects inconsistencies, and calculates validation scores.
          </p>

          {/* TWO PROMINENT ACTION BUTTONS (Preserved Exactly) */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-lg">
            {/* Button 1: Login */}
            <Link
              to="/aicte/login"
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-center"
            >
              <KeyRound className="w-5 h-5 text-slate-950" />
              <span>Login</span>
            </Link>

            {/* Button 2: New Registration (Redirects to NSWS) */}
            <Link
              to="/nsws"
              className="flex-1 bg-white hover:bg-slate-100 text-[#7b1113] font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-center border border-white/40"
            >
              <UserPlus className="w-5 h-5 text-[#7b1113]" />
              <span>New Registration</span>
            </Link>
          </div>

          <div className="text-xs text-rose-200/90 flex items-center gap-2 pt-1">
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong>New Registration</strong> takes you to the National Single Window System (NSWS) applicant onboarding portal.
            </span>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Overview */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[#7b1113]">
            <CheckCircle2 className="w-6 h-6" />
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Automated Verification & Compliance Capabilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            SAMIKSHA streamlines statutory scrutiny by validating institutional submissions against dynamic regulatory rules.
            The engine evaluates uploaded documents for completeness, extracts key attributes, reconciles cross-document references,
            flags potential anomalies for human review, and delivers a consolidated validation report with an objective compliance score.
          </p>
        </div>
      </section>

      {/* 6-Step Explanation of SAMIKSHA Capabilities */}
      <section className="container mx-auto px-4 max-w-5xl space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#7b1113]" />
            <span>How SAMIKSHA Validates Applications</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            End-to-end automated verification pipeline from ingestion to final validation reporting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validationFeatures.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-[#7b1113]/40 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-2xl text-amber-600">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-[#7b1113] border border-rose-200 uppercase">
                      {stage.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#7b1113] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-orange-500/10 rounded-2xl border border-amber-300 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-heading font-extrabold text-2xl text-slate-900">
              Ready to begin or evaluate applications?
            </h3>
            <p className="text-xs sm:text-sm text-slate-700">
              Select <strong>Login</strong> for authorized officer evaluation, or <strong>New Registration</strong> to begin as an educational institution applicant on NSWS.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/aicte/login"
              className="bg-[#7b1113] hover:bg-[#600e10] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Login</span>
            </Link>
            <Link
              to="/nsws"
              className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow transition border border-slate-300 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-600" />
              <span>New Registration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8-Tier Role Reference Table for Evaluators */}
      <section className="container mx-auto px-4 max-w-5xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-slate-800 font-heading font-bold text-lg">
            <Users className="w-5 h-5 text-[#7b1113]" />
            <span>SAMIKSHA 8-Role Access Framework</span>
          </div>
          <span className="text-xs text-slate-500">Default Demo Password: <strong>Demo@1234</strong></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {roles.map((r) => (
            <div key={r.tier} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase">{r.tier}</span>
              <div className="font-bold text-slate-900">{r.role}</div>
              <div className="font-mono text-[11px] text-slate-500 truncate">{r.id}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
