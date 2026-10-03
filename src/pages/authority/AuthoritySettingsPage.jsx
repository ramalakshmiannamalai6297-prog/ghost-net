import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Download, Database, Cpu, Shield, Globe, CheckCircle, Bell } from 'lucide-react';

export const AuthoritySettingsPage = () => {
  const { reports, showToast } = useApp();
  const [modelConfidenceThreshold, setModelConfidenceThreshold] = useState(75);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ghostnet_incident_registry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported incident registry as JSON successfully', 'success');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('System configuration saved successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">System Configuration & Administrative Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Surveillance operational thresholds, registry exports, and notification routing
        </p>
      </div>

      {/* Incident Registry Export */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-700" />
              <span>Incident Registry Data Management</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Export archived coastal incident records for maritime analysis and environmental reports
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-4 py-2 rounded text-xs transition shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry (JSON)</span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Currently tracking <strong>{reports.length} registered incident tickets</strong> across coastal sectors.
        </div>
      </div>

      {/* Surveillance & Dispatch Parameters */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-700" />
            <span>Computer Vision & Classification Thresholds</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational sensitivity for automated marine debris classification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 bg-slate-50 p-4 rounded border border-slate-200">
            <label className="font-semibold text-slate-700">Minimum Model Confidence Threshold ({modelConfidenceThreshold}%)</label>
            <input
              type="range"
              min="50"
              max="95"
              value={modelConfidenceThreshold}
              onChange={(e) => setModelConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-sky-700"
            />
            <p className="text-[11px] text-slate-400">
              Reports falling below this threshold will be flagged for secondary visual review by coastal inspectors.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
            <label className="font-semibold text-slate-700 block">Salvage Alert Notifications</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-sky-700 border-slate-300 focus:ring-sky-600"
                />
                <span>Email alerts for High Priority propeller hazards</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-sky-700 border-slate-300 focus:ring-sky-600"
                />
                <span>SMS dispatch notification to standby salvage vessels</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-4 py-2 rounded text-xs transition shadow-xs"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthoritySettingsPage;
