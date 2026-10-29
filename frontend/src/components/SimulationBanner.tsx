import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const SimulationBanner: React.FC = () => {
  return (
    <div className="bg-amber-500 text-slate-950 font-medium px-4 py-1.5 text-xs sm:text-sm flex items-center justify-between shadow-sm border-b border-amber-600 select-none z-50 sticky top-0">
      <div className="container mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-900 shrink-0 animate-pulse" />
          <span className="font-bold tracking-wide">
            SIMULATED PORTAL — NOT AN OFFICIAL NSWS OR AICTE WEBSITE
          </span>
          <span className="hidden md:inline text-slate-900 font-normal">
            | Smart India Hackathon Educational Prototype: AI-Powered Application Validation
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold bg-amber-600/30 px-2 py-0.5 rounded border border-amber-700/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Simulation Active</span>
        </div>
      </div>
    </div>
  );
};
