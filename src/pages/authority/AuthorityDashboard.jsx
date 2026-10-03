import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LeafletMap from '../../components/common/LeafletMap';
import { HOTSPOTS } from '../../data/reports';
import { 
  FileText, 
  Compass, 
  ArrowUpRight, 
  ShieldCheck,
  Ship,
  FolderOpen
} from 'lucide-react';

export const AuthorityDashboard = () => {
  const { reports } = useApp();
  const navigate = useNavigate();

  // Dynamic statistics calculations reflecting actual report states
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.status === 'REPORTED').length;
  const highPriorityCount = reports.filter(r => r.priority === 'High' && r.status !== 'CLOSED').length;
  const cleanupAssignedCount = reports.filter(r => ['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED'].includes(r.status)).length;
  const closedCount = reports.filter(r => r.status === 'CLOSED').length;

  const recentReports = reports.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-100 text-teal-800 border border-teal-200 mb-1">
            Coastal Maritime Authority
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Marine Waste Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Coastal surveillance monitoring, incident verification, and salvage dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/authority/reports"
            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-medium px-4 py-2 rounded text-xs transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Incident Reports ({totalCount})</span>
          </Link>
          <Link
            to="/authority/map"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-4 py-2 rounded text-xs transition shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-teal-700" />
            <span>Map & Hotspots</span>
          </Link>
        </div>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Reports */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Reports</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Logged in registry</div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Pending Verification</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">Requires review</div>
        </div>

        {/* High Priority */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">High Priority</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{highPriorityCount}</div>
          <div className="text-[11px] text-rose-700 font-medium mt-0.5">Hazardous to vessels</div>
        </div>

        {/* Cleanup Assigned */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Cleanup Assigned</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">{cleanupAssignedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Vessels dispatched</div>
        </div>

        {/* Closed */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-slate-500">Closed</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{closedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Verified & resolved</div>
        </div>
      </div>

      {/* Main Two Sections: Left = Recent Reports, Right = Coastal Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Recent Reports Table */}
        <div className="lg:col-span-7 bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Reports</h2>
              <p className="text-xs text-slate-500">Incident transmissions awaiting verification and dispatch</p>
            </div>
            {reports.length > 0 && (
              <Link
                to="/authority/reports"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View All ({totalCount})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Report ID</th>
                    <th className="px-4 py-3">Waste Type</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-teal-900">
                        {report.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {report.wasteType}
                      </td>
                      <td className="px-4 py-3 max-w-[140px] truncate text-slate-600">
                        {report.locationName}
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={report.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/authority/reports/${report.id}`)}
                          className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-semibold bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded transition border border-teal-200"
                        >
                          <span>Manage</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No marine waste reports yet.</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Reports submitted by registered users will appear here.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Embedded Coastal Map with Markers & Hotspot */}
        <div className="lg:col-span-5 bg-white rounded border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Coastal Incident Map</h2>
              <p className="text-xs text-slate-500">Live surveillance sector view</p>
            </div>
            <Link
              to="/authority/map"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Full Screen Map &rarr;
            </Link>
          </div>

          <LeafletMap
            center={[18.9802, 72.8214]}
            zoom={10}
            height="360px"
            reports={reports}
            hotspots={HOTSPOTS}
            role="authority"
          />

          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Surveillance Status:</span> Active coastal patrol
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              {reports.filter(r => r.status !== 'CLOSED').length} Active Incidents
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
