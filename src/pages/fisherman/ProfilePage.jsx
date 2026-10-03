import React, { useState } from 'react';
import { getUserReports, useApp } from '../../context/AppContext';
import { User, Anchor, Award, Globe, Phone, MapPin, CheckCircle, Shield } from 'lucide-react';

export const ProfilePage = () => {
  const { user, reports } = useApp();
  const [language, setLanguage] = useState('English');

  const myReports = getUserReports(reports, user);
  const closedCount = myReports.filter(r => r.status === 'CLOSED').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 shrink-0">
            <Anchor className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 mb-1">
              Registered Marine Citizen Reporter
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user?.name || 'Registered Fisherman'}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          <span className="text-xs text-slate-400">Vessel / Harbor</span>
          <span className="font-mono font-bold text-slate-800 text-sm">{user?.vessel || 'Coastal Vessel'}</span>
        </div>
      </div>

      {/* Impact & Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Reports Logged</span>
            <Anchor className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{myReports.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Nets, plastics & marine debris</div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Successfully Retrieved</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{closedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Hazardous gear cleared from reef</div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Conservation Standing</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">Coastal Guardian</div>
          <div className="text-[11px] text-slate-400 mt-1">Active contributor in maritime district</div>
        </div>
      </div>

      {/* Preferences & Contact */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">App Preferences & Emergency</h2>
          <p className="text-xs text-slate-500 mt-0.5">Customize language and emergency dispatch coordinates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-700" />
              <span>Preferred Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
            </select>
            <p className="text-[11px] text-slate-400">
              Regional language support for speech recognition and report summaries.
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-sky-700" />
              <span>Marine Emergency Contact</span>
            </label>
            <input
              type="text"
              readOnly
              value="Indian Coast Guard MRCC: 1554"
              className="w-full p-2 border border-slate-300 rounded bg-slate-50 text-slate-700 font-mono"
            />
            <p className="text-[11px] text-slate-400">Direct distress coordination link for navigational hazards.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
