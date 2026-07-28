import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Send, Sparkles, ChevronDown } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import { WeddingDetails } from '../types';
import confetti from 'canvas-confetti';

interface HeroProps {
  details: WeddingDetails;
  onOpenRsvp: () => void;
}

export const Hero: React.FC<HeroProps> = ({ details, onOpenRsvp }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(details.weddingDateIso).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [details.weddingDateIso]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#990000', '#2D2424', '#FAF9F6']
    });
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] text-[#2D2424] overflow-hidden bg-editorial-grid">
      
      {/* Editorial Frame Box with Gold Border */}
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center border-2 border-[#D4AF37]/40 bg-white/80 backdrop-blur-md p-8 sm:p-14 md:p-16 shadow-xl rounded-2xl relative">
        
        {/* Corner Geometric Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]" />

        {/* Sacred Sanskrit Blessing Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#990000]/10 border border-[#990000]/30 text-[#990000] mb-6">
          <GaneshIcon className="w-4 h-4 text-[#990000]" />
          <span className="font-serif-display text-xs sm:text-sm tracking-[0.25em] uppercase font-bold text-[#990000]">
            || Shree Ganeshay Namah ||
          </span>
          <GaneshIcon className="w-4 h-4 text-[#990000]" />
        </div>

        {/* Editorial Eyebrow */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-[1px] w-12 sm:w-20 bg-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#990000]">
            The Wedding Celebration
          </span>
          <div className="h-[1px] w-12 sm:w-20 bg-[#D4AF37]" />
        </div>

        {/* Couple Names Display */}
        <h1 className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#2D2424] my-4 leading-none">
          {details.groomName} <span className="text-[#990000] font-normal italic font-serif-display">&</span> {details.brideName}
        </h1>

        <p className="font-sans-body text-stone-600 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed mb-8">
          {details.tagline}
        </p>

        {/* Date & Location Editorial Pill Cards */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs mb-10">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#2D2424]/15 text-[#2D2424] font-semibold uppercase tracking-wider text-[11px]">
            <Calendar className="w-4 h-4 text-[#990000] shrink-0" />
            <span>{details.displayDateRange}</span>
          </div>

          <a
            href="https://www.google.com/maps/place/Bridlewood+of+Madison"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#2D2424]/15 text-[#2D2424] font-semibold uppercase tracking-wider text-[11px] hover:bg-[#FFFDF8] transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#990000] shrink-0" />
            <span>{details.primaryLocation}</span>
          </a>
        </div>

        {/* Editorial Countdown Clock */}
        <div className="mb-10 max-w-md mx-auto">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#990000] font-bold mb-4">
            Counting Down To The Sacred Mandap
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-[#2D2424] text-[#FAF9F6] border border-[#D4AF37]/50 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#D4AF37] block leading-none mb-1">
                {timeLeft.days}
              </span>
              <span className="text-[9px] text-stone-300 uppercase tracking-[0.2em] font-medium block">Days</span>
            </div>
            <div className="bg-[#2D2424] text-[#FAF9F6] border border-[#D4AF37]/50 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#D4AF37] block leading-none mb-1">
                {timeLeft.hours}
              </span>
              <span className="text-[9px] text-stone-300 uppercase tracking-[0.2em] font-medium block">Hours</span>
            </div>
            <div className="bg-[#2D2424] text-[#FAF9F6] border border-[#D4AF37]/50 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#D4AF37] block leading-none mb-1">
                {timeLeft.minutes}
              </span>
              <span className="text-[9px] text-stone-300 uppercase tracking-[0.2em] font-medium block">Mins</span>
            </div>
            <div className="bg-[#2D2424] text-[#FAF9F6] border border-[#D4AF37]/50 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#D4AF37] block leading-none mb-1">
                {timeLeft.seconds}
              </span>
              <span className="text-[9px] text-stone-300 uppercase tracking-[0.2em] font-medium block">Secs</span>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              triggerConfetti();
              onOpenRsvp();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-[0.2em] text-[#FAF9F6] bg-[#990000] hover:bg-[#770000] border border-[#D4AF37]/40 shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2.5"
          >
            <Send className="w-4 h-4" />
            <span>RSVP via Google Sheet</span>
          </button>

          <a
            href="#schedule"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg font-semibold text-xs uppercase tracking-[0.2em] text-[#2D2424] border border-[#2D2424]/30 hover:bg-[#2D2424]/5 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#990000]" />
            <span>Explore 2-Day Schedule</span>
          </a>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#990000] animate-bounce flex flex-col items-center gap-1">
        <span className="text-[9px] uppercase tracking-[0.25em] font-semibold">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
};

