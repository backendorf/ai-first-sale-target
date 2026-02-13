
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, className = "" }) => {
  // We use transition for a smoother feel if the layout shifts
  return (
    <div className={`p-6 border-2 border-white bg-black flex flex-col justify-between transition-colors duration-200 ${className}`}>
      <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">{label}</span>
      <div>
        <div className="text-4xl font-extrabold tabular-nums leading-tight">{value}</div>
        {subValue && <div className="text-sm mt-1 opacity-50 italic">{subValue}</div>}
      </div>
    </div>
  );
};
