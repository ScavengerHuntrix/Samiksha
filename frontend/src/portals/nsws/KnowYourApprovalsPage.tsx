import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, Building, MapPin, Layers } from 'lucide-react';

export const KnowYourApprovalsPage: React.FC = () => {
  const [state, setState] = useState('Maharashtra');
  const [institutionType, setInstitutionType] = useState('Technical / Engineering');
  const [locationType, setLocationType] = useState('RURAL');
  const [landAcres, setLandAcres] = useState('7.5');
  const [evaluated, setEvaluated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluated(true);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8 font-sans">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Guidance Engine</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-slate-900">
          Know Your Approvals (KYA)
        </h1>
        <p className="text-xs text-slate-500">
          Answer a few questions about your proposed institution to receive tailored statutory approval requirements grounded in AICTE APH 2024-27.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">State / Union Territory</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Institution Category</label>
            <select
              value={institutionType}
              onChange={(e) => setInstitutionType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="Technical / Engineering">Technical / Engineering Degree College</option>
              <option value="Management / MBA">Management / MBA / MCA Institute</option>
              <option value="Polytechnic Diploma">Polytechnic Diploma Institute</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Location Classification</label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="RURAL">Rural Area (APH Norm: Min 7.5 Acres)</option>
              <option value="URBAN">Urban / Municipal Area (APH Norm: Min 2.5 Acres)</option>
              <option value="MEGA_METRO">Mega / Metro City (APH Norm: Min 1.5 Acres)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Available Contiguous Land Area (Acres)</label>
            <input
              type="number"
              step="0.1"
              value={landAcres}
              onChange={(e) => setLandAcres(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-[#1e3a5f] hover:bg-[#142640] text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Compute Required Approvals</span>
        </button>
      </form>

      {/* Evaluated Output */}
      {evaluated && (
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-6 space-y-6">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-heading font-bold text-lg">
              Recommended Statutory Clearances for {institutionType} ({state})
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">1. AICTE Approval for New Technical Institution</div>
                <div className="text-[11px] text-slate-500">Central Clearance | Statutory Regulatory Body</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                Mandatory
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">2. State Government No Objection Certificate (NOC)</div>
                <div className="text-[11px] text-slate-500">Department of Higher & Technical Education, {state}</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                Mandatory
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">3. Affiliating Technological University NOC</div>
                <div className="text-[11px] text-slate-500">Curriculum & Affiliation Readiness Clearance</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                Mandatory
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/register"
              className="bg-[#fd9638] hover:bg-[#e5852e] text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm inline-flex items-center gap-2"
            >
              <span>Proceed to Institutional Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
