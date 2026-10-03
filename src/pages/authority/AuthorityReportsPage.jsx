import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { Search, RotateCcw, ArrowUpRight, FolderOpen, ShieldCheck, CheckCircle } from 'lucide-react';

export const AuthorityReportsPage = () => {
  const { reports, verifyReport, setPriority } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filtered reports list
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      (r.locationName && r.locationName.toLowerCase().includes(search.toLowerCase())) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
      (r.wasteType && r.wasteType.toLowerCase().includes(search.toLowerCase()));

    const matchesWasteType =
      wasteTypeFilter === 'ALL' || (r.wasteType && r.wasteType.toLowerCase().includes(wasteTypeFilter.toLowerCase()));

    const matchesPriority =
      priorityFilter === 'ALL' || (r.priority && r.priority.toLowerCase() === priorityFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || (r.status && r.status.toUpperCase() === statusFilter.toUpperCase());

    return matchesSearch && matchesWasteType && matchesPriority && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearch('');
    setWasteTypeFilter('ALL');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Incident Reports Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter, verify, and coordinate salvage for marine waste reports across coastal sectors
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredReports.length}</strong> of <strong>{reports.length}</strong> total records
        </div>
      </div>

      {reports.length > 0 ? (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search box */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Report ID, location, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 bg-white text-slate-800"
                />
              </div>

              {/* Waste Type Filter */}
              <div>
                <select
                  value={wasteTypeFilter}
                  onChange={(e) => setWasteTypeFilter(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="ALL">All Waste Types</option>
                  <option value="Fishing Net">Fishing Net</option>
                  <option value="Plastic">Plastic Waste</option>
                  <option value="Other">Other Waste</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-1.5 px-3 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="REPORTED">Reported</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="CLEANUP ASSIGNED">Cleanup Assigned</option>
                  <option value="CLEANUP DISPATCHED">Dispatched</option>
                  <option value="WASTE REMOVED">Waste Removed</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <button
                  onClick={handleResetFilters}
                  title="Reset all filters"
                  className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-600 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Photo</th>
                    <th className="px-4 py-3">Report ID</th>
                    <th className="px-4 py-3">Waste Type</th>
                    <th className="px-4 py-3">Location & Coordinates</th>
                    <th className="px-4 py-3">Reported</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition">
                      {/* Photo Thumbnail */}
                      <td className="px-4 py-2.5">
                        <div className="w-12 h-9 rounded overflow-hidden border border-slate-200 bg-black shrink-0">
                          {report.beforeImage ? (
                            <img src={report.beforeImage} alt={report.wasteType} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">None</div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-teal-900 whitespace-nowrap">
                        {report.id}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-900">
                        {report.wasteType}
                      </td>

                      <td className="px-4 py-3 max-w-[200px]">
                        <div className="truncate font-medium text-slate-800">{report.locationName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {report.latitude}, {report.longitude}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        <div>{report.date}</div>
                        <div className="text-[11px] text-slate-400">{report.time}</div>
                      </td>

                      <td className="px-4 py-3 font-semibold text-teal-700">
                        {report.confidence}%
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          report.severity === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          report.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {report.severity || 'Medium'}
                        </span>
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

            {filteredReports.length === 0 && (
              <div className="p-10 text-center text-slate-500 text-xs">
                No incident reports match your current filter selections.
              </div>
            )}
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
            Reports submitted by registered users will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthorityReportsPage;
