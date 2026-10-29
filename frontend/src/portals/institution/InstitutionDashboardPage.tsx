import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  InstitutionDataService,
  APPROVAL_CATEGORY_CARDS,
  type InstitutionProfile,
  type ApplicationRecord,
} from './data/institutionData';
import { ValidationAdvisoryReport } from './components/ValidationAdvisoryReport';
import {
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  GraduationCap,
  Globe,
  Laptop,
  Building,
  ShieldCheck,
  Search,
  Eye,
  LogOut,
  MapPin,
  Award,
  Info,
  Send,
  Sparkles,
  FileSearch,
} from 'lucide-react';

export const InstitutionDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<InstitutionProfile>(InstitutionDataService.getProfile());
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<
    'ALL' | 'DRAFT' | 'SUBMITTED' | 'PENDING_REVIEW' | 'DEFICIENT' | 'APPROVED'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [modalTab, setModalTab] = useState<'TIMELINE' | 'REPORT' | 'RESPOND'>('TIMELINE');
  const [deficiencyResponseText, setDeficiencyResponseText] = useState<string>('');
  const [responseSuccessMessage, setResponseSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProfile(InstitutionDataService.getProfile());
    setApplications(InstitutionDataService.getAllApplications());
  };

  const handleLogout = () => {
    localStorage.removeItem('samiksha_auth_token');
    localStorage.removeItem('samiksha_user_role');
    navigate('/aicte/login');
  };

  // Filter applications by tab and search
  const filteredApps = applications.filter((app) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'DRAFT' && app.status === 'DRAFT') ||
      (activeTab === 'SUBMITTED' && (app.status === 'SUBMITTED' || app.status === 'UNDER_SCRUTINY')) ||
      (activeTab === 'PENDING_REVIEW' && app.status === 'UNDER_SCRUTINY') ||
      (activeTab === 'DEFICIENT' && app.status === 'DEFICIENT') ||
      (activeTab === 'APPROVED' && app.status === 'APPROVED');

    const matchesSearch =
      searchQuery.trim() === '' ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.aphChapter.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Calculate metrics
  const totalCount = applications.length;
  const draftCount = applications.filter((a) => a.status === 'DRAFT').length;
  const submittedCount = applications.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'UNDER_SCRUTINY'
  ).length;
  const pendingReviewCount = applications.filter((a) => a.status === 'UNDER_SCRUTINY').length;
  const deficientCount = applications.filter((a) => a.status === 'DEFICIENT').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;

  const handleOpenModal = (app: ApplicationRecord, tab: 'TIMELINE' | 'REPORT' | 'RESPOND' = 'TIMELINE') => {
    setSelectedApp(app);
    setModalTab(tab);
    setDeficiencyResponseText(app.deficiencyResponse || '');
    setResponseSuccessMessage(null);
  };

  const handleSubmitDeficiencyResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !deficiencyResponseText.trim()) return;

    const updated = InstitutionDataService.submitDeficiencyResponse(
      selectedApp.id,
      deficiencyResponseText
    );
    setSelectedApp(updated);
    refreshData();
    setResponseSuccessMessage('Deficiency response submitted successfully to Scrutiny Committee.');
    setTimeout(() => {
      setResponseSuccessMessage(null);
      setModalTab('TIMELINE');
    }, 2000);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building':
        return <Building className="w-5 h-5 text-emerald-700" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-700" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-purple-700" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-indigo-700" />;
      default:
        return <Layers className="w-5 h-5 text-amber-700" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* 1. TOP INSTITUTION PROFILE HEADER */}
      <section className="bg-gradient-to-r from-[#7b1113] via-[#640e10] to-[#450a0b] text-white py-8 px-4 shadow-md">
        <div className="container mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 p-2 shadow-inner flex-shrink-0">
                <Building2 className="w-8 h-8 text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                    PID: {profile.aictePid}
                  </span>
                  <span className="text-[11px] font-bold bg-white/20 text-white px-2 py-0.5 rounded border border-white/20">
                    {profile.institutionType}
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/40">
                    {profile.currentApprovalStatus}
                  </span>
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  {profile.name}
                </h1>
                <div className="text-xs text-rose-200 flex flex-wrap items-center gap-y-1 gap-x-3">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-amber-300" />
                    <strong>Trust:</strong> {profile.trustName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    {profile.district}, {profile.state}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    {profile.accreditationSummary}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                type="button"
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-rose-100 hover:text-white text-xs font-bold px-3.5 py-2 rounded-lg border border-white/20 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="pt-3 border-t border-rose-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-200/90">
            <div>
              <strong>Head of Institution:</strong> {profile.headOfInstitution}
            </div>
            <div>
              <strong>Affiliated To:</strong> {profile.affiliatingUniversity}
            </div>
            <div className="text-amber-300 font-medium">
              Academic Session 2024–25 Approval Window Active
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl space-y-10 -mt-4">
        {/* 2. OVERVIEW APPLICATION STATUS KPI SUMMARIES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Total Applications */}
          <div
            onClick={() => setActiveTab('ALL')}
            className={`bg-white p-4 rounded-2xl border shadow-sm cursor-pointer transition ${
              activeTab === 'ALL'
                ? 'border-[#7b1113] ring-2 ring-[#7b1113]/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Total Applications</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="font-mono font-black text-2xl text-slate-900 mt-2">{totalCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all categories</div>
          </div>

          {/* Draft Applications */}
          <div
            onClick={() => setActiveTab('DRAFT')}
            className={`bg-white p-4 rounded-2xl border shadow-sm cursor-pointer transition ${
              activeTab === 'DRAFT'
                ? 'border-amber-500 ring-2 ring-amber-400/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span>Draft Applications</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-mono font-black text-2xl text-amber-600 mt-2">{draftCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">In preparation</div>
          </div>

          {/* Submitted Applications */}
          <div
            onClick={() => setActiveTab('SUBMITTED')}
            className={`bg-white p-4 rounded-2xl border shadow-sm cursor-pointer transition ${
              activeTab === 'SUBMITTED'
                ? 'border-blue-500 ring-2 ring-blue-400/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
              <span>Submitted</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-mono font-black text-2xl text-blue-600 mt-2">{submittedCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Formal filings lodged</div>
          </div>

          {/* Pending Review */}
          <div
            onClick={() => setActiveTab('PENDING_REVIEW')}
            className={`bg-white p-4 rounded-2xl border shadow-sm cursor-pointer transition ${
              activeTab === 'PENDING_REVIEW'
                ? 'border-indigo-500 ring-2 ring-indigo-400/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-indigo-800 text-xs font-bold">
              <span>Pending Review</span>
              <FileSearch className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="font-mono font-black text-2xl text-indigo-600 mt-2">{pendingReviewCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Under Scrutiny / EVC</div>
          </div>

          {/* Action Required / Deficiencies */}
          <div
            onClick={() => setActiveTab('DEFICIENT')}
            className={`bg-white p-4 rounded-2xl border shadow-sm cursor-pointer transition ${
              activeTab === 'DEFICIENT'
                ? 'border-rose-500 ring-2 ring-rose-400/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
              <span>Action Required</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="font-mono font-black text-2xl text-rose-600 mt-2">{deficientCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Deficiencies noted</div>
          </div>
        </div>

        {/* 3. SEPARATE ONLINE APPROVAL APPLICATION CARDS */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#7b1113] tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Approval Categories (APH 2024–25 to 2026–27)</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
                Dedicated Approval Application Categories
              </h2>
              <p className="text-xs text-slate-600">
                Each approval process features a separate online form, APH-based document checklist, save-draft functionality, and automated scrutiny validation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {APPROVAL_CATEGORY_CARDS.map((cat, idx) => {
              const existingApp = applications.find((a) => a.type === cat.type && a.status === 'DRAFT');
              const hasDraft = Boolean(existingApp);
              const submittedVersion = applications.find((a) => a.type === cat.type && a.status !== 'DRAFT');

              return (
                <div
                  key={cat.code}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition">
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {cat.aphChapter}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading font-extrabold text-base text-slate-900 group-hover:text-[#7b1113] transition">
                        {idx + 1}. {cat.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {cat.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Info className="w-3 h-3 text-[#7b1113]" />
                        <span>Key Eligibility:</span>
                      </div>
                      <div className="leading-snug text-slate-600">{cat.eligibilitySummary}</div>
                    </div>

                    {hasDraft && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-lg text-[11px] flex items-center justify-between font-medium">
                        <span>Active Draft in progress:</span>
                        <span className="font-mono font-bold">{existingApp?.referenceNo}</span>
                      </div>
                    )}

                    {submittedVersion && !hasDraft && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-900 p-2 rounded-lg text-[11px] flex items-center justify-between font-medium">
                        <span>Submitted Application:</span>
                        <span className="font-mono font-bold">{submittedVersion.referenceNo}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={cat.route}
                      className="w-full bg-[#7b1113] hover:bg-[#600e10] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <span>{hasDraft ? 'Continue Application (Draft)' : 'Start Application'}</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. ACTIVE APPLICATIONS & STATUS TRACKING SECTION */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-slate-900">
                Application History, Tracking & Actions
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Track draft preparation, scrutiny evaluations, deficiency responses, and final approvals.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('DRAFT')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'DRAFT' ? 'bg-white text-amber-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Drafts ({draftCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('SUBMITTED')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'SUBMITTED' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Submitted ({submittedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('PENDING_REVIEW')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'PENDING_REVIEW' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Review ({pendingReviewCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('DEFICIENT')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'DEFICIENT' ? 'bg-white text-rose-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Deficiencies ({deficientCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('APPROVED')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'APPROVED' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications by Reference No, Title, or Handbook Chapter..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#7b1113] focus:bg-white transition"
            />
          </div>

          {/* Applications Table / Cards */}
          {filteredApps.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Applications Found</div>
              <div className="text-xs text-slate-500 max-w-sm mx-auto">
                No applications match your selected filter criteria. Choose an approval category card above to start a new application.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApps.map((app) => {
                const isDraft = app.status === 'DRAFT';
                const isDeficient = app.status === 'DEFICIENT';
                const isApproved = app.status === 'APPROVED';

                let editRoute = '/institution/applications/eoa';
                if (app.type === 'COLLABORATION') editRoute = '/institution/applications/collaboration';
                if (app.type === 'UNIVERSITY') editRoute = '/institution/applications/university';
                if (app.type === 'ODL_ONLINE') editRoute = '/institution/applications/odl-online';
                if (app.type === 'OTHER_CATEGORIES') editRoute = '/institution/applications/other-categories';

                return (
                  <div
                    key={app.id}
                    className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isDeficient
                        ? 'bg-rose-50/50 border-rose-300'
                        : isDraft
                        ? 'bg-amber-50/30 border-amber-200'
                        : isApproved
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#7b1113] bg-rose-100/70 px-2.5 py-0.5 rounded border border-rose-200">
                          {app.referenceNo}
                        </span>

                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isDraft
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isDeficient
                              ? 'bg-rose-600 text-white animate-pulse'
                              : isApproved
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>

                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          AY {app.academicYear}
                        </span>

                        <span className="text-[11px] font-semibold text-slate-600">
                          {app.aphChapter}
                        </span>
                      </div>

                      <h3 className="font-heading font-extrabold text-base text-slate-900">
                        {app.title}
                      </h3>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                        <span><strong>Current Stage:</strong> {app.currentStage}</span>
                        {app.validationResult && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Advisory Score: {app.validationResult.score}/100
                            </span>
                          </>
                        )}
                      </div>

                      {/* Deficiencies Alert Box */}
                      {isDeficient && app.deficiencyNotes && (
                        <div className="mt-2 p-3 bg-white rounded-xl border border-rose-300 text-xs text-rose-900 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-rose-800">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Action Required from Institution (Deficiency Notice):</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-700">{app.deficiencyNotes}</p>
                        </div>
                      )}

                      {app.deficiencyResponse && (
                        <div className="mt-1 p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-0.5">
                          <span className="font-bold">Your Submitted Clarification:</span>
                          <p className="text-[11px] text-blue-800">{app.deficiencyResponse}</p>
                        </div>
                      )}
                    </div>

                    {/* Contextual Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(app, 'TIMELINE')}
                        className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 transition flex items-center gap-1 shadow-sm"
                        title="View Statutory Progression Timeline"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Track</span>
                      </button>

                      {app.validationResult && (
                        <button
                          type="button"
                          onClick={() => handleOpenModal(app, 'REPORT')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 transition flex items-center gap-1"
                          title="View Advisory Scrutiny Report"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Report</span>
                        </button>
                      )}

                      {isDeficient && (
                        <button
                          type="button"
                          onClick={() => handleOpenModal(app, 'RESPOND')}
                          className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition flex items-center gap-1.5 animate-pulse"
                        >
                          <Send className="w-3.5 h-3.5 text-white" />
                          <span>Respond</span>
                        </button>
                      )}

                      {isDraft || isDeficient ? (
                        <Link
                          to={editRoute}
                          className="bg-[#7b1113] hover:bg-[#600e10] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                        >
                          <span>{isDeficient ? 'Correct in Form' : 'Continue Draft'}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 5. MULTI-PURPOSE APPLICATION MODAL (TIMELINE / REPORT / DEFICIENCY RESPONSE) */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto font-sans">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#7b1113] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {selectedApp.referenceNo}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {selectedApp.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  {selectedApp.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.aphChapter} • Academic Year {selectedApp.academicYear}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setModalTab('TIMELINE')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  modalTab === 'TIMELINE' ? 'bg-[#7b1113] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Statutory Timeline
              </button>
              {selectedApp.validationResult && (
                <button
                  type="button"
                  onClick={() => setModalTab('REPORT')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    modalTab === 'REPORT' ? 'bg-[#7b1113] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Validation Scrutiny Report
                </button>
              )}
              {selectedApp.status === 'DEFICIENT' && (
                <button
                  type="button"
                  onClick={() => setModalTab('RESPOND')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    modalTab === 'RESPOND' ? 'bg-rose-700 text-white' : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  Respond to Deficiencies
                </button>
              )}
            </div>

            {/* SUB-VIEW 1: STATUTORY TIMELINE */}
            {modalTab === 'TIMELINE' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    AICTE 6-Stage Approval Progression
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                    <div
                      className={`p-2 rounded-lg border ${
                        selectedApp.status !== 'DRAFT'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                      }`}
                    >
                      1. Draft
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        selectedApp.status !== 'DRAFT'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      2. Submitted
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        selectedApp.status === 'UNDER_SCRUTINY' ||
                        selectedApp.status === 'DEFICIENT' ||
                        selectedApp.status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      3. Scrutiny
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        selectedApp.status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : selectedApp.status === 'DEFICIENT'
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      4. EVC Visit
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        selectedApp.status === 'APPROVED'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      5. SHC / SAC
                    </div>
                    <div
                      className={`p-2 rounded-lg border ${
                        selectedApp.status === 'APPROVED'
                          ? 'bg-emerald-600 text-white font-bold shadow'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      6. Council LoA
                    </div>
                  </div>
                </div>

                {/* Key Metadata Table */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div><strong>Status:</strong> <span className="font-bold text-slate-900">{selectedApp.status}</span></div>
                  <div><strong>Current Stage:</strong> {selectedApp.currentStage}</div>
                  <div><strong>Last Updated:</strong> {new Date(selectedApp.lastUpdated).toLocaleString()}</div>
                  {selectedApp.submittedAt && (
                    <div><strong>Submitted On:</strong> {new Date(selectedApp.submittedAt).toLocaleString()}</div>
                  )}
                  {selectedApp.validationResult && (
                    <div>
                      <strong>SAMIKSHA Advisory Score:</strong>{' '}
                      <span className="font-bold text-emerald-800">
                        {selectedApp.validationResult.score}/100
                      </span>{' '}
                      ({selectedApp.validationResult.passedCount} / {selectedApp.validationResult.totalChecks} checks compliant)
                    </div>
                  )}
                </div>

                {/* Uploaded Documents List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">
                    Uploaded Supporting Documents ({selectedApp.documents.length})
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {selectedApp.documents.length === 0 ? (
                      <div className="text-xs text-slate-500 italic">No documents attached yet.</div>
                    ) : (
                      selectedApp.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <span className="font-medium text-slate-800">{doc.title}</span>
                          <span className="font-mono text-[11px] text-emerald-700 font-bold">
                            {doc.status} {doc.isDigitallySigned ? '• Class-3 DSC' : ''}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: EMBEDDED VALIDATION REPORT */}
            {modalTab === 'REPORT' && selectedApp.validationResult && (
              <div className="pt-2">
                <ValidationAdvisoryReport
                  validationResult={selectedApp.validationResult}
                  readOnly={true}
                />
              </div>
            )}

            {/* SUB-VIEW 3: RESPOND TO DEFICIENCY */}
            {modalTab === 'RESPOND' && (
              <form onSubmit={handleSubmitDeficiencyResponse} className="space-y-4 pt-2">
                {responseSuccessMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold">
                    {responseSuccessMessage}
                  </div>
                )}

                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-950 space-y-1">
                  <div className="font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>Scrutiny Committee Observations:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700">{selectedApp.deficiencyNotes}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Official Institutional Clarification / Compliance Response
                  </label>
                  <textarea
                    rows={4}
                    value={deficiencyResponseText}
                    onChange={(e) => setDeficiencyResponseText(e.target.value)}
                    placeholder="Enter factual clarification, details of rectified faculty/infrastructure, or reference numbers of uploaded replacement certificates..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#7b1113] focus:bg-white"
                    required
                  />
                  <span className="text-[11px] text-slate-500">
                    This response will be lodged with the AICTE Scrutiny Committee and logged into the audit trail.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setModalTab('TIMELINE')}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-[#7b1113] hover:bg-[#600e10] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>Submit Deficiency Clarification</span>
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-6 py-2 rounded-xl shadow transition"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
