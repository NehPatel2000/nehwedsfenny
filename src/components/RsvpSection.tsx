import React from 'react';
import { Heart } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';

export const RsvpSection: React.FC = () => (
  <section id="rsvp" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
    <div className="bg-[#F4EBDD] text-[#493A36] rounded-2xl p-8 sm:p-14 shadow-xl border border-[#92916F]/40 relative overflow-hidden text-center">
      <div className="absolute top-4 right-4 p-6 opacity-10 pointer-events-none text-[#92916F]">
        <GaneshIcon className="w-28 h-28 text-[#92916F]" />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBF7ED] border border-[#92916F]/30 text-[#8D293C] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
          <Heart className="w-3.5 h-3.5 text-[#A52A3A] fill-[#A52A3A]" />
          <span>Kindly Respond</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-bold tracking-tight">
          RSVP For The Wedding
        </h2>
        <p className="mt-4 text-[#675A53] text-sm leading-relaxed">
          Keep an eye out for your personal RSVP link, which will be shared with your invitation.
        </p>
      </div>
    </div>
  </section>
);
