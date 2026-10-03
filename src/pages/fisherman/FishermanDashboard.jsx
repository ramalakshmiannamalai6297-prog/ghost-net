import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserReports, useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { 
  Plus, 
  MapPin, 
  ChevronRight, 
  Waves
} from 'lucide-react';

export const FishermanDashboard = () => {
  const { reports, user } = useApp();
  const navigate = useNavigate();

  // Only show reports owned by the active user.
  const userReports = getUserReports(reports, user);

  // Statistics calculation for fisherman
  const submittedCount = userReports.length;
  const underReviewCount = userReports.filter(r => r.status === 'REPORTED' || r.status === 'VERIFIED').length;
  const resolvedCount = userReports.filter(r => r.status === 'CLOSED').length;

  const recentReports = userReports.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wide">
                Fisherman Portal
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {user?.isNewUser && submittedCount === 0
                ? `Welcome${user?.name ? `, ${user.name}` : ''}!`
                : `Welcome back${user?.name ? `, ${user.name}` : ''}!`}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {user?.isNewUser && submittedCount === 0
                ? 'Ready to file your first ghost net report?'
                : 'Report marine waste and help protect our coastal waters.'}
            </p>
          </div>

          <Link
            to="/fisherman/report"
            className="inline-flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold px-6 py-3 rounded text-sm transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Report Marine Waste</span>
          </Link>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-xs text-slate-500 font-medium">Reports Submitted</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{submittedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Total across coastal sectors</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-xs text-slate-500 font-medium">Reports Under Review</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{underReviewCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Awaiting salvage dispatch</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-xs text-slate-500 font-medium">Reports Resolved</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Waste removed & recycled</div>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
            <p className="text-xs text-slate-500">Track status and cleanup progress for your submitted incidents</p>
          </div>
          {userReports.length > 0 && (
            <Link 
              to="/fisherman/reports" 
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              <span>View All ({userReports.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentReports.length > 0 ? (
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                onClick={() => navigate(`/fisherman/reports/${report.id}`)}
                className="p-4 rounded border border-slate-200 hover:border-sky-300 hover:bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm font-mono">{report.id}</span>
                    <span className="text-xs text-slate-600 font-medium">&bull; {report.wasteType}</span>
                    <PriorityBadge priority={report.priority} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {report.locationName}
                    </span>
                    <span>Reported: {report.date}</span>
                    {report.assignedTeam && (
                      <span className="text-sky-700 font-medium">Team: {report.assignedTeam}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <StatusBadge status={report.status} />
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Professional Empty State */
          <div className="py-12 px-6 text-center space-y-4 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">You haven't uploaded any reports yet.</h3>
              <p className="text-xs text-slate-600 mt-1">
                Help protect our coast by sharing your first marine waste sighting.
              </p>
            </div>
            <Link
              to="/fisherman/report"
              className="inline-flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold px-4 py-2 rounded text-xs transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload First Report</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FishermanDashboard;
