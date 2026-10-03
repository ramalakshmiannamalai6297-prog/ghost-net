import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Home, FileText, MapPin, Calendar, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReportSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const report = location.state?.report || {
    id: 'GN-20261001-001',
    wasteType: 'Fishing Net',
    locationName: 'Coastal Sector',
    status: 'REPORTED',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    description: 'Marine waste reported near coastal waters.',
    beforeImage: ''
  };

  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded border border-slate-200 p-8 sm:p-10 shadow-xs text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Headings */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Report Submitted Successfully
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your incident report has been securely registered in the coastal surveillance database.
          </p>
        </div>

        {/* Ticket Card with submitted information */}
        <div className="bg-slate-50 rounded border border-slate-200 p-5 text-left max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Report ID</div>
              <div className="font-mono text-xl font-bold text-sky-900">{report.id}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status</div>
              <span className="inline-block bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold px-2 py-0.5 rounded">
                Reported
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Waste Type:</span>
              <div className="font-semibold text-slate-800">{report.wasteType}</div>
            </div>
            <div>
              <span className="text-slate-400">Location:</span>
              <div className="font-semibold text-slate-800 truncate">{report.locationName}</div>
            </div>
            <div>
              <span className="text-slate-400">Date & Time:</span>
              <div className="font-semibold text-slate-800">{report.date} &bull; {report.time}</div>
            </div>
            <div>
              <span className="text-slate-400">Hazard Severity:</span>
              <div className="font-semibold text-slate-800">{report.severity || 'High'}</div>
            </div>
            {report.description && (
              <div className="col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-400">Description:</span>
                <div className="text-slate-700 mt-0.5 leading-relaxed">{report.description}</div>
              </div>
            )}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={`/fisherman/reports/${report.id}`}
            className="w-full sm:w-auto bg-sky-700 hover:bg-sky-800 text-white font-semibold px-5 py-2.5 rounded text-xs transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Track Report</span>
          </Link>

          <Link
            to="/fisherman/reports"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded text-xs border border-slate-300 transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>My Reports</span>
          </Link>

          <Link
            to="/fisherman"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded text-xs border border-slate-300 transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportSuccessPage;
