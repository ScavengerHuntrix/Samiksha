import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldCheck,
  Search,
  Filter,
  FileCheck2,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  Building2,
  BookOpen,
  Scale,
  Sparkles,
  Layers,
  FileText,
  ChevronDown,
  LogOut,
  Mail,
  User
} from 'lucide-react';

export interface ScrutinyApplicationItem {
  id: number;
  reference_no: string;
  institution_name: string;
  institution_pid: string;
  approval_category: string;
  application_type: string;
  status: 'SUBMITTED' | 'UNDER_SCRUTINY' | 'RE_SCRUTINY' | 'DEFICIENT' | 'INSPECTION' | 'APPROVED';
  current_stage: string;
  submitted_at: string;
  aph_version: string;
  assigned_officer_id: string;
  assigned_officer_name: string;
  open_deficiencies: number;
  has_re_scrutiny: boolean;
}

export interface ScrutinyMetrics {
  total_assigned: number;
  awaiting_scrutiny: number;
  under_rescrutiny: number;
  deficient_applications: number;
  completed_reviews: number;
}

const API_BASE = 'http://localhost:8000/api';

export const ScrutinyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ScrutinyApplicationItem[]>([]);
  const [metrics, setMetrics] = useState<ScrutinyMetrics>({
    total_assigned: 0,
    awaiting_scrutiny: 0,
    under_rescrutiny: 0,
    deficient_applications: 0,
    completed_reviews: 0
  });
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const officerId = localStorage.getItem('samiksha_aicte_user_id') || 'AICTE-SCR-0001';
  const officerRole = localStorage.getItem('samiksha_user_role') || 'SCRUTINY';
  const officerName =
    officerId === 'AICTE-SCR-0001'
      ? 'Dr. Rajesh Sharma'
      : (localStorage.getItem('samiksha_user_name') || 'Dr. Rajesh Sharma');
  const officerEmail =
    officerId === 'AICTE-SCR-0001'
      ? 'scrutiny.sharma@aicte.gov.in'
      : `${officerId.toLowerCase()}@aicte.gov.in`;

  // Auth route guard: protect scrutiny dashboard
  useEffect(() => {
    const token = localStorage.getItem('samiksha_auth_token');
    const role = localStorage.getItem('samiksha_user_role');
    if (!token || (role !== 'SCRUTINY' && role !== 'RULES_ADMIN')) {
      navigate('/aicte/login');
      return;
    }
    fetchApplications();
  }, [activeTab]);

  // Click outside listener to dismiss profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication session tokens while leaving application records intact
    localStorage.removeItem('samiksha_auth_token');
    localStorage.removeItem('samiksha_user_role');
    localStorage.removeItem('samiksha_aicte_user_id');
    setIsProfileMenuOpen(false);
    navigate('/aicte/login');
  };

  const fetchApplications = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // 1. Sync applicant submissions from local storage into SQLite database
      const localAppsRaw = localStorage.getItem('samiksha_institution_applications_v1');
      if (localAppsRaw) {
        try {
          const localList = JSON.parse(localAppsRaw);
          await axios.post(`${API_BASE}/scrutiny/sync`, { applications: localList });
        } catch (syncErr) {
          console.warn('Applicant queue sync skipped or deferred:', syncErr);
        }
      }

      // 2. Fetch all applications from backend
      const res = await axios.get(`${API_BASE}/scrutiny/applications`, {
        params: { status_filter: activeTab }
      });
      let queue: ScrutinyApplicationItem[] = res.data?.applications || [];

      // 3. Fallback merge to guarantee that any application applied in applicant portal is visible
      if (localAppsRaw) {
        try {
          const localList: any[] = JSON.parse(localAppsRaw);
          const existingRefs = new Set(queue.map(q => q.reference_no));
          for (const item of localList) {
            if (item.status !== 'DRAFT' && !existingRefs.has(item.referenceNo)) {
              queue.unshift({
                id: item.id || Math.floor(100 + Math.random() * 900),
                reference_no: item.referenceNo,
                institution_name: 'Vivekananda Institute of Technology & Management',
                institution_pid: '1-10972345671',
                approval_category: item.title || 'Technical Institutional Approval',
                application_type: item.type || 'EOA',
                status: item.status,
                current_stage: item.currentStage,
                submitted_at: item.submittedAt || item.lastUpdated || new Date().toISOString(),
                aph_version: 'APH-2024-27-v1.0',
                assigned_officer_id: officerId,
                assigned_officer_name: officerName,
                open_deficiencies: item.status === 'DEFICIENT' ? 2 : 0,
                has_re_scrutiny: item.status === 'RE_SCRUTINY' || (item.currentStage && item.currentStage.includes('Re-Scrutiny'))
              });
            }
          }
        } catch (e) {
          console.warn('Local merge warning:', e);
        }
      }

      setApplications(queue);

      // Recompute metrics based on live queue
      setMetrics({
        total_assigned: queue.length,
        awaiting_scrutiny: queue.filter(x => x.status === 'SUBMITTED' || x.status === 'UNDER_SCRUTINY').length,
        under_rescrutiny: queue.filter(x => x.status === 'RE_SCRUTINY' || (x.current_stage && x.current_stage.includes('Re-Scrutiny'))).length,
        deficient_applications: queue.filter(x => x.status === 'DEFICIENT').length,
        completed_reviews: queue.filter(x => ['INSPECTION', 'APPROVED', 'DECISION'].includes(x.status)).length
      });
    } catch (err: any) {
      console.warn('Backend API connection warning, falling back to local persistent store:', err);
      loadLocalFallbackData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalFallbackData = () => {
    const fallbackApps: ScrutinyApplicationItem[] = [
      {
        id: 1,
        reference_no: 'SAMIKSHA-EOA-2024-0091',
        institution_name: 'Vivekananda Institute of Technology & Management',
        institution_pid: '1-10972345671',
        approval_category: 'Extension of Approval (EoA) — AY 2024-25',
        application_type: 'EOA',
        status: 'UNDER_SCRUTINY',
        current_stage: 'Stage 1: Scrutiny Committee Initial Review',
        submitted_at: new Date().toISOString(),
        aph_version: 'APH-2024-27-v1.0',
        assigned_officer_id: 'AICTE-SCR-0001',
        assigned_officer_name: 'Dr. Rajesh Sharma (Scrutiny Officer)',
        open_deficiencies: 0,
        has_re_scrutiny: false
      },
      {
        id: 2,
        reference_no: 'SAMIKSHA-COL-2024-0018',
        institution_name: 'Vivekananda Institute of Technology & Management',
        institution_pid: '1-10972345671',
        approval_category: 'Collaboration & Twinning with Univ of Melbourne',
        application_type: 'COLLABORATION',
        status: 'RE_SCRUTINY',
        current_stage: 'Stage 1: Re-Scrutiny Cycle (Compliance Review)',
        submitted_at: new Date().toISOString(),
        aph_version: 'APH-2024-27-v1.0',
        assigned_officer_id: 'AICTE-SCR-0001',
        assigned_officer_name: 'Dr. Rajesh Sharma (Scrutiny Officer)',
        open_deficiencies: 1,
        has_re_scrutiny: true
      },
      {
        id: 3,
        reference_no: 'SAMIKSHA-EOA-2024-0042',
        institution_name: 'Vivekananda Institute of Technology & Management',
        institution_pid: '1-10972345671',
        approval_category: 'Extension of Approval (EoA) - Prior Year Deficiencies',
        application_type: 'EOA',
        status: 'DEFICIENT',
        current_stage: 'Deficiency Notice Issued — Awaiting Response',
        submitted_at: new Date().toISOString(),
        aph_version: 'APH-2024-27-v1.0',
        assigned_officer_id: 'AICTE-SCR-0001',
        assigned_officer_name: 'Dr. Rajesh Sharma (Scrutiny Officer)',
        open_deficiencies: 1,
        has_re_scrutiny: false
      },
      {
        id: 4,
        reference_no: 'SAMIKSHA-UNIV-2024-0007',
        institution_name: 'Pune Technological University',
        institution_pid: '1-10972345699',
        approval_category: 'University Technical Department Approval',
        application_type: 'UNIVERSITY',
        status: 'INSPECTION',
        current_stage: 'Stage 2: Expert Visit Committee (EVC Inspection)',
        submitted_at: new Date().toISOString(),
        aph_version: 'APH-2024-27-v1.0',
        assigned_officer_id: 'AICTE-SCR-0001',
        assigned_officer_name: 'Dr. Rajesh Sharma (Scrutiny Officer)',
        open_deficiencies: 0,
        has_re_scrutiny: false
      }
    ];

    setMetrics({
      total_assigned: fallbackApps.length,
      awaiting_scrutiny: fallbackApps.filter(a => a.status === 'UNDER_SCRUTINY').length,
      under_rescrutiny: fallbackApps.filter(a => a.status === 'RE_SCRUTINY').length,
      deficient_applications: fallbackApps.filter(a => a.status === 'DEFICIENT').length,
      completed_reviews: fallbackApps.filter(a => a.status === 'INSPECTION').length
    });

    let filtered = fallbackApps;
    if (activeTab === 'AWAITING_SCRUTINY') filtered = fallbackApps.filter(a => a.status === 'UNDER_SCRUTINY');
    if (activeTab === 'RE_SCRUTINY') filtered = fallbackApps.filter(a => a.status === 'RE_SCRUTINY');
    if (activeTab === 'DEFICIENT') filtered = fallbackApps.filter(a => a.status === 'DEFICIENT');
    if (activeTab === 'COMPLETED') filtered = fallbackApps.filter(a => a.status === 'INSPECTION');

    setApplications(filtered);
  };

  const filteredApps = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.reference_no.toLowerCase().includes(q) ||
      app.institution_name.toLowerCase().includes(q) ||
      app.approval_category.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNDER_SCRUTINY':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Awaiting Scrutiny</span>
          </span>
        );
      case 'RE_SCRUTINY':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded text-[11px] font-bold">
            <RefreshCw className="w-3 h-3 text-purple-700" />
            <span>Under Re-Scrutiny</span>
          </span>
        );
      case 'DEFICIENT':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            <span>Deficiency Notice Active</span>
          </span>
        );
      case 'INSPECTION':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>Forwarded to EVC</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#7b1113] text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Role 2: Scrutiny / Re-scrutiny Committee</span>
            </span>
            <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 font-semibold">
              Officer: {officerId}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Scrutiny Committee Application Review Dashboard
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            Statutory application scrutiny workspace adhering to the AICTE Approval Process Handbook (APH 2024–27).
            Perform document inspection, evaluate AI forensic analysis (OpenCV, PaddleOCR, Sentence-BERT),
            record confirmed deficiencies, and recommend applications for Expert Visit Committee (EVC) inspection.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <button
            onClick={fetchApplications}
            disabled={isLoading}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 transition flex items-center gap-1.5"
            title="Refresh application queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Queue</span>
          </button>

          {/* Profile / Avatar dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-[#7b1113]/20 cursor-pointer shadow-xs"
              aria-label="Officer profile menu"
            >
              {/* Avatar circle */}
              <div className="w-8 h-8 rounded-lg bg-[#7b1113] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                RS
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {officerName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Scrutiny Officer
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  isProfileMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Authenticated Session
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 font-heading">
                    {officerName}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7b1113] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <ShieldCheck className="w-3 h-3 text-[#7b1113]" />
                    <span>Role 2: Scrutiny / Re-scrutiny Officer</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    ID: {officerId}
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-1 pt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{officerEmail}</span>
                  </div>
                </div>

                <div className="px-2 pt-2 pb-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Assigned</span>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{metrics.total_assigned}</div>
          <p className="text-[11px] text-slate-500">In scrutiny pipeline</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Awaiting Scrutiny</span>
          <div className="text-2xl font-extrabold text-amber-700 font-heading">{metrics.awaiting_scrutiny}</div>
          <p className="text-[11px] text-amber-800">Initial review pending</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider">Under Re-Scrutiny</span>
          <div className="text-2xl font-extrabold text-purple-700 font-heading">{metrics.under_rescrutiny}</div>
          <p className="text-[11px] text-purple-800">Compliance response submitted</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">Deficient Applications</span>
          <div className="text-2xl font-extrabold text-rose-700 font-heading">{metrics.deficient_applications}</div>
          <p className="text-[11px] text-rose-800">Notice issued to institution</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Completed / EVC</span>
          <div className="text-2xl font-extrabold text-emerald-700 font-heading">{metrics.completed_reviews}</div>
          <p className="text-[11px] text-emerald-800">Forwarded to Stage 2</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'ALL', label: 'All Applications' },
              { key: 'AWAITING_SCRUTINY', label: 'Awaiting Scrutiny' },
              { key: 'RE_SCRUTINY', label: 'Re-Scrutiny Queue' },
              { key: 'DEFICIENT', label: 'Deficient' },
              { key: 'COMPLETED', label: 'Completed' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-[#7b1113] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Institute Name, Category..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#7b1113] bg-slate-50/50"
            />
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Application Details</th>
                <th className="py-3 px-4">Institution & PID</th>
                <th className="py-3 px-4">Category & Handbook</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Scrutiny Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#7b1113] mb-2" />
                    <p className="font-semibold text-xs">Loading Scrutiny Application Pipeline...</p>
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-slate-400" />
                    <div className="font-bold text-slate-700">No applications found in this view</div>
                    <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                      There are currently no assigned applications matching the selected filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-mono font-bold text-slate-900 group-hover:text-[#7b1113]">
                        {app.reference_no}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{app.institution_name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        PID: {app.institution_pid}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-slate-800">
                        {app.approval_category}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <span>{app.aph_version}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {app.current_stage}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/aicte/scrutiny/review/${app.id}`}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition ${
                          app.status === 'RE_SCRUTINY'
                            ? 'bg-purple-700 hover:bg-purple-800 text-white'
                            : 'bg-[#7b1113] hover:bg-[#600e10] text-white'
                        }`}
                      >
                        <span>{app.status === 'RE_SCRUTINY' ? 'Conduct Re-Scrutiny' : 'Open Workspace'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

