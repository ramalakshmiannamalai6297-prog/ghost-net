import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const p = (priority || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  if (p === 'high') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
  } else if (p === 'medium') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (p === 'low') {
    styles = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded border ${styles}`}>
      {priority || 'Normal'}
    </span>
  );
};

export default PriorityBadge;
