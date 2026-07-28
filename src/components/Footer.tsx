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
    <footer className="bg-[#2D2424] text-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 border-t-2 border-[#D4AF37]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Sanskrit Blessing Header */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-[#FAF9F6]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px]">
          <GaneshIcon className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-serif-display font-bold uppercase tracking-[0.25em]">
            || Shree Ganeshay Namah ||
          </span>
          <GaneshIcon className="w-4 h-4 text-[#D4AF37]" />
        </div>

        {/* Couple Names */}
        <div className="space-y-2">
          <h3 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#FAF9F6] tracking-tight">
            {details.groomName} & {details.brideName}
          </h3>
          <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold">
            {details.displayDateRange} • {details.primaryLocation}
          </p>
        </div>

        {/* Quick Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-stone-300 font-medium uppercase tracking-wider">
          <a href="#schedule" className="hover:text-[#D4AF37] transition-colors">
            Schedule (Day 1 & Day 2)
          </a>
          <span className="text-[#D4AF37]">•</span>
          <button onClick={onOpenRsvp} className="hover:text-[#D4AF37] transition-colors underline decoration-[#990000] underline-offset-4 font-bold text-[#FAF9F6]">
            RSVP (Google Sheet)
          </button>
        </div>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto my-4" />

        <p className="text-stone-400 text-xs font-light max-w-md mx-auto leading-relaxed">
          We look forward to celebrating this sacred milestone with our loved ones. With heart and gratitude, Neh & Fenny.
        </p>
      </div>
    </footer>
  );
};

