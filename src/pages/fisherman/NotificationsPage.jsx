import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Clock, Shield, Ship, Check, ChevronRight } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const navigate = useNavigate();

  const handleOpenNotification = (n) => {
    markNotificationAsRead(n.id);
    if (n.reportId) {
      navigate(`/fisherman/reports/${n.reportId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Incident Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status updates on your submitted reports from coastal authorities and salvage teams
          </p>
        </div>

        {notifications && notifications.length > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded transition self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {notifications && notifications.length > 0 ? (
          notifications.map((n) => {
            const isUnread = !n.read;

            return (
              <div
                key={n.id}
                onClick={() => handleOpenNotification(n)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition hover:bg-slate-50/80 ${
                  isUnread ? 'bg-sky-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    n.type === 'assignment' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-sky-100 text-sky-700'
                  }`}>
                    {n.type === 'resolved' ? <CheckCircle2 className="w-4 h-4" /> :
                     n.type === 'assignment' ? <Ship className="w-4 h-4" /> :
                     <Shield className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                        {n.title}
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-sky-600 inline-block"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.timestamp}
                      </span>
                      {n.reportId && (
                        <span className="font-mono font-semibold text-sky-800 bg-slate-100 px-1.5 py-0.2 rounded">
                          {n.reportId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="self-center">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <span>No notifications at this time.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
