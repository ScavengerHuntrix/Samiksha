import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Bell } from 'lucide-react';

export const AICTELayout: React.FC = () => {
  const location = useLocation();
  const isHomepage = location.pathname === '/' || location.pathname === '/aicte' || location.pathname === '/aicte/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* AICTE Portal Header */}
      <header className="bg-[#640e0f] text-white shadow-md">
        {/* Nav tabs */}
        <div className="bg-[#640e0f] text-xs font-semibold px-4">
          <div className="container mx-auto flex items-center space-x-6 overflow-x-auto py-2.5">
            {isHomepage && (
              <Link to="/" className="text-amber-300 hover:text-white transition">
                SAMIKSHA Home
              </Link>
            )}
            <Link to="/aicte/inbox" className="text-rose-100 hover:text-white transition flex items-center gap-1">
              <Bell className="w-3 h-3 text-amber-400" />
              <span>Simulated Email Inbox</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* AICTE Footer */}
      <footer className="bg-[#1f2937] text-slate-300 text-xs py-8 border-t border-slate-700 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>AICTE Regulatory Workflow & Approval Simulation — SAMIKSHA</span>
          </div>
          <div className="text-slate-400">
            Compliant with Approval Process Handbook (APH 2024-25 to 2026-27)
          </div>
          <div className="text-amber-400 font-medium">
            Educational Prototype for Smart India Hackathon
          </div>
        </div>
      </footer>
    </div>
  );
};
