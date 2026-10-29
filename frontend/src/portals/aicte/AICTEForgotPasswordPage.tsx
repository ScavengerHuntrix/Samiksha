import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Mail,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export const AICTEForgotPasswordPage: React.FC = () => {
  const [role, setRole] = useState('SCRUTINY');
  const [userId, setUserId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const roles = [
    { label: 'Institution Applicant', code: 'APPLICANT' },
    { label: 'Scrutiny / Re-scrutiny Officer', code: 'SCRUTINY' },
    { label: 'EVC / Inspection Officer', code: 'EVC' },
    { label: 'Regulation Bureau / Case Coordinator', code: 'COORDINATOR' },
    { label: 'SHC Member', code: 'SHC' },
    { label: 'SAC Member', code: 'SAC' },
    { label: 'Authorized Decision Authority', code: 'AUTHORITY' },
    { label: 'Rules Administrator', code: 'RULES_ADMIN' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg font-sans">
      {/* Simulation Notice */}
      <div className="mb-4 bg-amber-500/15 border border-amber-300 rounded-xl p-3 text-center text-xs font-bold text-amber-950 flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>SIMULATED PORTAL — NOT AN OFFICIAL NSWS OR AICTE WEBSITE</span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-rose-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#7b1113] text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto border border-white/20">
            <KeyRound className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl tracking-tight">
            Password Recovery
          </h1>
          <p className="text-xs text-rose-200">
            Simulated Credential Recovery for AICTE Regulatory Portal
          </p>
        </div>

        {/* Prototype Disclaimer Box */}
        <div className="bg-amber-50 border-b border-amber-200 p-4 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Prototype Demonstration Notice:</span>
          </div>
          <p className="leading-relaxed">
            This is an educational simulation. No actual emails, SMS gateways, or real AICTE authentication servers are invoked. All seeded accounts retain their demo credentials.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Select Your Assigned Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 bg-slate-50/50 focus:outline-none focus:border-[#7b1113] transition"
              >
                {roles.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                User ID / Registered Email Address
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. AICTE-SCR-0001 or applicant@demo.samiksha"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#7b1113] transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7b1113] hover:bg-[#640e0f] text-white font-bold text-xs sm:text-sm py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Submit Recovery Request</span>
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Simulated Password Recovery Dispatched</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                In a live system, a secure reset token would be emailed to the registered contact for <strong>{userId || 'your account'}</strong>.
              </p>
              <div className="pt-2 text-xs text-slate-700 bg-white p-3 rounded-lg border border-emerald-200 space-y-1">
                <div>For prototype evaluation, use default demo credentials:</div>
                <div className="font-mono font-bold text-slate-900">
                  Password: <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">Demo@1234</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                to="/aicte/login"
                className="w-full bg-[#7b1113] hover:bg-[#640e0f] text-white text-xs font-bold py-2.5 rounded-lg text-center transition"
              >
                Return to Login
              </Link>
              <Link
                to="/aicte/inbox"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-lg text-center border border-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span>View Simulated Email Inbox</span>
              </Link>
            </div>
          </div>
        )}

        {/* Footer Link */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            to="/aicte/login"
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <Link
            to="/"
            className="text-[#7b1113] font-bold hover:underline transition"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
