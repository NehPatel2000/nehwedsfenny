import React from 'react';

interface GaneshIconProps {
  className?: string;
}

export const GaneshIcon: React.FC<GaneshIconProps> = ({ className = "w-5 h-5" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Crown / Mukut */}
    <path d="M10 4.5 C10 2.5 12 1.5 12 1.5 C12 1.5 14 2.5 14 4.5 L15 6 L9 6 Z" fill="currentColor" fillOpacity="0.25" />
    {/* Tilak Mark */}
    <path d="M11 7.5 H13 M12 6.5 V8.5" strokeWidth="1.2" />
    <circle cx="12" cy="5.5" r="0.75" fill="currentColor" />
    {/* Left & Right Ears */}
    <path d="M8.5 8 C5 7 3.5 10.5 5.5 12.5 C7 14 8.5 12.5 9 11" />
    <path d="M15.5 8 C19 7 20.5 10.5 18.5 12.5 C17 14 15.5 12.5 15 11" />
    {/* Trunk & Modak */}
    <path d="M12 9 C12 14 8.5 13.5 9.5 17.5 C10.2 20 13.5 20 14.5 17.5 C15 16 13.5 15 12 15" />
    <circle cx="15.5" cy="18" r="1" fill="currentColor" />
  </svg>
);
