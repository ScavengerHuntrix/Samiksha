import React from 'react';
import { Mail, Shield, CheckCircle2, Clock } from 'lucide-react';

export const AICTEInboxPage: React.FC = () => {
  const simulatedEmails = [
    {
      id: 1,
      from: 'noreply.credentials@aicte.gov.in',
      to: 'applicant@demo.samiksha',
      subject: 'Institutional Credential Allotment & Temporary Password',
      date: 'Today, 09:30 AM',
      body: 'Your application for Setting up New Technical Institution has generated Application Reference No: AICTE-APP-2024-8841. Your temporary password and security token have been generated.'
    },
    {
      id: 2,
      from: 'scrutiny.committee@aicte.gov.in',
      to: 'applicant@demo.samiksha',
      subject: 'Notice of Deficiency: Land Ownership & Fire NOC Review',
      date: 'Yesterday, 04:15 PM',
      body: 'During Scrutiny stage evaluation, discrepancy was noted between land title deed area and proposed campus plan. Please upload registered rectification deed within 7 working days.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl font-sans">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7b1113] bg-rose-50 px-2.5 py-1 rounded border border-rose-200 uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Simulated Notification Center</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-slate-900">
          Simulated Email & SMS Inbox
        </h1>
        <p className="text-xs text-slate-500">
          Educational simulation of official emails, OTPs, deficiency notices, and credential allotment letters sent by the AICTE portal.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {simulatedEmails.map((email) => (
          <div key={email.id} className="p-6 space-y-3 hover:bg-slate-50 transition">
            <div className="flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{email.subject}</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{email.date}</span>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              From: <span className="text-slate-700">{email.from}</span> | To: <span className="text-slate-700">{email.to}</span>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed font-mono">
              {email.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
