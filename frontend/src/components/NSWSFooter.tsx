import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Info, FileText, CheckCircle2 } from 'lucide-react';

export const NSWSFooter: React.FC = () => {
  return (
    <footer className="bg-[#0f1c30] text-slate-300 font-sans border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About SAMIKSHA */}
          <div className="space-y-3">
            <div className="font-heading font-bold text-lg text-white tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
              <span>SAMIKSHA PLATFORM</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification.
              Simulating an integrated national single window system with deep regulatory scrutiny workflows.
            </p>
            <div className="text-[11px] text-amber-400/90 font-medium bg-slate-900/60 p-2.5 rounded border border-slate-800">
              Smart India Hackathon Prototype | Problem Statement ID: SIH-2024
            </div>
          </div>

          {/* Column 2: Portal Portals & Navigation */}
          <div className="space-y-3">
            <div className="font-semibold text-sm text-white uppercase tracking-wider">
              Connected Portals
            </div>
            <ul className="text-xs space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-amber-400 transition">
                  Portal A: NSWS Applicant Portal
                </Link>
              </li>
              <li>
                <Link to="/aicte" className="text-slate-400 hover:text-amber-400 transition">
                  Portal B: AICTE Regulatory Portal
                </Link>
              </li>
              <li>
                <Link to="/aicte/login" className="text-slate-400 hover:text-amber-400 transition">
                  Officer Workflow & 8-Role Access
                </Link>
              </li>
              <li>
                <Link to="/know-your-approvals" className="text-slate-400 hover:text-amber-400 transition">
                  Guided Approval Recommendation Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Regulatory Compliance */}
          <div className="space-y-3">
            <div className="font-semibold text-sm text-white uppercase tracking-wider">
              Regulatory Standards
            </div>
            <ul className="text-xs space-y-2">
              <li className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AICTE APH 2024-25 to 2026-27</span>
              </li>
              <li className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated Cross-Field Rule Verification</span>
              </li>
              <li className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>OCR Multi-Document Authentication</span>
              </li>
              <li className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Immutable Role-Based Audit Trails</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Simulation Disclaimer */}
          <div className="space-y-3">
            <div className="font-semibold text-sm text-white uppercase tracking-wider">
              Simulated Environment
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This system is strictly for educational evaluation and technical demonstration.
              No actual institutional approvals or legal certificates are issued.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Full 8-Tier Officer Role Access Supported</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © 2024-2026 SAMIKSHA Project Team. Developed for Smart India Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-semibold">Simulated Prototype</span>
            <span>•</span>
            <span>FastAPI + SQLite Backend</span>
            <span>•</span>
            <span>React + TypeScript + Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
