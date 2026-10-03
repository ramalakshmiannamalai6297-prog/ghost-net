import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { 
  Anchor, 
  Shield, 
  ArrowRight, 
  Camera, 
  Cpu, 
  CheckCircle, 
  Ship, 
  Compass, 
  Recycle, 
  Waves,
  MapPin,
  AlertTriangle
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;

    const animationFrame = requestAnimationFrame(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [location.hash]);

  return (
    <div className="space-y-16 py-10">
      {/* 1. PRIMARY ROLE SELECTION HERO (First Page Requirement) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />

        {/* TWO CLEAR ROLE CHOICES: FISHERMAN OR AUTHORITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* OPTION 1: FISHERMAN */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
                <Anchor className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 font-mono">
                  Role 01
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Fisherman
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Report marine waste, track your reports and receive updates.
              </p>

              <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GPS Incident Geolocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Multilingual Voice Description</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real-Time Cleanup Tracking</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/fisherman/login')}
              className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-3 px-5 rounded text-sm transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>Continue as Fisherman</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* OPTION 2: AUTHORITY */}
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 font-mono">
                  Role 02
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Authority
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Manage marine waste reports, coordinate cleanup and monitor coastal areas.
              </p>

              <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Coastal Surveillance Map & Hotspots</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Fleet Dispatch & Salvage Coordination</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Waste Categorization & Recovery Audit</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/authority/login')}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 px-5 rounded text-sm transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>Continue as Authority</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto scroll-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded border border-slate-200 p-8 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">How the Platform Works</h2>
            <p className="text-sm text-slate-600">
              An accountable lifecycle connecting fishing communities with maritime cleanup authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded p-4">
              <div className="text-xs font-mono font-bold text-sky-700 mb-1">01 Report</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Capture Incident</h4>
              <p className="text-xs text-slate-500">Fisherman snaps a photo and captures GPS coordinates at sea.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4">
              <div className="text-xs font-mono font-bold text-sky-700 mb-1">02 Classify</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Vision Analysis</h4>
              <p className="text-xs text-slate-500">Computer vision categorizes ghost nets, plastics, or marine debris.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4">
              <div className="text-xs font-mono font-bold text-sky-700 mb-1">03 Prioritize</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Verification</h4>
              <p className="text-xs text-slate-500">Authority verifies the report and assigns operational priority.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4">
              <div className="text-xs font-mono font-bold text-sky-700 mb-1">04 Clean</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Vessel Dispatch</h4>
              <p className="text-xs text-slate-500">Salvage craft retrieves waste and records photographic evidence.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4">
              <div className="text-xs font-mono font-bold text-sky-700 mb-1">05 Verify</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Closure & Recycle</h4>
              <p className="text-xs text-slate-500">Authority audits waste recycling and closes the incident ticket.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="threat-of-ghost-nets" className="max-w-7xl mx-auto scroll-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded border border-slate-200 p-8 sm:p-10 shadow-xs">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">The Threat of Derelict Fishing Gear</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every year, over 640,000 tonnes of commercial fishing gear is lost or abandoned at sea. These ghost nets continue trapping fish, sea turtles, and marine mammals indiscriminately for decades while endangering coastal vessels with propeller entanglements.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ghost Net Reporter creates an accountable bridge between local fishing communities—the primary observers on coastal waters—and maritime salvage authorities equipped with retrieval craft.
            </p>
          </div>

          <div className="bg-slate-50 rounded border border-slate-200 p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-200 pb-2">Platform Capabilities</h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant Geolocation:</strong> Browser GPS coordinates pinpoint exact coordinates at sea.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Closed-Loop Accountability:</strong> Incidents require before-and-after photographic verification before closure.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Circular Economy Tracking:</strong> Tracks whether recovered ghost gear was recycled, reused, or disposed.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Hotspot Mapping:</strong> Spatial cluster analysis identifies recurring accumulation zones along coastal corridors.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
