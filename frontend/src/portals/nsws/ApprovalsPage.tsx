import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Layers, MapPin, ArrowRight } from 'lucide-react';
import { getApprovals } from '../../api/client';
import type { Approval } from '../../types';

export const ApprovalsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(categoryParam || 'ALL');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getApprovals({
          category: category !== 'ALL' ? category : undefined,
          search: search || undefined,
        });
        setApprovals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, search]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading font-extrabold text-3xl text-slate-900">
          Approvals & Clearances Directory
        </h1>
        <p className="text-xs text-slate-500">
          Search, filter, and apply for statutory clearances across Central Ministries and State Authorities
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, ministry..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold w-full md:w-auto">
          <button
            onClick={() => setCategory('ALL')}
            className={`px-3 py-2 rounded-lg transition ${category === 'ALL' ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Categories
          </button>
          <button
            onClick={() => setCategory('CENTRAL')}
            className={`px-3 py-2 rounded-lg transition ${category === 'CENTRAL' ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Central Approvals
          </button>
          <button
            onClick={() => setCategory('STATE')}
            className={`px-3 py-2 rounded-lg transition ${category === 'STATE' ? 'bg-[#1e3a5f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            State Approvals
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading regulatory approvals...</div>
      ) : approvals.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500">No approvals match your search filter.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {app.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-50 text-[#1e3a5f] border border-blue-200">
                    {app.category}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                  {app.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{app.ministry}</p>
                <p className="text-xs text-slate-600 line-clamp-3">{app.description}</p>
                {app.requirements_summary && (
                  <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-bold text-slate-700">Checklist:</span> {app.requirements_summary}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">SLA: <strong className="text-slate-800">{app.sla_days} Days</strong></span>
                <Link
                  to={`/register?approval=${app.code}`}
                  className="font-bold text-[#1e3a5f] hover:text-amber-600 flex items-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
