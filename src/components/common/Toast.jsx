import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const icon = type === 'success' ? (
    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
  ) : type === 'warning' ? (
    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
  ) : (
    <Info className="w-4 h-4 text-sky-600 shrink-0" />
  );

  const border = type === 'success' 
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900' 
    : type === 'warning'
    ? 'border-amber-200 bg-amber-50 text-amber-900'
    : 'border-sky-200 bg-sky-50 text-sky-900';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded border shadow-sm text-xs font-medium ${border}`}>
        {icon}
        <span className="flex-1">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
