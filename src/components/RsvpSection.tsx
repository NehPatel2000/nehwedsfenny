import React from 'react';
import { Heart } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';

export const RsvpSection: React.FC = () => (
  <section id="rsvp" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <div className="bg-[#2D2424] text-[#FAF9F6] rounded-2xl p-8 sm:p-14 shadow-2xl border-2 border-[#D4AF37]/40 relative overflow-hidden text-center">
      <div className="absolute top-4 right-4 p-6 opacity-10 pointer-events-none text-[#D4AF37]">
        <GaneshIcon className="w-28 h-28 text-[#D4AF37]" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF9F6]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
          <Heart className="w-3.5 h-3.5 text-[#990000] fill-[#990000]" />
          <span>Kindly Respond</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-bold tracking-tight">
          RSVP For The Wedding
        </h2>
        <p className="mt-4 text-stone-300 text-sm leading-relaxed">
          Your invitation includes a private RSVP link for your family. Open that link to see your invited guests and choose who will attend each event.
        </p>
        <p className="mt-3 text-[#D4AF37] text-xs">
          Please RSVP by October 1st, 2026.
        </p>
      </div>
    </div>
  </section>
);
