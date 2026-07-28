import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, BookOpen, Send, Settings, Menu, X, Sparkles } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import confetti from 'canvas-confetti';

interface NavbarProps {
  onOpenRsvp: () => void;
  rsvpUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRsvp, rsvpUrl }) => {
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
      colors: ['#D4AF37', '#990000', '#2D2424', '#FAF9F6']
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
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/30 py-3'
          : 'bg-[#FAF9F6]/80 backdrop-blur-sm border-b border-[#2D2424]/10 py-4 text-[#2D2424]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Couple Name */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-[#990000] text-[#D4AF37] border border-[#D4AF37]/50 flex items-center justify-center shadow-sm group-hover:bg-[#770000] transition-colors">
            <GaneshIcon className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#2D2424] block leading-tight">
              Neh <span className="text-[#990000] italic font-normal">&</span> Fenny
            </span>
            <span className="block text-[9px] uppercase tracking-[0.25em] font-semibold text-[#990000]">
              Gujarati Indian Wedding
            </span>
          </div>
        </a>

        {/* Desktop Nav Links - Tracked Editorial Style */}
        <nav className="hidden md:flex items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2D2424]/80">
          <a
            href="#schedule"
            className="transition-colors hover:text-[#990000]"
          >
            Schedule
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-[#990000]"
          >
            Guest Info
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleRsvpClick}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.18em] text-[#FAF9F6] bg-[#990000] hover:bg-[#770000] border border-[#D4AF37]/40 shadow-sm transition-all transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-[#2D2424] hover:bg-[#2D2424]/5"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FAF9F6] border-b border-[#D4AF37]/30 px-5 pt-4 pb-6 space-y-3 shadow-xl">
          <a
            href="#schedule"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2D2424] border-b border-[#2D2424]/10"
          >
            Schedule (Day 1 & 2)
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2D2424] border-b border-[#2D2424]/10"
          >
            Guest FAQs
          </a>
          
          <div className="pt-3 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleRsvpClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-[0.2em] text-[#FAF9F6] bg-[#990000] shadow"
            >
              <Send className="w-4 h-4" />
              <span>RSVP via Google Sheet</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

