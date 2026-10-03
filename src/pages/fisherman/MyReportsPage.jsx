import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserReports, useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { Search, Plus, MapPin, Eye, Waves } from 'lucide-react';

export const MyReportsPage = () => {
  const { reports, user } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Only show reports owned by the active user.
  const userReports = getUserReports(reports, user);

  // Search & Status filtering
  const filteredReports = userReports.filter((r) => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'ACTIVE') return matchesSearch && r.status !== 'CLOSED';
    if (statusFilter === 'CLOSED') return matchesSearch && r.status === 'CLOSED';
    return matchesSearch && r.status.toUpperCase() === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track resolution status and cleanup updates for your submitted incidents
          </p>
        </div>
        <Link
          to="/fisherman/report"
          className="inline-flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold px-4 py-2 rounded text-xs transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report Marine Waste</span>
        </Link>
      </div>

      {userReports.length > 0 ? (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, waste type, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-600 bg-white"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
              {['ALL', 'ACTIVE', 'REPORTED', 'VERIFIED', 'CLOSED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs rounded font-medium transition ${
                    statusFilter === tab
                      ? 'bg-sky-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'ALL' ? 'All Reports' : tab === 'ACTIVE' ? 'In Progress' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Table / Card Container */}
          <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Report ID</th>
                    <th className="px-5 py-3">Waste Type</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5 font-mono font-bold text-sky-800">
                        {report.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {report.wasteType}
                      </td>
                      <td className="px-5 py-3.5 max-w-xs truncate text-slate-600">
                        {report.locationName}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {report.date}
                      </td>
                      <td className="px-5 py-3.5">
                        <PriorityBadge priority={report.priority} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/fisherman/reports/${report.id}`)}
                          className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-semibold bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => navigate(`/fisherman/reports/${report.id}`)}
                  className="p-4 space-y-2 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-800 text-sm">{report.id}</span>
                    <StatusBadge status={report.status} size="sm" />
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{report.wasteType}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{report.locationName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-400">{report.date}</span>
                    <PriorityBadge priority={report.priority} />
                  </div>
                </div>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No reports found matching your search and filter criteria.
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 rounded-xl border border-sky-100 p-12 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
            <Waves className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">You haven't uploaded any reports yet.</h3>
            <p className="text-xs text-slate-500 mt-1">
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
  );
};

export default MyReportsPage;
