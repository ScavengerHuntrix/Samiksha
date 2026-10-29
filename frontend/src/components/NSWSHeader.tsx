import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Search,
  LogIn,
  UserPlus,
  Building2,
  FileCheck2,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';

export const NSWSHeader: React.FC = () => {
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full flex flex-col font-sans">
      {/* Top Utility Bar (Navy) */}
      <div className="bg-[#1a2a4a] text-slate-100 text-xs py-1.5 px-4 border-b border-slate-700/60">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-amber-400 tracking-wider">
              GOVERNMENT OF INDIA
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              Ministry of Commerce & Industry | DPIIT
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Toll Free: 1800-102-5841</span>
            </div>
            <span className="text-slate-600">|</span>
            <Link
              to="/aicte"
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded transition"
            >
              <span>AICTE Regulatory Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-[#1e3a5f] text-white flex items-center justify-center font-heading font-bold text-2xl shadow-sm border border-slate-700">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="font-heading font-extrabold text-xl tracking-tight text-[#1a2a4a] flex items-center gap-2">
                <span>NATIONAL SINGLE WINDOW SYSTEM</span>
                <span className="text-[10px] bg-blue-100 text-[#1e3a5f] font-mono px-1.5 py-0.5 rounded border border-blue-200 uppercase">
                  SIMULATED
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide">
                SAMIKSHA — Integrated Investor & Institution Clearance Ecosystem
              </div>
            </div>
          </Link>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/know-your-approvals"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#1e3a5f] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-md transition"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Know Your Approvals</span>
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-3 py-2 rounded-md transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>

            {/* Login dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#fd9638] hover:bg-[#e5852e] px-3.5 py-2 rounded-md shadow-sm transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {loginMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-medium"
                  onMouseLeave={() => setLoginMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Select Login Type
                  </div>
                  <Link
                    to="/login"
                    onClick={() => setLoginMenuOpen(false)}
                    className="block px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-[#1e3a5f] transition"
                  >
                    <div className="font-semibold">Applicant / Business Login</div>
                    <div className="text-[11px] text-slate-500">For Educational Trusts & Institutions</div>
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    to="/aicte/login"
                    onClick={() => setLoginMenuOpen(false)}
                    className="block px-3 py-2 text-slate-700 hover:bg-amber-50 hover:text-amber-900 transition"
                  >
                    <div className="font-semibold text-amber-800">Ministry / Officer Login</div>
                    <div className="text-[11px] text-slate-500">AICTE Regulatory Portal (8 Roles)</div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Menu */}
      <nav className="bg-[#1e3a5f] text-white border-t border-slate-700 shadow-sm text-sm">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center overflow-x-auto py-0">
            <Link
              to="/"
              className="px-4 py-2.5 hover:bg-[#152943] font-medium border-b-2 border-amber-400 text-amber-300 transition"
            >
              Home
            </Link>
            <Link
              to="/approvals?category=CENTRAL"
              className="flex items-center gap-1.5 px-4 py-2.5 hover:bg-[#152943] text-slate-200 hover:text-white font-medium transition"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Central Approvals</span>
            </Link>
            <Link
              to="/approvals?category=STATE"
              className="flex items-center gap-1.5 px-4 py-2.5 hover:bg-[#152943] text-slate-200 hover:text-white font-medium transition"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>State Approvals</span>
            </Link>
            <Link
              to="/know-your-approvals"
              className="flex items-center gap-1.5 px-4 py-2.5 hover:bg-[#152943] text-slate-200 hover:text-white font-medium transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>KYA Questionnaire</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-1.5 px-4 py-2.5 hover:bg-[#152943] text-slate-200 hover:text-white font-medium transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>About SAMIKSHA</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <span className="text-[11px] text-slate-300 italic">
              AICTE APH 2024-25 to 2026-27 Compliant
            </span>
          </div>
        </div>
      </nav>

      {/* Marquee ticker for real-time announcements */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 overflow-hidden border-b border-slate-800 flex items-center">
        <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 mr-3">
          ANNOUNCEMENT
        </span>
        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker text-xs space-x-12">
            <span>📢 AICTE Approval Process Handbook (APH 2024-25 to 2026-27) validation rules active in SAMIKSHA.</span>
            <span>⚡ Automated Document Authentication and Cross-Field Verification enabled for Technical Institutions.</span>
            <span>📑 Mandatory 8-section unified application for Grant of Approval for New Technical Institutions.</span>
            <span>🔒 Cryptographic validation & automated scrutiny audit trail enabled for all 8 regulatory officer tiers.</span>
          </div>
        </div>
      </div>
    </header>
  );
};
