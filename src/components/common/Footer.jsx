import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Shield, Phone, Anchor } from 'lucide-react';

export const Footer = () => {
  const location = useLocation();
  const isAuthority = location.pathname.startsWith('/authority');
  const isFisherman = location.pathname.startsWith('/fisherman');

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${
                isAuthority ? 'bg-teal-700' : 'bg-sky-700'
              }`}>
                {isAuthority ? <Shield className="w-4 h-4" /> : <Waves className="w-4 h-4" />}
              </div>
              <span className="font-bold text-slate-900 text-lg">Ghost Net Reporter</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Dedicated marine conservation technology connecting coastal fishing communities with maritime salvage authorities to locate, retrieve, and recycle derelict fishing gear.
            </p>
            <div className="pt-1 text-xs text-slate-500 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-sky-700" />
              <span>Marine Emergency Assistance: <strong>1554</strong> (Coast Guard MRCC)</span>
            </div>
          </div>

          {/* Quick Links Section - Strictly Separated */}
          {isFisherman && (
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Fisherman Portal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/fisherman" className="hover:text-sky-700 transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/fisherman/report" className="hover:text-sky-700 transition">
                    Report Marine Waste
                  </Link>
                </li>
                <li>
                  <Link to="/fisherman/reports" className="hover:text-sky-700 transition">
                    My Reports
                  </Link>
                </li>
                <li>
                  <Link to="/fisherman/profile" className="hover:text-sky-700 transition">
                    Vessel Profile
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {isAuthority && (
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Maritime Authority</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/authority" className="hover:text-teal-700 transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/authority/reports" className="hover:text-teal-700 transition">
                    Incident Reports
                  </Link>
                </li>
                <li>
                  <Link to="/authority/map" className="hover:text-teal-700 transition">
                    Map & Hotspots
                  </Link>
                </li>
                <li>
                  <Link to="/authority/cleanup" className="hover:text-teal-700 transition">
                    Cleanup Operations
                  </Link>
                </li>
                <li>
                  <Link to="/authority/analytics" className="hover:text-teal-700 transition">
                    Waste Recovery Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/authority/settings" className="hover:text-teal-700 transition">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {!isFisherman && !isAuthority && (
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Access Portals</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/fisherman/login" className="hover:text-sky-700 transition">
                    Fisherman Portal
                  </Link>
                </li>
                <li>
                  <Link to="/authority/login" className="hover:text-teal-700 transition">
                    Maritime Authority Portal
                  </Link>
                </li>
                <li>
                  <Link to="/#how-it-works" className="hover:text-slate-900 transition">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/#threat-of-ghost-nets" className="hover:text-slate-900 transition">
                    Threat of Derelict Fishing Gear
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Operational Guidelines & Safety */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-3">Maritime Guidelines</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When encountering submerged ghost gear, avoid close approach with propeller craft. Record accurate GPS coordinates and upload clear photographic evidence to coordinate safe diver salvage operations.
            </p>
            <div className="mt-3 text-[11px] text-slate-400">
              Coastal Maritime Debris Reporting Framework &bull; Marine Life Protection Act
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} Ghost Net Reporter. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>National Marine Litter Policy Framework</span>
            <span>&bull;</span>
            <span>Coastal Surveillance & Port Operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
