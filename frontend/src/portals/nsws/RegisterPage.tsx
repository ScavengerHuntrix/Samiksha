import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Building, ShieldCheck, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [entityType, setEntityType] = useState('TRUST');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg font-sans">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-[#1a2a4a] text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto border border-white/20">
            <UserPlus className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl tracking-tight">
            Institutional Applicant Registration
          </h2>
          <p className="text-xs text-slate-300">
            Create an applicant profile to submit proposals on NSWS
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Trust / Society / Institution Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Vivekananda Educational Foundation"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trust@example.org"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Legal Entity Type</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="TRUST">Registered Public Educational Trust</option>
              <option value="SOCIETY">Registered Educational Society</option>
              <option value="COMPANY">Section 8 Non-Profit Company</option>
              <option value="GOVERNMENT">Central / State Government Body</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Create Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e3a5f] hover:bg-[#142640] text-white font-bold text-xs py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Complete Registration</span>
          </button>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#1e3a5f] hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
