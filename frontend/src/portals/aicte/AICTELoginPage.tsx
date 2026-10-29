import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

export const AICTELoginPage: React.FC = () => {
  // The exact 8 roles requested
  const roles = [
    { label: '1. Institution Applicant', code: 'APPLICANT', defaultId: 'applicant@demo.samiksha' },
    { label: '2. Scrutiny / Re-scrutiny Officer', code: 'SCRUTINY', defaultId: 'AICTE-SCR-0001' },
    { label: '3. EVC / Inspection Officer', code: 'EVC', defaultId: 'AICTE-EVC-0001' },
    { label: '4. Regulation Bureau / Case Coordinator', code: 'COORDINATOR', defaultId: 'AICTE-REG-0001' },
    { label: '5. SHC Member', code: 'SHC', defaultId: 'AICTE-SHC-0001' },
    { label: '6. SAC Member', code: 'SAC', defaultId: 'AICTE-SAC-0001' },
    { label: '7. Authorized Decision Authority', code: 'AUTHORITY', defaultId: 'AICTE-ADA-0001' },
    { label: '8. Rules Administrator', code: 'RULES_ADMIN', defaultId: 'AICTE-ADM-0001' },
  ];

  const [selectedRole, setSelectedRole] = useState<string>('RULES_ADMIN');
  const [userId, setUserId] = useState<string>('AICTE-ADM-0001');
  const [password, setPassword] = useState<string>('Demo@1234');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Update User ID default when dropdown changes
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoleCode = e.target.value;
    setSelectedRole(newRoleCode);
    const matched = roles.find((r) => r.code === newRoleCode);
    if (matched) {
      setUserId(matched.defaultId);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter a valid User ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    // Save authenticated session in localStorage
    localStorage.setItem('samiksha_auth_token', `simulated_jwt_token_${userId}`);
    localStorage.setItem('samiksha_user_role', selectedRole);
    localStorage.setItem('samiksha_aicte_user_id', userId);

    if (selectedRole === 'APPLICANT') {
      navigate('/institution/dashboard');
    } else {
      navigate(`/aicte/dashboard/${selectedRole.toLowerCase()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg font-sans">
      <div className="bg-white rounded-2xl shadow-xl border border-rose-200 overflow-hidden">
        {/* Header - SAMIKSHA Platform Introduction */}
        <div className="bg-[#7b1113] text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto border border-white/20">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl tracking-tight">
            SAMIKSHA Platform Login
          </h1>
          <p className="text-xs text-rose-200 max-w-sm mx-auto leading-relaxed">
            Application validation, document verification, and regulatory compliance reporting system.
            Select your assigned role to access validation and scrutiny workflows.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* 1. Role Selection Dropdown (8 Roles) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Select Authorized Role</span>
              <span className="text-[11px] font-normal text-slate-500">8 Supported Roles</span>
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 bg-slate-50/50 focus:outline-none focus:border-[#7b1113] focus:bg-white transition cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. User ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              User ID / Assigned ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., AICTE-ADM-0001 or applicant@demo.samiksha"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#7b1113] transition"
              required
            />
          </div>

          {/* 3. Password Input with Visibility Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Password</label>
              {/* 4. Forgot Password Link */}
              <Link
                to="/aicte/forgot-password"
                className="text-xs font-bold text-[#7b1113] hover:text-rose-900 hover:underline transition"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-slate-300 rounded-lg p-2.5 pr-10 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#7b1113] transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Demo Credentials Helper Pill */}
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
            <span>Demo Password for all roles:</span>
            <code className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300">
              Demo@1234
            </code>
          </div>

          {/* 5. Login Button */}
          <button
            type="submit"
            className="w-full bg-[#7b1113] hover:bg-[#640e0f] text-white font-bold text-xs sm:text-sm py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>Login to SAMIKSHA</span>
          </button>
        </form>

        {/* 6. Return to AICTE Homepage Link */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            to="/"
            className="text-slate-700 hover:text-[#7b1113] flex items-center gap-1.5 font-bold transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#7b1113]" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/nsws"
            className="text-amber-800 font-bold hover:underline transition"
          >
            Go to NSWS Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
