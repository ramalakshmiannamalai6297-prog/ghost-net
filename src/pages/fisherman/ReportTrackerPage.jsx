import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserReports, useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LeafletMap from '../../components/common/LeafletMap';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  Camera, 
  Ship, 
  Recycle,
  FileQuestion
} from 'lucide-react';

export const ReportTrackerPage = () => {
  const { id } = useParams();
  const { reports, user } = useApp();
  const navigate = useNavigate();

  const report = getUserReports(reports, user).find((r) => r.id === id);

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Report Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested report could not be located in your registered incident database.
        </p>
        <Link 
          to="/fisherman/reports" 
          className="inline-flex items-center gap-1 bg-sky-700 hover:bg-sky-800 text-white font-semibold px-4 py-2 rounded text-xs transition shadow-xs"
        >
          Return to My Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={() => navigate('/fisherman/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Reports</span>
        </button>
      </div>

      {/* Main Report Header Card */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-sky-900">{report.id}</span>
              <PriorityBadge priority={report.priority} />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">{report.wasteType}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {report.locationName}
            </p>
          </div>

          <div className="self-start sm:self-center">
            <StatusBadge status={report.status} size="lg" />
          </div>
        </div>

        {/* 2-Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Left: Photos & Location */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">Submitted Photo Evidence</span>
              <div className="rounded overflow-hidden border border-slate-200 aspect-video bg-black shadow-xs">
                {report.beforeImage ? (
                  <img
                    src={report.beforeImage}
                    alt={report.wasteType}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    No photo uploaded
                  </div>
                )}
              </div>
            </div>

            {report.afterImage && (
              <div>
                <span className="text-xs font-semibold text-emerald-800 block mb-1.5">Cleanup Evidence (Resolved)</span>
                <div className="rounded overflow-hidden border border-emerald-300 aspect-video bg-black shadow-xs">
                  <img
                    src={report.afterImage}
                    alt="Resolved cleanup"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">Report Coordinates</span>
              <LeafletMap
                center={[report.latitude, report.longitude]}
                zoom={12}
                height="180px"
                reports={[report]}
                activeReportId={report.id}
                role="fisherman"
              />
            </div>
          </div>

          {/* Right: Technical Information & Real-time Timeline */}
          <div className="space-y-5 text-xs">
            <div className="bg-slate-50 rounded border border-slate-200 p-4 space-y-2">
              <h3 className="font-semibold text-slate-800 text-xs border-b border-slate-200 pb-1.5">
                Incident Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400">Reported Date:</span>
                  <div className="font-medium text-slate-800">{report.date} ({report.time || 'Logged'})</div>
                </div>
                <div>
                  <span className="text-slate-400">Classification Confidence:</span>
                  <div className="font-medium text-sky-700">{report.confidence}% (Vision Model)</div>
                </div>
                <div>
                  <span className="text-slate-400">Hazard Severity:</span>
                  <div className="font-medium text-slate-800">{report.severity}</div>
                </div>
                <div>
                  <span className="text-slate-400">Reporter:</span>
                  <div className="font-medium text-slate-800">{report.reporter}</div>
                </div>
              </div>

              {report.assignedTeam && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400">Assigned Cleanup Team:</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Ship className="w-3.5 h-3.5 text-sky-700" />
                    <span>{report.assignedTeam}</span>
                  </div>
                </div>
              )}

              {report.wasteHandling && (
                <div className="pt-2 border-t border-slate-200 text-emerald-800">
                  <span className="text-emerald-700 font-medium">Waste Handling & Recycling:</span>
                  <div className="font-semibold flex items-center gap-1.5 mt-0.5">
                    <Recycle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{report.wasteHandling} ({report.recoveredMaterial || 'Recovered Marine Polymers'})</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400">Description:</span>
                <p className="text-slate-700 mt-1 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Stepper Timeline for Fisherman */}
            <div className="bg-white rounded border border-slate-200 p-4 space-y-3">
              <h3 className="font-semibold text-slate-900 text-xs">
                Resolution Progress
              </h3>

              <div className="space-y-3 pl-2">
                {[
                  { key: 'Reported', label: 'Report Submitted', desc: 'Received by coastal portal' },
                  { key: 'Verified', label: 'Authority Verification', desc: 'Reviewed and priority confirmed' },
                  { key: 'Cleanup Assigned', label: 'Vessel Assigned', desc: report.assignedTeam ? `Assigned to ${report.assignedTeam}` : 'Scheduling cleanup craft' },
                  { key: 'Waste Removed', label: 'Waste Retrieved', desc: 'Ghost gear extracted from water' },
                  { key: 'Closed', label: 'Verification & Closure', desc: 'Recycling categorized and incident resolved' }
                ].map((item, idx) => {
                  const isDone = 
                    (item.key === 'Reported') ||
                    (item.key === 'Verified' && report.status !== 'REPORTED') ||
                    (item.key === 'Cleanup Assigned' && ['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED', 'WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status)) ||
                    (item.key === 'Waste Removed' && ['WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status)) ||
                    (item.key === 'Closed' && report.status === 'CLOSED');

                  return (
                    <div key={item.key} className="flex items-start gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isDone ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                        </div>
                        {idx < 4 && <div className={`w-0.5 h-6 mt-1 ${isDone ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                      </div>
                      <div className="pb-2">
                        <div className={`font-semibold text-xs ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTrackerPage;
