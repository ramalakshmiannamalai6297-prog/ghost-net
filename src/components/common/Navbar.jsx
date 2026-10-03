import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Waves, 
  User, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  PlusCircle, 
  Shield, 
  Anchor
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthoritySection = location.pathname.startsWith('/authority');
  const isFishermanSection = location.pathname.startsWith('/fisherman');

  const handleLogout = () => {
    const isAuth = isAuthoritySection;
    logout();
    if (isAuth) {
      navigate('/authority/login');
    } else {
      navigate('/fisherman/login');
    }
  };

  const handleNavigation = (item, event) => {
    if (!item.path.startsWith('/#')) return;
    const targetId = item.path.slice(2);
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      event.preventDefault();
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. Authority Navigation Links (Completely Isolated from Fisherman)
  const authorityNavLinks = [
    { label: 'Dashboard', path: '/authority' },
    { label: 'Reports', path: '/authority/reports' },
    { label: 'Map & Hotspots', path: '/authority/map' },
    { label: 'Cleanup', path: '/authority/cleanup' },
    { label: 'Analytics', path: '/authority/analytics' },
    { label: 'Settings', path: '/authority/settings' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Threat of Ghost Nets', path: '/#threat-of-ghost-nets' },
  ];

  // 2. Fisherman Navigation Links (Completely Isolated from Authority)
  const fishermanNavLinks = [
    { label: 'Dashboard', path: '/fisherman' },
    { label: 'Report Waste', path: '/fisherman/report' },
    { label: 'My Reports', path: '/fisherman/reports' },
    { label: 'Profile', path: '/fisherman/profile' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Threat of Ghost Nets', path: '/#threat-of-ghost-nets' },
  ];

  // 3. Public Navigation Links (Welcome Page)
  const publicNavLinks = [
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Threat of Ghost Nets', path: '/#threat-of-ghost-nets' },
  ];

  const currentLinks = isAuthoritySection
    ? authorityNavLinks
    : isFishermanSection
    ? fishermanNavLinks
    : publicNavLinks;

  const homePath = isAuthoritySection ? '/authority' : isFishermanSection ? '/fisherman' : '/';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <Link to={homePath} className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded flex items-center justify-center text-white shadow-xs ${
              isAuthoritySection ? 'bg-teal-700' : 'bg-sky-700'
            }`}>
              {isAuthoritySection ? <Shield className="w-5 h-5" /> : <Waves className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-2">
                <span>Ghost Net Reporter</span>
                {isAuthoritySection && (
                  <span className="text-[10px] font-semibold uppercase bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200">
                    Authority
                  </span>
                )}
                {isFishermanSection && (
                  <span className="text-[10px] font-semibold uppercase bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200">
                    Fisherman
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isAuthoritySection
                  ? 'Maritime Waste Management & Surveillance'
                  : 'Report Marine Waste. Protect Our Oceans.'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto max-w-[52vw]">
            {currentLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(event) => handleNavigation(item, event)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition relative flex items-center gap-1.5 ${
                    isActive
                      ? isAuthoritySection
                        ? 'text-teal-800 bg-teal-50 border border-teal-200'
                        : 'text-sky-800 bg-sky-50 border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & User Status */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Report Waste Button for Fisherman */}
            {isFishermanSection && (
              <Link
                to="/fisherman/report"
                className="flex items-center gap-1.5 text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white px-3 py-1.5 rounded transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Waste</span>
              </Link>
            )}

            {/* If on Welcome page: show buttons to choose role */}
            {!isAuthoritySection && !isFishermanSection && (
              <div className="flex items-center gap-2">
                <Link
                  to="/fisherman/login"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded transition"
                >
                  <Anchor className="w-3.5 h-3.5 text-sky-700" />
                  <span>Fisherman</span>
                </Link>
                <Link
                  to="/authority/login"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-3 py-1.5 rounded transition shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Authority</span>
                </Link>
              </div>
            )}

            {/* Authenticated user */}
            {(isAuthoritySection || isFishermanSection) && (
              user?.role ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-800 leading-none">{user.name}</div>
                    <div className="text-[11px] text-slate-500 leading-none mt-0.5 truncate max-w-[140px]">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to={isAuthoritySection ? '/authority/login' : '/fisherman/login'}
                  className={`flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded transition shadow-xs ${
                    isAuthoritySection ? 'bg-teal-700 hover:bg-teal-800' : 'bg-sky-700 hover:bg-sky-800'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {currentLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={(event) => handleNavigation(item, event)}
              className="flex items-center justify-between px-3 py-2 rounded text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {user?.role ? (
              <>
                <span className="text-xs text-slate-600 truncate max-w-[200px]">{user.name}</span>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="text-xs text-rose-600 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to={isAuthoritySection ? '/authority/login' : isFishermanSection ? '/fisherman/login' : '/'}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-sky-700 font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
