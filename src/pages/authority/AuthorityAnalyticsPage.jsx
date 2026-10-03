import React from 'react';
import { useApp } from '../../context/AppContext';
import { HOTSPOTS } from '../../data/reports';
import { BarChart3, Recycle, FolderOpen, TrendingUp, ShieldCheck } from 'lucide-react';

export const AuthorityAnalyticsPage = () => {
  const { reports } = useApp();

  const totalReports = reports.length;

  // Status counts (calculated purely from real reports)
  const reportedCount = reports.filter(r => r.status === 'REPORTED').length;
  const verifiedCount = reports.filter(r => r.status === 'VERIFIED').length;
  const cleanupAssignedCount = reports.filter(r => ['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED'].includes(r.status)).length;
  const removedCount = reports.filter(r => ['WASTE REMOVED', 'WASTE CATEGORIZED'].includes(r.status)).length;
  const closedCount = reports.filter(r => r.status === 'CLOSED').length;

  // Waste Categories: Fishing Net, Plastic, Other
  const netCount = reports.filter(r => r.wasteType.toLowerCase().includes('net')).length;
  const plasticCount = reports.filter(r => r.wasteType.toLowerCase().includes('plastic')).length;
  const otherCount = totalReports - (netCount + plasticCount);

  // Waste Handling: Recycled, Reused, Disposed (strictly calculated from reports)
  const recycledCount = reports.filter(r => (r.wasteHandling || '').toLowerCase() === 'recycled').length;
  const reusedCount = reports.filter(r => (r.wasteHandling || '').toLowerCase() === 'reused').length;
  const disposedCount = reports.filter(r => (r.wasteHandling || '').toLowerCase() === 'disposed').length;
  const totalHandled = recycledCount + reusedCount + disposedCount;

  const pct = (count, total) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Marine Waste & Recovery Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quantified metrics on coastal ghost net retrieval, plastic containment, and recovery handling
        </p>
      </div>

      {totalReports > 0 ? (
        <>
          {/* Top Level Summary Row (Requirement 26) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Total Reports</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{totalReports}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">All coastal sectors</div>
            </div>

            <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Reported</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">{reportedCount}</div>
              <div className="text-[11px] text-amber-700 font-medium mt-0.5">Awaiting verification</div>
            </div>

            <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Verified</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{verifiedCount}</div>
              <div className="text-[11px] text-blue-700 font-medium mt-0.5">Confirmed incidents</div>
            </div>

            <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Cleanup Assigned</div>
              <div className="text-2xl font-bold text-teal-700 mt-1">{cleanupAssignedCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Dispatched craft</div>
            </div>

            <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Removed</div>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{removedCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Extracted from water</div>
            </div>

            <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Closed</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{closedCount}</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Verified & resolved</div>
            </div>
          </div>

          {/* Section 2: Waste Categories & Handling Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Waste Categories (Fishing Net, Plastic, Other) */}
            <div className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900">Waste Categories</h2>
                <span className="text-xs text-slate-400">Total: {totalReports} reports</span>
              </div>

              <div className="space-y-4">
                {/* Fishing Net */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">Fishing Net</span>
                    <span className="font-bold text-slate-900">{netCount} reports ({pct(netCount, totalReports)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-700 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct(netCount, totalReports)}%` }}
                    />
                  </div>
                </div>

                {/* Plastic Waste */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">Plastic Waste</span>
                    <span className="font-bold text-slate-900">{plasticCount} reports ({pct(plasticCount, totalReports)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct(plasticCount, totalReports)}%` }}
                    />
                  </div>
                </div>

                {/* Other Waste */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">Other Marine Waste</span>
                    <span className="font-bold text-slate-900">{otherCount} reports ({pct(otherCount, totalReports)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct(otherCount, totalReports)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Handling (Recycled, Reused, Disposed) */}
            <div className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900">Waste Handling & Disposal</h2>
                <span className="text-xs text-slate-400">{totalHandled} Categorized</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Recycled */}
                <div className="bg-emerald-50 border border-emerald-200 rounded p-4 text-center">
                  <Recycle className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-emerald-900">{recycledCount}</div>
                  <div className="text-xs font-semibold text-emerald-800">Recycled</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">{pct(recycledCount, totalHandled)}% rate</div>
                </div>

                {/* Reused */}
                <div className="bg-sky-50 border border-sky-200 rounded p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-sky-600 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-sky-900">{reusedCount}</div>
                  <div className="text-xs font-semibold text-sky-800">Reused</div>
                  <div className="text-[10px] text-sky-600 mt-0.5">{pct(reusedCount, totalHandled)}% rate</div>
                </div>

                {/* Disposed */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-center">
                  <ShieldCheck className="w-5 h-5 text-slate-600 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-slate-800">{disposedCount}</div>
                  <div className="text-xs font-semibold text-slate-700">Disposed</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{pct(disposedCount, totalHandled)}% rate</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600">
                <strong>Handling Note:</strong> Quantities update automatically as coastal salvage teams log retrieved gear categorization.
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded border border-slate-200 p-16 text-center shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No marine waste reports yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Reports submitted by registered users will appear here to calculate real-time analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthorityAnalyticsPage;
