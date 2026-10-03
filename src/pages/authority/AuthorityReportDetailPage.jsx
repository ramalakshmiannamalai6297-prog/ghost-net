import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LeafletMap from '../../components/common/LeafletMap';
import { CLEANUP_TEAMS } from '../../data/reports';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Ship, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Recycle, 
  FileCheck,
  FileQuestion,
  AlertCircle
} from 'lucide-react';

export const AuthorityReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    reports, 
    verifyReport, 
    setPriority, 
    assignCleanup, 
    dispatchCleanup, 
    markWasteRemoved, 
    submitWasteHandling, 
    verifyCleanup, 
    closeReport,
    showToast
  } = useApp();

  const report = reports.find((r) => r.id === id);

  // Form states for authority actions
  const [selectedPriority, setSelectedPriority] = useState(report?.priority || 'High');
  const [assignedTeam, setAssignedTeam] = useState('Coastal Cleanup Team A');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  });
  const [assignmentNotes, setAssignmentNotes] = useState('Requires shallow-draft salvage vessel and net hauling gear.');
  
  // Real Evidence image upload state (Requirement 23)
  const [beforeEvidence, setBeforeEvidence] = useState(report?.beforeImage || '');
  const [afterEvidence, setAfterEvidence] = useState(report?.afterImage || '');
  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  // Waste handling categorization (Requirement 24)
  const [wasteHandlingMethod, setWasteHandlingMethod] = useState(report?.wasteHandling || 'Recycled');
  const [recoveredMaterial, setRecoveredMaterial] = useState(report?.recoveredMaterial || 'Recovered Marine Nylon Monofilament');

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Report Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested incident record was not found in the coastal registry.
        </p>
        <Link 
          to="/authority/reports" 
          className="inline-flex items-center gap-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-2 rounded text-xs transition shadow-xs"
        >
          Return to Reports Directory
        </Link>
      </div>
    );
  }

  // Handle Before Evidence File Selection
  const handleBeforeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP)', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setBeforeEvidence(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle After Evidence File Selection
  const handleAfterFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP)', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAfterEvidence(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Action 1: Verify Report
  const handleVerify = () => {
    verifyReport(report.id);
  };

  // Action 2: Set Priority
  const handleSetPriority = (p) => {
    setSelectedPriority(p);
    setPriority(report.id, p);
  };

  // Action 3: Assign Cleanup Team
  const handleAssignCleanup = (e) => {
    e.preventDefault();
    assignCleanup(report.id, {
      team: assignedTeam,
      scheduledDate,
      notes: assignmentNotes
    });
  };

  // Action 4: Dispatch Team
  const handleDispatch = () => {
    dispatchCleanup(report.id);
  };

  // Action 5: Mark Waste Removed
  const handleMarkRemoved = () => {
    markWasteRemoved(report.id, {
      beforeImage: beforeEvidence || report.beforeImage,
      afterImage: afterEvidence
    });
  };

  // Action 6: Waste Handling Categorization
  const handleCategorize = () => {
    submitWasteHandling(report.id, {
      wasteHandling: wasteHandlingMethod,
      recoveredMaterial
    });
  };

  // Action 7: Final Verification
  const handleFinalVerify = () => {
    verifyCleanup(report.id);
  };

  // Action 8: Close Report
  const handleClose = () => {
    closeReport(report.id);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => navigate('/authority/reports')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports Directory</span>
        </button>
      </div>

      {/* Main Top Header Card */}
      <div className="bg-white rounded border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-2xl font-bold text-teal-900">{report.id}</span>
              <StatusBadge status={report.status} size="lg" />
              <PriorityBadge priority={report.priority} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{report.wasteType}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{report.locationName}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="font-mono text-[11px]">Lat: {report.latitude}, Lng: {report.longitude}</span>
            </p>
          </div>

          <div className="text-xs text-slate-500 space-y-1 sm:text-right">
            <div>Reported: <strong>{report.date}</strong> ({report.time || 'Logged'})</div>
            <div>Reporter: <strong>{report.reporter}</strong></div>
            <div>Hazard Severity: <strong className="text-rose-700">{report.severity}</strong></div>
          </div>
        </div>

        {/* 9-Stage Report Lifecycle */}
        <div>
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Incident Lifecycle Status
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center min-w-[780px] text-xs">
              {[
                { stage: 'REPORTED', label: 'Reported', active: true },
                { stage: 'VERIFIED', label: 'Verified', active: report.status !== 'REPORTED' },
                { stage: 'PRIORITIZED', label: 'Prioritized', active: report.status !== 'REPORTED' },
                { stage: 'CLEANUP ASSIGNED', label: 'Cleanup Assigned', active: ['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED', 'WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status) },
                { stage: 'CLEANUP DISPATCHED', label: 'Dispatched', active: ['CLEANUP DISPATCHED', 'WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status) },
                { stage: 'WASTE REMOVED', label: 'Waste Removed', active: ['WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status) },
                { stage: 'WASTE CATEGORIZED', label: 'Categorized', active: ['WASTE CATEGORIZED', 'CLOSED'].includes(report.status) },
                { stage: 'EVIDENCE UPLOADED', label: 'Evidence', active: ['WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status) },
                { stage: 'CLOSED', label: 'Closed', active: report.status === 'CLOSED' },
              ].map((step, idx) => (
                <React.Fragment key={step.stage}>
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.active ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}>
                      {step.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] mt-1.5 whitespace-nowrap font-medium ${
                      step.active ? 'text-slate-900 font-semibold' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < 8 && (
                    <div className={`h-0.5 flex-1 min-w-[24px] mx-1 ${
                      step.active ? 'bg-teal-600' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left = Details & Map, Right = Interactive Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Photos & Coordinates */}
        <div className="lg:col-span-6 space-y-6">
          {/* Photos Card */}
          <div className="bg-white rounded border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Incident Evidence Photos</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  1. Reported Marine Waste Photo
                </span>
                <div className="relative rounded overflow-hidden border border-slate-200 aspect-video bg-black shadow-xs">
                  {report.beforeImage ? (
                    <img
                      src={report.beforeImage}
                      alt="Reported Marine Waste"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Photo Available
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    Confidence: {report.confidence}%
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  2. Cleanup Verification Photo
                </span>
                <div className="relative rounded overflow-hidden border border-slate-200 aspect-video bg-black shadow-xs flex items-center justify-center">
                  {report.afterImage || afterEvidence ? (
                    <>
                      <img
                        src={report.afterImage || afterEvidence}
                        alt="After Cleanup Evidence"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-emerald-800 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        Verified Clean
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4 text-slate-400 text-xs">
                      <Camera className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      <span>Pending retrieval by salvage crew</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Incident Metadata */}
          <div className="bg-white rounded border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Field Description & Metadata</h3>
            
            <p className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700 leading-relaxed">
              "{report.description || 'No additional description provided.'}"
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-slate-600">
              <div>
                <span className="text-slate-400">Waste Category:</span>
                <div className="font-semibold text-slate-800">{report.category}</div>
              </div>
              <div>
                <span className="text-slate-400">Severity Assessment:</span>
                <div className="font-semibold text-rose-700">{report.severity}</div>
              </div>
              {report.assignedTeam && (
                <div>
                  <span className="text-slate-400">Assigned Salvage Team:</span>
                  <div className="font-semibold text-teal-800">{report.assignedTeam}</div>
                </div>
              )}
              {report.wasteHandling && (
                <div>
                  <span className="text-slate-400">Handling Disposal:</span>
                  <div className="font-semibold text-emerald-800">{report.wasteHandling} ({report.recoveredMaterial})</div>
                </div>
              )}
            </div>
          </div>

          {/* Leaflet Map */}
          <div className="bg-white rounded border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Geographic Location</h3>
            <LeafletMap
              center={[report.latitude, report.longitude]}
              zoom={12}
              height="220px"
              reports={[report]}
              activeReportId={report.id}
              role="authority"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Authority Workflow Actions (Requirements 20, 22, 23, 24, 25) */}
        <div className="lg:col-span-6 space-y-6">
          {/* ACTION 1: VERIFY REPORT & SET PRIORITY */}
          <div className={`bg-white rounded border p-6 shadow-xs space-y-4 transition ${
            report.status === 'REPORTED' ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">1</span>
                <span>Verification & Priority</span>
              </h3>
              {report.status !== 'REPORTED' && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              )}
            </div>

            {report.status === 'REPORTED' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review the report photograph and coordinates. Click below to verify the validity of this marine debris report.
                </p>
                <button
                  type="button"
                  onClick={handleVerify}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Report</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-3">
                <div className="text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Report verified by coastal maritime authority.</span>
                </div>

                {/* Priority Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Set Operational Priority:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleSetPriority(p)}
                        className={`py-1.5 px-3 rounded text-xs font-semibold border transition ${
                          report.priority === p
                            ? p === 'High' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                              p === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                              'bg-slate-200 text-slate-800 border-slate-400'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {p} Priority
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACTION 2: CLEANUP ASSIGNMENT & DISPATCH (Requirement 22) */}
          <div className={`bg-white rounded border p-6 shadow-xs space-y-4 transition ${
            report.status === 'VERIFIED' ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">2</span>
                <span>Cleanup Team Assignment</span>
              </h3>
              {['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED', 'WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status) && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Assigned
                </span>
              )}
            </div>

            {report.status === 'REPORTED' ? (
              <p className="text-xs text-slate-400 italic">
                Verify the report above before assigning a cleanup team.
              </p>
            ) : report.status === 'VERIFIED' ? (
              <form onSubmit={handleAssignCleanup} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Cleanup Team:
                  </label>
                  <select
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    {CLEANUP_TEAMS.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.vessel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Schedule Date:
                    </label>
                    <input
                      type="text"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Target Coordinates:
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${report.latitude}, ${report.longitude}`}
                      className="w-full p-2 border border-slate-300 rounded bg-slate-100 text-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    placeholder="Instructions for cleanup crew..."
                    className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Ship className="w-4 h-4" />
                  <span>Assign Cleanup</span>
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Assigned Team:</span>
                  <span className="font-bold text-slate-900">{report.assignedTeam}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Schedule Date:</span>
                  <span className="font-semibold text-slate-800">{report.scheduledDate || 'Scheduled'}</span>
                </div>

                {report.status === 'CLEANUP ASSIGNED' && (
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handleDispatch}
                      className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-1.5 px-3 rounded text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Ship className="w-3.5 h-3.5" />
                      <span>Mark Cleanup Dispatched</span>
                    </button>
                  </div>
                )}
                {report.status !== 'CLEANUP ASSIGNED' && (
                  <div className="text-cyan-800 font-medium flex items-center gap-1 pt-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Cleanup dispatched to incident coordinates.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACTION 3: WASTE REMOVAL & EVIDENCE UPLOAD (Requirement 23) */}
          <div className={`bg-white rounded border p-6 shadow-xs space-y-4 transition ${
            ['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED'].includes(report.status) ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">3</span>
                <span>Cleanup Evidence & Waste Removal</span>
              </h3>
              {['WASTE REMOVED', 'WASTE CATEGORIZED', 'CLOSED'].includes(report.status) && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Waste Removed
                </span>
              )}
            </div>

            {['REPORTED', 'VERIFIED'].includes(report.status) ? (
              <p className="text-xs text-slate-400 italic">
                Team assignment and vessel dispatch required prior to logging waste removal.
              </p>
            ) : ['CLEANUP ASSIGNED', 'CLEANUP DISPATCHED'].includes(report.status) ? (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Upload photographic evidence from the salvage crew and mark waste as removed.
                </p>

                {/* Real File Upload Controls for Before & After Images */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Before Cleanup Photo Upload */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <span className="font-semibold text-slate-700 block">Before Cleanup Photo:</span>
                    <div className="relative rounded overflow-hidden aspect-video bg-black">
                      {beforeEvidence || report.beforeImage ? (
                        <img src={beforeEvidence || report.beforeImage} alt="Before" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Photo</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => beforeInputRef.current?.click()}
                      className="w-full py-1 text-xs border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-700 font-medium transition"
                    >
                      Upload Before Photo
                    </button>
                    <input
                      ref={beforeInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/*"
                      onChange={handleBeforeFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* After Cleanup Photo Upload */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <span className="font-semibold text-slate-700 block">After Cleanup Photo:</span>
                    <div className="relative rounded overflow-hidden aspect-video bg-black">
                      {afterEvidence || report.afterImage ? (
                        <img src={afterEvidence || report.afterImage} alt="After" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Photo</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => afterInputRef.current?.click()}
                      className="w-full py-1 text-xs border border-slate-300 rounded bg-white hover:bg-slate-100 text-slate-700 font-medium transition"
                    >
                      Upload After Photo
                    </button>
                    <input
                      ref={afterInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/*"
                      onChange={handleAfterFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMarkRemoved}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-4 rounded text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Waste Removed</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Waste safely removed from water. Photographic evidence uploaded.</span>
              </div>
            )}
          </div>

          {/* ACTION 4: WASTE HANDLING & CATEGORIZATION (Requirement 24) */}
          <div className={`bg-white rounded border p-6 shadow-xs space-y-4 transition ${
            report.status === 'WASTE REMOVED' ? 'border-teal-600 ring-1 ring-teal-600' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">4</span>
                <span>Waste Handling</span>
              </h3>
              {['WASTE CATEGORIZED', 'CLOSED'].includes(report.status) && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Categorized
                </span>
              )}
            </div>

            {['REPORTED', 'VERIFIED', 'CLEANUP ASSIGNED', 'CLEANUP DISPATCHED'].includes(report.status) ? (
              <p className="text-xs text-slate-400 italic">
                Waste must be removed from water before handling classification.
              </p>
            ) : report.status === 'WASTE REMOVED' ? (
              <div className="space-y-4 text-xs">
                <label className="block font-semibold text-slate-700">
                  How was the waste handled?
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {['Recycled', 'Reused', 'Disposed'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setWasteHandlingMethod(method)}
                      className={`p-2.5 rounded border text-left font-medium transition ${
                        wasteHandlingMethod === method
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-slate-500 font-medium">Handling Details:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {wasteHandlingMethod === 'Recycled' ? 'Processed into recycled polymer pellets' :
                     wasteHandlingMethod === 'Reused' ? 'Repurposed for harbor barriers / fencing' :
                     'Disposed under coastal hazardous waste guidelines'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCategorize}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Recycle className="w-4 h-4" />
                  <span>Submit Waste Handling</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium">Handled: </span>
                  <strong className="text-slate-800">{report.wasteHandling}</strong>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {report.recoveredMaterial || 'Recovered Material'}
                </span>
              </div>
            )}
          </div>

          {/* ACTION 5: FINAL VERIFICATION & CLOSE REPORT (Requirement 25) */}
          <div className={`bg-white rounded border p-6 shadow-xs space-y-4 transition ${
            report.status === 'WASTE CATEGORIZED' ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">5</span>
                <span>Final Verification & Close</span>
              </h3>
              {report.status === 'CLOSED' && (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> CLOSED
                </span>
              )}
            </div>

            {report.status === 'CLOSED' ? (
              <div className="bg-emerald-50 border border-emerald-300 p-4 rounded text-xs text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Report closed in coastal registry.</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Cleanup operations verified by Port Authority. Status will remain closed across page refreshes.
                </p>
              </div>
            ) : report.status === 'WASTE CATEGORIZED' ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
                  <div className="font-semibold text-slate-800">Final Verification Review:</div>
                  <div className="text-slate-600">Incident: <strong>{report.id} ({report.wasteType})</strong></div>
                  <div className="text-slate-600">Location: <strong>{report.locationName}</strong></div>
                  <div className="text-slate-600">Cleanup Team: <strong>{report.assignedTeam}</strong></div>
                  <div className="text-slate-600">Date: <strong>{report.date}</strong></div>
                  <div className="text-slate-600">Waste Handling: <strong>{report.wasteHandling}</strong></div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleFinalVerify}
                    className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 px-3 rounded text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Verify Cleanup</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Close Report</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Follow steps 1 to 4 above to complete the salvage workflow and close this report.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityReportDetailPage;
