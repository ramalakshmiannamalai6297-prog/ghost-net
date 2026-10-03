import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';

// Public Pages
import LandingPage from './pages/LandingPage';
import FishermanLoginPage from './pages/fisherman/FishermanLoginPage';
import AuthorityLoginPage from './pages/authority/AuthorityLoginPage';

// Fisherman Pages
import FishermanDashboard from './pages/fisherman/FishermanDashboard';
import ReportWastePage from './pages/fisherman/ReportWastePage';
import ReportSuccessPage from './pages/fisherman/ReportSuccessPage';
import MyReportsPage from './pages/fisherman/MyReportsPage';
import ReportTrackerPage from './pages/fisherman/ReportTrackerPage';
import ProfilePage from './pages/fisherman/ProfilePage';

// Authority Pages
import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import AuthorityReportsPage from './pages/authority/AuthorityReportsPage';
import AuthorityReportDetailPage from './pages/authority/AuthorityReportDetailPage';
import AuthorityMapPage from './pages/authority/AuthorityMapPage';
import AuthorityHotspotsPage from './pages/authority/AuthorityHotspotsPage';
import AuthorityCleanupPage from './pages/authority/AuthorityCleanupPage';
import AuthorityAnalyticsPage from './pages/authority/AuthorityAnalyticsPage';
import AuthoritySettingsPage from './pages/authority/AuthoritySettingsPage';

export const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* 1. First Page: Role Selection */}
              <Route path="/" element={<LandingPage />} />

              {/* 2. Separate Logins */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/fisherman/login" element={<FishermanLoginPage />} />
              <Route path="/authority/login" element={<AuthorityLoginPage />} />

              {/* 3. Fisherman Area (Strictly Separated) */}
              <Route path="/fisherman" element={
                <ProtectedRoute allowedRole="fisherman">
                  <FishermanDashboard />
                </ProtectedRoute>
              } />
              <Route path="/fisherman/report" element={
                <ProtectedRoute allowedRole="fisherman">
                  <ReportWastePage />
                </ProtectedRoute>
              } />
              <Route path="/fisherman/report-success" element={
                <ProtectedRoute allowedRole="fisherman">
                  <ReportSuccessPage />
                </ProtectedRoute>
              } />
              <Route path="/fisherman/reports" element={
                <ProtectedRoute allowedRole="fisherman">
                  <MyReportsPage />
                </ProtectedRoute>
              } />
              <Route path="/fisherman/reports/:id" element={
                <ProtectedRoute allowedRole="fisherman">
                  <ReportTrackerPage />
                </ProtectedRoute>
              } />
              <Route path="/fisherman/profile" element={
                <ProtectedRoute allowedRole="fisherman">
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* 4. Authority Area (Strictly Separated) */}
              <Route path="/authority" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthorityDashboard />
                </ProtectedRoute>
              } />
              <Route path="/authority/reports" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthorityReportsPage />
                </ProtectedRoute>
              } />
              <Route path="/authority/reports/:id" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthorityReportDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/authority/map" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthorityMapPage />
                </ProtectedRoute>
              } />
              <Route path="/authority/hotspots" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthorityHotspotsPage />
                </ProtectedRoute>
              } />
              <Route path="/authority/cleanup" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthorityCleanupPage />
                </ProtectedRoute>
              } />
              <Route path="/authority/analytics" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthorityAnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="/authority/settings" element={
                <ProtectedRoute allowedRole="authority">
                  <AuthoritySettingsPage />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <Toast />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
