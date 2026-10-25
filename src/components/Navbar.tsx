import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, BookOpen, Send, Settings, Menu, X, Sparkles } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import confetti from 'canvas-confetti';

interface NavbarProps {
  onOpenRsvp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRsvp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#92916F', '#A52A3A', '#493A36', '#FBF7ED']
    });
  };

  const handleRsvpClick = () => {
    triggerConfetti();
    onOpenRsvp();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBF7ED]/95 backdrop-blur-md shadow-sm border-b border-[#92916F]/30 py-3'
          : 'bg-[#FBF7ED]/80 backdrop-blur-sm border-b border-[#493A36]/10 py-4 text-[#493A36]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Couple Name */}
        <a href="#main" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-[#A52A3A] text-[#92916F] border border-[#92916F]/50 flex items-center justify-center shadow-sm group-hover:bg-[#871F30] transition-colors">
            <GaneshIcon className="w-5 h-5 text-[#92916F]" />
          </div>
          <div>
            <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#493A36] block leading-tight">
              Neh <span className="text-[#A52A3A] italic font-normal">&</span> Fenny
            </span>
          </div>
        </a>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center justify-end gap-5">
          <a
            href="#schedule"
            className="inline-flex items-center py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#493A36]/80 transition-colors hover:text-[#A52A3A]"
          >
            Schedule
          </a>
          <button
            onClick={handleRsvpClick}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.18em] text-[#FBF7ED] bg-[#A52A3A] hover:bg-[#871F30] border border-[#92916F]/40 shadow-sm transition-all transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-[#493A36] hover:bg-[#493A36]/5"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FBF7ED] border-b border-[#92916F]/30 px-5 pt-4 pb-6 space-y-3 shadow-xl">
          <a
            href="#schedule"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#493A36] border-b border-[#493A36]/10"
          >
            Schedule (Day 1 & 2)
          </a>
          
          <div className="pt-3 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleRsvpClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-[0.2em] text-[#FBF7ED] bg-[#A52A3A] shadow"
            >
              <Send className="w-4 h-4" />
              <span>RSVP</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
