import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import { NSWSLayout } from './layouts/NSWSLayout';
import { AICTELayout } from './layouts/AICTELayout';
import { HomePage } from './portals/nsws/HomePage';
import { AboutPage } from './portals/nsws/AboutPage';
import { ApprovalsPage } from './portals/nsws/ApprovalsPage';
import { KnowYourApprovalsPage } from './portals/nsws/KnowYourApprovalsPage';
import { LoginPage } from './portals/nsws/LoginPage';
import { RegisterPage } from './portals/nsws/RegisterPage';
import { AICTEHomePage } from './portals/aicte/AICTEHomePage';
import { AICTELoginPage } from './portals/aicte/AICTELoginPage';
import { AICTEForgotPasswordPage } from './portals/aicte/AICTEForgotPasswordPage';
import { AICTERulesPage } from './portals/aicte/AICTERulesPage';
import { AICTEInboxPage } from './portals/aicte/AICTEInboxPage';
import { InstitutionDashboardPage } from './portals/institution/InstitutionDashboardPage';
import { EOAApplicationPage } from './portals/institution/EOAApplicationPage';
import { CollaborationApplicationPage } from './portals/institution/CollaborationApplicationPage';
import { UniversityApplicationPage } from './portals/institution/UniversityApplicationPage';
import { ODLOnlineApplicationPage } from './portals/institution/ODLOnlineApplicationPage';
import { OtherCategoriesApplicationPage } from './portals/institution/OtherCategoriesApplicationPage';
import { ScrutinyDashboardPage } from './portals/aicte/scrutiny/ScrutinyDashboardPage';
import { ScrutinyWorkspacePage } from './portals/aicte/scrutiny/ScrutinyWorkspacePage';
import { ArrowRight, UserCheck, Layers } from 'lucide-react';

// Officer Dashboard Placeholder
const OfficerDashboardPlaceholder: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const aicteId = localStorage.getItem('samiksha_aicte_user_id') || 'AICTE-OFFICER-0001';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Authenticated Officer Session</span>
          </div>
          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {aicteId}
          </span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl text-slate-900 capitalize">
          {role?.replace('_', ' ')} Officer Dashboard
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          You are authenticated into Portal B with role-specific access permissions.
          Workflows, inspection logs, deficiency reviews, and committee hearings for this role
          will be exercised in subsequent phases according to the Phase Plan.
        </p>

        <div className="pt-4 flex flex-wrap gap-3">
          <Link
            to="/aicte/admin/rules"
            className="bg-[#7b1113] hover:bg-[#600e10] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>View Regulatory Rules</span>
          </Link>
          <Link
            to="/aicte/inbox"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 transition"
          >
            Open Notification Center
          </Link>
        </div>
      </div>
    </div>
  );
};

// Applicant Dashboard Placeholder
const ApplicantDashboardPlaceholder: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Applicant Dashboard Session</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl text-slate-900">
          My Institutional Applications & Documents
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          Welcome to the NSWS Institutional Applicant Dashboard. From here you will manage your institutional profile, upload and verify campus documents, and submit unified applications to statutory bodies.
        </p>

        <div className="pt-4 flex flex-wrap gap-3">
          <Link
            to="/approvals"
            className="bg-[#1e3a5f] hover:bg-[#142640] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
          >
            <span>Explore All Approvals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. AICTE Regulatory Portal (PORTAL B) - OPENS FIRST ON APPLICATION ROOT */}
        <Route path="/" element={<AICTELayout />}>
          <Route index element={<AICTEHomePage />} />
          <Route path="aicte" element={<AICTEHomePage />} />
          <Route path="aicte/login" element={<AICTELoginPage />} />
          <Route path="aicte/forgot-password" element={<AICTEForgotPasswordPage />} />
          <Route path="aicte/admin/rules" element={<AICTERulesPage />} />
          <Route path="aicte/inbox" element={<AICTEInboxPage />} />

          {/* Role 2: Scrutiny / Re-scrutiny Officer Workspaces */}
          <Route path="aicte/dashboard/scrutiny" element={<ScrutinyDashboardPage />} />
          <Route path="aicte/scrutiny/review/:appId" element={<ScrutinyWorkspacePage />} />

          <Route path="aicte/dashboard/:role" element={<OfficerDashboardPlaceholder />} />

          {/* Institution Applicant Dashboard & Dedicated Online Applications */}
          <Route path="institution/dashboard" element={<InstitutionDashboardPage />} />
          <Route path="institution/applications/eoa" element={<EOAApplicationPage />} />
          <Route path="institution/applications/collaboration" element={<CollaborationApplicationPage />} />
          <Route path="institution/applications/university" element={<UniversityApplicationPage />} />
          <Route path="institution/applications/odl-online" element={<ODLOnlineApplicationPage />} />
          <Route path="institution/applications/other-categories" element={<OtherCategoriesApplicationPage />} />
          <Route path="dashboard" element={<InstitutionDashboardPage />} />
        </Route>

        {/* 2. NSWS Applicant Portal (PORTAL A) - UNTOUCHED & ACCESSIBLE AT /nsws ENTRY POINT */}
        <Route path="/nsws" element={<NSWSLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="know-your-approvals" element={<KnowYourApprovalsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<ApplicantDashboardPlaceholder />} />
        </Route>

        {/* 3. Direct NSWS sub-routes preserved exactly for existing navigation */}
        <Route element={<NSWSLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/know-your-approvals" element={<KnowYourApprovalsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ApplicantDashboardPlaceholder />} />
        </Route>

        {/* Catch-all redirect to AICTE home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
