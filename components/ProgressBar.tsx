
import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className="w-full bg-black border-2 border-white h-8 overflow-hidden">
      <div 
        className="bg-white h-full transition-all duration-700 ease-out"
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
};
