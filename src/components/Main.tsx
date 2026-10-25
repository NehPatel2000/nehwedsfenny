import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Send, Sparkles, ChevronDown } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import { MainDecorations } from './MainDecorations';
import { WeddingDetails } from '../types';
import confetti from 'canvas-confetti';

interface MainProps {
  details: WeddingDetails;
  onOpenRsvp: () => void;
}

export const Main: React.FC<MainProps> = ({ details, onOpenRsvp }) => {
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
      colors: ['#92916F', '#A52A3A', '#493A36', '#FBF7ED']
    });
  };

  return (
    <section id="main" className="relative flex min-h-svh items-center justify-center overflow-x-clip bg-[#FBF7ED] px-4 pb-24 pt-24 text-[#493A36] bg-editorial-grid sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
      <MainDecorations />

      {/* Editorial Frame Box with Gold Border */}
      <div className="relative z-10 mx-auto w-full max-w-3xl rounded-2xl border-2 border-[#92916F]/40 bg-[#FFFDF7]/90 p-6 text-center shadow-xl backdrop-blur-md sm:p-10 lg:p-12">
        
        {/* Corner Geometric Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#92916F]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#92916F]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#92916F]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#92916F]" />

        {/* Sacred Sanskrit Blessing Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A52A3A]/10 border border-[#A52A3A]/30 text-[#A52A3A] mb-6">
          <GaneshIcon className="w-4 h-4 text-[#A52A3A]" />
          <span className="font-serif-display text-xs sm:text-sm tracking-[0.25em] uppercase font-bold text-[#A52A3A]">
            || Shree Ganeshay Namah ||
          </span>
          <GaneshIcon className="w-4 h-4 text-[#A52A3A]" />
        </div>

        {/* Editorial Eyebrow */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-[1px] w-12 sm:w-20 bg-[#92916F]" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#A52A3A]">
            You&apos;re Invited
          </span>
          <div className="h-[1px] w-12 sm:w-20 bg-[#92916F]" />
        </div>

        {/* Couple Names Display */}
        <h1 className="mx-auto my-4 grid max-w-xl grid-cols-[1fr_auto_1fr] items-center font-serif-display text-5xl font-bold leading-none tracking-tight text-[#493A36] sm:text-7xl lg:text-8xl">
          <span className="justify-self-end">{details.groomName}</span>
          <span className="px-2 font-normal italic text-[#A52A3A] sm:px-4">&</span>
          <span className="justify-self-start">{details.brideName}</span>
        </h1>

        <div className="mx-auto mb-5 grid max-w-xl grid-cols-2 divide-x divide-[#92916F]/60 border-y border-[#92916F]/50 py-3 text-center text-xs font-medium leading-relaxed text-[#493A36] sm:text-sm">
          <p className="px-3 sm:px-5">
            Son of Ashokkumar and Nayanaben Patel
          </p>
          <p className="px-3 sm:px-5">
            Daughter of Rajeshkumar and Gitaben Patel
          </p>
        </div>

        {/* Date & Location Editorial Pill Cards */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4 text-[12px]">
          <div className="flex items-center gap-2 rounded-xl border border-[#493A36]/15 bg-[#FBF7ED] px-5 py-2.5 text-[#493A36] font-semibold uppercase tracking-wider text-[11.5px]">
            <Calendar className="w-4 h-4 text-[#A52A3A] shrink-0" />
            <span>{details.displayDateRange}</span>
          </div>

          <a
            href="https://www.google.com/maps/place/Bridlewood+of+Madison/@32.5683555,-90.17173,862m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8629c51690047989:0xac5b7cfebfbff463!8m2!3d32.5683555!4d-90.17173!16s%2Fg%2F11fxvfjkmq?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-[#493A36]/15 bg-[#FBF7ED] px-5 py-2.5 text-[11.5px] font-semibold uppercase tracking-wider text-[#493A36] transition-colors hover:bg-[#FBF7ED]"
          >
            <MapPin className="w-4 h-4 text-[#A52A3A] shrink-0" />
            <span>{details.primaryLocation}</span>
          </a>
        </div>

        {/* Editorial Countdown Clock */}
        <div className="mx-auto mb-9 max-w-md scale-90">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#92916F] sm:w-20" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A52A3A]">
              Count down
            </p>
            <div className="h-px w-12 bg-[#92916F] sm:w-20" />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-[#F4EBDD] text-[#493A36] border border-[#92916F]/40 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#A52A3A] block leading-none mb-1">
                {timeLeft.days}
              </span>
              <span className="text-[9px] text-[#675A53] uppercase tracking-[0.2em] font-medium block">Days</span>
            </div>
            <div className="bg-[#F4EBDD] text-[#493A36] border border-[#92916F]/40 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#A52A3A] block leading-none mb-1">
                {timeLeft.hours}
              </span>
              <span className="text-[9px] text-[#675A53] uppercase tracking-[0.2em] font-medium block">Hours</span>
            </div>
            <div className="bg-[#F4EBDD] text-[#493A36] border border-[#92916F]/40 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#A52A3A] block leading-none mb-1">
                {timeLeft.minutes}
              </span>
              <span className="text-[9px] text-[#675A53] uppercase tracking-[0.2em] font-medium block">Mins</span>
            </div>
            <div className="bg-[#F4EBDD] text-[#493A36] border border-[#92916F]/40 rounded-xl p-3 text-center shadow-sm">
              <span className="font-serif-display text-2xl sm:text-4xl font-bold text-[#A52A3A] block leading-none mb-1">
                {timeLeft.seconds}
              </span>
              <span className="text-[9px] text-[#675A53] uppercase tracking-[0.2em] font-medium block">Secs</span>
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-[0.2em] text-[#FBF7ED] bg-[#A52A3A] hover:bg-[#871F30] border border-[#92916F]/40 shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2.5"
          >
            <Send className="w-4 h-4" />
            <span>RSVP</span>
          </button>

          <a
            href="#schedule"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg font-semibold text-xs uppercase tracking-[0.2em] text-[#493A36] border border-[#493A36]/30 hover:bg-[#493A36]/5 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#A52A3A]" />
            <span>Explore Schedule</span>
          </a>
        </div>

      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#A52A3A] animate-bounce flex flex-col items-center gap-1">
        <span className="text-[9px] uppercase tracking-[0.25em] font-semibold">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
};
