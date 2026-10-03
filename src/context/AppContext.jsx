import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REPORTS, INITIAL_NOTIFICATIONS } from '../data/reports';

const AppContext = createContext();

const STORAGE_KEY = 'ghostnet_reports_v3';
const USER_KEY = 'ghostnet_user_v3';
const NOTIFICATIONS_KEY = 'ghostnet_notifications_v3';
const OFFLINE_KEY = 'ghostnet_offline_queue_v3';
const ACCOUNTS_KEY = 'ghostnet_accounts_v1';

const hashPassword = async (password, salt) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: Uint8Array.from(atob(salt), character => character.charCodeAt(0)),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return Array.from(new Uint8Array(derivedBits), byte => byte.toString(16).padStart(2, '0')).join('');
};

export const getUserReports = (reports, user) => {
  if (!user) return [];

  return reports.filter(report => report.userId === user.id);
};

export const AppProvider = ({ children }) => {
  // Current user: null | { role: 'fisherman' | 'authority', email: string, name: string, ... }
  // Do NOT automatically log in; user must explicitly choose role and sign in or register
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (!savedUser) return null;

      const parsedUser = JSON.parse(savedUser);
      if (
        !parsedUser ||
        !['fisherman', 'authority'].includes(parsedUser.role) ||
        typeof parsedUser.email !== 'string'
      ) {
        return null;
      }
      const normalizedEmail = parsedUser.email.trim().toLowerCase();
      return {
        ...parsedUser,
        email: normalizedEmail,
        id: `${parsedUser.role}:${normalizedEmail}`,
        isNewUser: parsedUser.isNewUser === true
      };
    } catch (e) {
      console.error('Failed to load stored user', e);
      return null;
    }
  });
  const [accounts, setAccounts] = useState(() => {
    try {
      const savedAccounts = localStorage.getItem(ACCOUNTS_KEY);
      const parsedAccounts = savedAccounts ? JSON.parse(savedAccounts) : [];
      return Array.isArray(parsedAccounts)
        ? parsedAccounts.filter(account =>
            (account.role === 'fisherman' || account.role === 'authority') &&
            typeof account.email === 'string'
          )
        : [];
    } catch (e) {
      console.error('Failed to load stored accounts', e);
      return [];
    }
  });

  // Online / Offline connectivity state
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Reports collection
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load stored reports', e);
    }
    return INITIAL_REPORTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync reports to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports', e);
    }
  }, [reports]);

  // Sync user to local storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts', e);
    }
  }, [accounts]);

  // Sync notifications to local storage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }, [notifications]);

  // Network listener & auto-synchronization for offline reports
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Synchronize any reports saved offline
      try {
        const offlineQueue = localStorage.getItem(OFFLINE_KEY);
        if (offlineQueue) {
          const parsedQueue = JSON.parse(offlineQueue);
          if (Array.isArray(parsedQueue) && parsedQueue.length > 0) {
            setReports(prev => [...parsedQueue, ...prev]);
            localStorage.removeItem(OFFLINE_KEY);
            showToast(`Synchronized ${parsedQueue.length} offline report(s) successfully.`, 'success');
          }
        }
      } catch (e) {
        console.error('Failed to sync offline queue', e);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('You are currently offline. Reports will be saved locally and synced when connection returns.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message, type = 'info') => {
    const toastId = Date.now();
    setToastMessage({ message, type, id: toastId });
    setTimeout(() => {
      setToastMessage(prev => (prev?.id === toastId ? null : prev));
    }, 4000);
  };

  const activateUser = (role, email, name, extra = {}, isNewUser = false) => {
    const normalizedEmail = email.trim().toLowerCase();
    const newUser = {
      ...extra,
      role,
      id: `${role}:${normalizedEmail}`,
      email: normalizedEmail,
      name: name.trim() || (role === 'fisherman' ? 'Fisherman' : 'Maritime Officer'),
      isNewUser
    };
    setUser(newUser);
    showToast(`Signed in as ${newUser.name}`, 'success');
    return newUser;
  };

  const getAccount = (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    return accounts.find(account => account.email === normalizedEmail);
  };

  const authenticate = async (role, email, password) => {
    const account = getAccount(email);
    if (!account) {
      return { ok: false, error: 'No account was found for this email address. Please create an account first.' };
    }
    if (account.role !== role) {
      return {
        ok: false,
        error: role === 'fisherman'
          ? 'Access Denied: This account is registered as an Authority / Inspector. Please sign in through the Authority Portal.'
          : 'Access Denied: Restricted Official Portal. Fisherman accounts must sign in through the Fisherman Portal.'
      };
    }

    try {
      const passwordHash = await hashPassword(password, account.passwordSalt);
      if (passwordHash !== account.passwordHash) {
        return { ok: false, error: 'The email or password is incorrect.' };
      }
    } catch (error) {
      console.error('Failed to verify account credentials', error);
      return { ok: false, error: 'Unable to verify credentials. Please try again.' };
    }

    const authenticatedUser = activateUser(account.role, account.email, account.name, account.extra);
    return { ok: true, user: authenticatedUser };
  };

  const register = async (role, email, name, password, extra = {}) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingAccount = getAccount(normalizedEmail);
    if (existingAccount) {
      if (existingAccount.role !== role) {
        return {
          ok: false,
          error: role === 'fisherman'
            ? 'Access Denied: This account is registered as an Authority / Inspector. Please sign in through the Authority Portal.'
            : 'Access Denied: Restricted Official Portal. Fisherman accounts must sign in through the Fisherman Portal.'
        };
      }
      return { ok: false, error: 'An account with this email already exists. Please sign in instead.' };
    }

    try {
      const passwordSalt = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
      const passwordHash = await hashPassword(password, passwordSalt);
      const account = {
        role,
        email: normalizedEmail,
        name: name.trim(),
        extra,
        passwordSalt,
        passwordHash
      };
      setAccounts(previousAccounts => [...previousAccounts, account]);
      const registeredUser = activateUser(role, normalizedEmail, name, extra, role === 'fisherman');
      return { ok: true, user: registeredUser };
    } catch (error) {
      console.error('Failed to register account', error);
      return { ok: false, error: 'Unable to create the account. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  const addNotification = (title, message, reportId = '', type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      reportId,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Generate unique report ID in format GN-YYYYMMDD-XXX
  const generateUniqueReportId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const prefix = `GN-${year}${month}${day}`;

    // Count today's existing reports to create a sequential counter
    const todayCount = reports.filter(r => r.id && r.id.startsWith(prefix)).length;
    const seq = String(todayCount + 1).padStart(3, '0');
    return `${prefix}-${seq}`;
  };

  // Create a new report from fisherman flow
  const createReport = (reportData) => {
    const reportId = reportData.id || generateUniqueReportId();
    const now = new Date();
    const timestamp = now.toISOString();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newReport = {
      id: reportId,
      wasteType: reportData.wasteType || 'Fishing Net',
      category: reportData.category || 'Derelict Fishing Gear',
      confidence: reportData.confidence || 87,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      locationName: reportData.locationName || `Coordinates (${reportData.latitude}, ${reportData.longitude})`,
      reportedAt: timestamp,
      timestamp,
      date: dateStr,
      time: timeStr,
      description: reportData.description || '',
      severity: reportData.severity || 'High',
      priority: reportData.priority || (reportData.severity === 'High' ? 'High' : 'Medium'),
      status: 'REPORTED',
      userId: user?.id || `${user?.role || 'fisherman'}:${user?.email?.trim().toLowerCase() || ''}`,
      userName: user?.name || reportData.userName || reportData.reporter || 'Registered Fisherman',
      reporter: user?.name || reportData.reporter || 'Registered Fisherman',
      reporterEmail: user?.email || reportData.reporterEmail || '',
      reporterRole: 'Fisherman',
      assignedTeam: '',
      scheduledDate: '',
      notes: '',
      wasteHandling: '',
      recoveredMaterial: '',
      beforeImage: reportData.beforeImage || reportData.photoUrl || '',
      afterImage: '',
      timeline: [
        { step: 'Reported', timestamp: `${dateStr}, ${timeStr}`, active: true, done: true },
        { step: 'Classified', timestamp: `${dateStr}, ${timeStr}`, active: true, done: true },
        { step: 'Verified', timestamp: '', active: false, done: false },
        { step: 'Prioritized', timestamp: '', active: false, done: false },
        { step: 'Cleanup Assigned', timestamp: '', active: false, done: false },
        { step: 'Cleanup Dispatched', timestamp: '', active: false, done: false },
        { step: 'Waste Removed', timestamp: '', active: false, done: false },
        { step: 'Evidence Uploaded', timestamp: '', active: false, done: false },
        { step: 'Closed', timestamp: '', active: false, done: false }
      ]
    };

    setUser(currentUser => currentUser ? { ...currentUser, isNewUser: false } : currentUser);

    // If offline, save into offline queue
    if (!navigator.onLine) {
      try {
        const existingOffline = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
        existingOffline.unshift(newReport);
        localStorage.setItem(OFFLINE_KEY, JSON.stringify(existingOffline));
        showToast(`Report ${reportId} saved offline. It will synchronize once internet is restored.`, 'warning');
      } catch (err) {
        console.error('Failed to queue offline report', err);
      }
    } else {
      setReports(prev => [newReport, ...prev]);
      addNotification('Report Submitted', `Report ${reportId} has been registered and transmitted for verification.`, reportId, 'info');
      showToast(`Report ${reportId} submitted successfully.`, 'success');
    }

    return newReport;
  };

  // Authority Action 1: Verify Report
  const verifyReport = (reportId) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      const updatedTimeline = rep.timeline.map(t => {
        if (t.step === 'Verified') {
          return { ...t, active: true, done: true, timestamp: timeFormatted };
        }
        return t;
      });
      return {
        ...rep,
        status: 'VERIFIED',
        timeline: updatedTimeline
      };
    }));
    addNotification('Report Verified', `Report ${reportId} has been verified by the coastal maritime authority.`, reportId, 'info');
    showToast(`Report ${reportId} verified.`, 'success');
  };

  // Authority Action 2: Set Priority
  const setPriority = (reportId, priority) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      const updatedTimeline = rep.timeline.map(t => {
        if (t.step === 'Prioritized') {
          return { ...t, active: true, done: true, timestamp: timeFormatted };
        }
        return t;
      });
      return {
        ...rep,
        priority,
        status: rep.status === 'REPORTED' ? 'VERIFIED' : rep.status,
        timeline: updatedTimeline
      };
    }));
    showToast(`Priority updated to ${priority} for ${reportId}.`, 'info');
  };

  // Authority Action 3: Assign Cleanup Team
  const assignCleanup = (reportId, { team, scheduledDate, notes }) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      const updatedTimeline = rep.timeline.map(t => {
        if (t.step === 'Cleanup Assigned') {
          return { ...t, active: true, done: true, timestamp: dateFormatted };
        }
        return t;
      });
      return {
        ...rep,
        status: 'CLEANUP ASSIGNED',
        assignedTeam: team,
        scheduledDate: scheduledDate || 'Scheduled',
        notes: notes || '',
        timeline: updatedTimeline
      };
    }));
    addNotification('Cleanup Assigned', `${team} assigned to report ${reportId}.`, reportId, 'assignment');
    showToast(`Assigned ${team} to ${reportId}.`, 'success');
  };

  // Authority Action 4: Mark Cleanup Dispatched
  const dispatchCleanup = (reportId) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      const updatedTimeline = rep.timeline.map(t => {
        if (t.step === 'Cleanup Dispatched') {
          return { ...t, active: true, done: true, timestamp: timeFormatted };
        }
        return t;
      });
      return {
        ...rep,
        status: 'CLEANUP DISPATCHED',
        timeline: updatedTimeline
      };
    }));
    addNotification('Cleanup Dispatched', `Salvage craft dispatched for report ${reportId}.`, reportId, 'assignment');
    showToast(`Cleanup vessel dispatched for ${reportId}.`, 'info');
  };

  // Authority Action 5: Waste Removed + Before/After evidence
  const markWasteRemoved = (reportId, { beforeImage, afterImage }) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      const updatedTimeline = rep.timeline.map(t => {
        if (t.step === 'Waste Removed') {
          return { ...t, active: true, done: true, timestamp: timeFormatted };
        }
        if (t.step === 'Evidence Uploaded') {
          return { ...t, active: true, done: true, timestamp: timeFormatted };
        }
        return t;
      });
      return {
        ...rep,
        status: 'WASTE REMOVED',
        beforeImage: beforeImage || rep.beforeImage,
        afterImage: afterImage || rep.afterImage,
        timeline: updatedTimeline
      };
    }));
    addNotification('Waste Retrieved', `Marine waste for report ${reportId} has been extracted.`, reportId, 'resolved');
    showToast(`Waste marked as removed for ${reportId}. Evidence uploaded.`, 'success');
  };

  // Authority Action 6: Submit Waste Handling Categorization
  const submitWasteHandling = (reportId, { wasteHandling, recoveredMaterial }) => {
    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      return {
        ...rep,
        status: 'WASTE CATEGORIZED',
        wasteHandling: wasteHandling || 'Recycled',
        recoveredMaterial: recoveredMaterial || 'Recovered marine polymer'
      };
    }));
    showToast(`Waste handling recorded as ${wasteHandling} for ${reportId}.`, 'success');
  };

  // Authority Action 7: Verify Cleanup
  const verifyCleanup = (reportId) => {
    showToast(`Cleanup operations verified by Port Authority for ${reportId}.`, 'success');
  };

  // Authority Action 8: Close Report
  const closeReport = (reportId) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      const updatedTimeline = rep.timeline.map(t => {
        if (t.step === 'Closed') {
          return { ...t, active: true, done: true, timestamp: dateFormatted };
        }
        return t;
      });
      return {
        ...rep,
        status: 'CLOSED',
        timeline: updatedTimeline
      };
    }));
    addNotification('Incident Closed', `Report ${reportId} has been successfully resolved and closed.`, reportId, 'resolved');
    showToast(`Report ${reportId} has been closed.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isOnline,
        reports,
        notifications,
        toastMessage,
        authenticate,
        register,
        logout,
        createReport,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        verifyReport,
        setPriority,
        assignCleanup,
        dispatchCleanup,
        markWasteRemoved,
        submitWasteHandling,
        verifyCleanup,
        closeReport,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
