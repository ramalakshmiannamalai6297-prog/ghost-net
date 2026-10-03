import React from 'react';

export const StatusBadge = ({ status, size = 'normal' }) => {
  const s = (status || '').toUpperCase();
  
  let styles = 'bg-slate-100 text-slate-700 border-slate-300';
  let label = status;

  if (s === 'REPORTED') {
    styles = 'bg-amber-50 text-amber-800 border-amber-300';
    label = 'Reported';
  } else if (s === 'VERIFIED') {
    styles = 'bg-blue-50 text-blue-800 border-blue-300';
    label = 'Verified';
  } else if (s === 'CLEANUP ASSIGNED') {
    styles = 'bg-indigo-50 text-indigo-800 border-indigo-300';
    label = 'Cleanup Assigned';
  } else if (s === 'CLEANUP DISPATCHED') {
    styles = 'bg-cyan-50 text-cyan-800 border-cyan-300';
    label = 'Dispatched';
  } else if (s === 'WASTE REMOVED') {
    styles = 'bg-teal-50 text-teal-800 border-teal-300';
    label = 'Waste Removed';
  } else if (s === 'WASTE CATEGORIZED') {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    label = 'Categorized';
  } else if (s === 'CLOSED') {
    styles = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
    label = 'Closed';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg'
    ? 'text-sm px-3.5 py-1.5'
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded ${sizeClasses} ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        s === 'CLOSED' ? 'bg-emerald-600' :
        s === 'REPORTED' ? 'bg-amber-500' :
        s === 'VERIFIED' ? 'bg-blue-600' :
        'bg-current opacity-70'
      }`} />
      {label}
    </span>
  );
};

export default StatusBadge;
