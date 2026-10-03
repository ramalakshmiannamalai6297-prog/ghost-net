import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import { CLEANUP_TEAMS } from '../../data/reports';
import { Ship, ArrowUpRight, FolderOpen } from 'lucide-react';

export const AuthorityCleanupPage = () => {
  const { reports } = useApp();
  const navigate = useNavigate();

  const [teamFilter, setTeamFilter] = useState('ALL');

  // Derive cleanup operations strictly from reports in system
  const cleanupOperations = reports
    .filter(r => r.assignedTeam || ['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED', 'WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(r.status))
    .map(r => ({
      cleanupId: `CL-${r.id.replace('GN-', '')}`,
      reportId: r.id,
      location: r.locationName,
      wasteType: r.wasteType,
      assignedTeam: r.assignedTeam || 'Coastal Cleanup Team A',
      date: r.scheduledDate || r.date,
      status: r.status === 'CLOSED' ? 'Completed' :
              r.status === 'WASTE REMOVED' || r.status === 'WASTE CATEGORIZED' ? 'Retrieved' :
              r.status === 'CLEANUP DISPATCHED' ? 'Dispatched' : 'Assigned'
    }));

  const filteredCleanups = cleanupOperations.filter(c => {
    return teamFilter === 'ALL' || c.assignedTeam === teamFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Salvage & Cleanup Operations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate coastal salvage craft, patrol vessels, and marine retrieval teams
          </p>
        </div>

        {/* Team Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Filter by Team:</label>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="p-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
          >
            <option value="ALL">All Active Teams</option>
            {CLEANUP_TEAMS.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLEANUP_TEAMS.map((team) => {
          const teamTasks = cleanupOperations.filter(c => c.assignedTeam === team.name);
          const activeTasks = teamTasks.filter(c => c.status !== 'Completed').length;

          return (
            <div key={team.id} className="bg-white rounded border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{team.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <div className="text-[11px] text-slate-500">Vessel: <strong>{team.vessel}</strong></div>
              <div className="text-[11px] text-slate-500">Contact: <strong>{team.contact}</strong></div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Active Tasks:</span>
                <span className="font-bold text-teal-800">{activeTasks} ongoing</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cleanup Tasks Table */}
      <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-900 text-sm">
          Active Cleanup Task Board
        </div>

        {cleanupOperations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-5 py-3">Cleanup ID</th>
                  <th className="px-5 py-3">Report ID</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Waste Type</th>
                  <th className="px-5 py-3">Assigned Team</th>
                  <th className="px-5 py-3">Schedule Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCleanups.map((task) => (
                  <tr key={task.cleanupId} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-teal-900">
                      {task.cleanupId}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-medium text-slate-700">
                      {task.reportId}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs truncate text-slate-600">
                      {task.location}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {task.wasteType}
                    </td>
                    <td className="px-5 py-3.5 text-slate-800 font-medium">
                      {task.assignedTeam}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {task.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        task.status === 'Dispatched' ? 'bg-cyan-100 text-cyan-800 border border-cyan-300' :
                        task.status === 'Retrieved' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                        'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/authority/reports/${task.reportId}`)}
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
            <h3 className="text-sm font-semibold text-slate-800">No cleanup operations assigned yet.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Reports assigned to salvage teams will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityCleanupPage;
