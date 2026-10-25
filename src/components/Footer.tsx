import React from 'react';
import { Heart, Send, Github, Sparkles } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import { WeddingDetails } from '../types';

interface FooterProps {
  details: WeddingDetails;
  onOpenRsvp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ details, onOpenRsvp }) => {
  return (
    <footer className="bg-[#F4EBDD] text-[#493A36] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#92916F]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Sanskrit Blessing Header */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-[#FBF7ED] border border-[#92916F]/40 text-[#8D293C] text-[10px]">
          <GaneshIcon className="w-4 h-4 text-[#92916F]" />
          <span className="font-serif-display font-bold uppercase tracking-[0.25em]">
            || Shree Ganeshay Namah ||
          </span>
          <GaneshIcon className="w-4 h-4 text-[#92916F]" />
        </div>

        {/* Couple Names */}
        <div className="space-y-2">
          <h3 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#493A36] tracking-tight">
            {details.groomName} & {details.brideName}
          </h3>
          <p className="text-[#92916F] text-[10px] uppercase tracking-[0.25em] font-bold">
            {details.displayDateRange} • {details.primaryLocation}
          </p>
        </div>

        {/* Quick Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#675A53] font-medium uppercase tracking-wider">
          <a href="#schedule" className="hover:text-[#92916F] transition-colors">
            Schedule (Day 1 & Day 2)
          </a>
          <span className="text-[#92916F]">•</span>
          <button onClick={onOpenRsvp} className="hover:text-[#A52A3A] transition-colors underline decoration-[#A52A3A] underline-offset-4 font-bold text-[#493A36]">
            RSVP
          </button>
        </div>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#92916F]/50 to-transparent mx-auto my-4" />

        <p className="text-[#675A53] text-xs font-light max-w-md mx-auto leading-relaxed">
          We look forward to celebrating this sacred milestone with our loved ones. With heart and gratitude, Neh & Fenny.
        </p>
      </div>
    </footer>
  );
};
