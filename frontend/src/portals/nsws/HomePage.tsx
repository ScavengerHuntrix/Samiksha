import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  RefreshCw,
  Layers,
  Award
} from 'lucide-react';
import { getHealth, getSystemInfo, getApprovals } from '../../api/client';
import type { HealthStatus, SystemInfo, Approval } from '../../types';

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CENTRAL' | 'STATE'>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthData, sysData, approvalsData] = await Promise.all([
        getHealth().catch(() => null),
        getSystemInfo().catch(() => null),
        getApprovals().catch(() => []),
      ]);
      setHealth(healthData);
      setSystemInfo(sysData);
      setApprovals(approvalsData);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredApprovals = approvals.filter((app) => {
    const matchesTab =
      activeTab === 'ALL' || app.category.toUpperCase() === activeTab;
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a2a4a] via-[#1e3a5f] to-[#0f1c30] text-white py-16 px-4 overflow-hidden border-b border-slate-700">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fd9638_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart India Hackathon Prototype • AICTE APH 2024-27 Verified</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            National Single Window System <br className="hidden sm:inline" />
            <span className="text-amber-400">Application Validation Platform</span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            AI-powered document authentication, multi-tier cross-field regulatory verification,
            and end-to-end statutory compliance workflow simulating the journey from institutional applicant
            to 8-tier AICTE regulatory approval.
          </p>

          {/* Central Search Bar */}
          <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl shadow-2xl p-2 flex items-center gap-2 border border-slate-300">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Central approvals, State NOCs, Engineering sanctions..."
              className="w-full text-slate-800 text-sm focus:outline-none placeholder-slate-400 px-2 py-1.5"
            />
            <button
              onClick={() => {}}
              className="bg-[#fd9638] hover:bg-[#e5852e] text-slate-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition shrink-0 shadow-sm"
            >
              Search
            </button>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-3 rounded-lg">
              <div className="text-amber-400 font-extrabold text-xl">8 Roles</div>
              <div className="text-[11px] text-slate-400">Applicant to Authority</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-3 rounded-lg">
              <div className="text-amber-400 font-extrabold text-xl">100% Dynamic</div>
              <div className="text-[11px] text-slate-400">Configurable APH Rules</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-3 rounded-lg">
              <div className="text-amber-400 font-extrabold text-xl">Cross-Field</div>
              <div className="text-[11px] text-slate-400">Multi-doc verification</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-3 rounded-lg">
              <div className="text-amber-400 font-extrabold text-xl">Audit Trail</div>
              <div className="text-[11px] text-slate-400">Immutable workflow logs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Backend & Environment Live Status Banner */}
      <section className="container mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${health?.status === 'ok' ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span>System Architecture Status</span>
                {health?.status === 'ok' ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    CONNECTED
                  </span>
                ) : (
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                    DISCONNECTED
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-slate-800 flex flex-wrap items-center gap-2 mt-0.5">
                <span>FastAPI + SQLite Engine:</span>
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {health ? `Active Rule: ${health.active_rule_version || 'None'}` : 'Connecting to localhost:8000...'}
                </span>
                <span className="text-xs text-slate-500">
                  ({approvals.length} approvals in catalog)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md border border-slate-300 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <Link
              to="/aicte/login"
              className="flex items-center gap-1.5 text-xs font-bold bg-[#1a2a4a] hover:bg-[#132038] text-white px-3.5 py-1.5 rounded-md shadow-sm transition"
            >
              <span>Test Officer Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main 4 Action Gateways */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: New Application */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1e3a5f] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-blue-700 transition">
                Apply for New Institution
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Begin standard 8-section institutional submission for Setting up New Technical Institution under AICTE norms.
              </p>
            </div>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#1e3a5f] hover:text-blue-700"
            >
              <span>Start Application Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Know Your Approvals */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-amber-700 transition">
                Know Your Approvals (KYA)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart questionnaire based on state, entity type, land area, and program offering to discover all required clearances.
              </p>
            </div>
            <Link
              to="/know-your-approvals"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <span>Launch Guided Questionnaire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Document Locker */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition">
                Document Locker & OCR
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Centralized document repository supporting document reuse, OCR extraction, and multi-document consistency check.
              </p>
            </div>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <span>Access Applicant Locker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: AICTE Regulatory Officer Portal */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition group border-l-4 border-l-rose-700">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-rose-700" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-rose-800 transition">
                AICTE Regulatory Portal
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulated separate regulatory system with 8 role-based dashboards for Scrutiny, EVC, Hearing, Appellate and Rules Admin.
              </p>
            </div>
            <Link
              to="/aicte"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 hover:text-rose-900"
            >
              <span>Switch to Portal B</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Approvals Catalog Preview */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Regulatory Clearances & Approvals Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Verified statutory approvals required for setting up and running institutions
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'ALL' ? 'bg-white shadow text-[#1e3a5f]' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All Approvals ({approvals.length})
            </button>
            <button
              onClick={() => setActiveTab('CENTRAL')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'CENTRAL' ? 'bg-white shadow text-[#1e3a5f]' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Central ({approvals.filter((a) => a.category === 'CENTRAL').length})
            </button>
            <button
              onClick={() => setActiveTab('STATE')}
              className={`px-3 py-1.5 rounded-md transition ${activeTab === 'STATE' ? 'bg-white shadow text-[#1e3a5f]' : 'text-slate-600 hover:text-slate-900'}`}
            >
              State ({approvals.filter((a) => a.category === 'STATE').length})
            </button>
          </div>
        </div>

        {/* Approvals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApprovals.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {app.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      app.category === 'CENTRAL'
                        ? 'bg-blue-100 text-[#1e3a5f] border border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {app.category} {app.state ? `• ${app.state}` : ''}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-base text-slate-900 leading-snug">
                  {app.name}
                </h4>

                <p className="text-xs text-slate-500 font-medium">
                  Ministry / Body: <span className="text-slate-700 font-semibold">{app.ministry}</span>
                </p>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {app.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Processing SLA:</span>{' '}
                  <span className="font-bold text-slate-700">{app.sla_days} Days</span>
                </div>
                <Link
                  to={`/register?approval=${app.code}`}
                  className="font-bold text-[#1e3a5f] hover:text-amber-600 flex items-center gap-1 transition"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
