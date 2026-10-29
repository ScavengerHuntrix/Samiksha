import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Building2, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('applicant@demo.samiksha');
  const [password, setPassword] = useState('Demo@1234');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For Phase 1 setup, simulate login token storage
    localStorage.setItem('samiksha_auth_token', 'simulated_jwt_token_applicant');
    localStorage.setItem('samiksha_user_role', 'APPLICANT');
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md font-sans">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#1a2a4a] text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto border border-white/20">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl tracking-tight">
            Applicant Login
          </h2>
          <p className="text-xs text-slate-300">
            National Single Window System (NSWS) — Educational Applicants
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="bg-amber-50 border-b border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Demo Applicant Account:</div>
            <div>Email: <code className="font-mono font-bold">applicant@demo.samiksha</code></div>
            <div>Password: <code className="font-mono font-bold">Demo@1234</code></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address / User ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#fd9638] hover:bg-[#e5852e] text-slate-950 font-bold text-xs py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Applicant Portal</span>
          </button>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#1e3a5f] hover:underline">
              Register here
            </Link>
          </div>
        </form>

        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs">
          <Link to="/aicte/login" className="text-rose-800 font-bold hover:underline flex items-center justify-center gap-1">
            <span>Are you a Ministry / AICTE Officer? Login here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
