import React from 'react';
import { MapPin, Navigation, Car, Hotel, ExternalLink, Sparkles } from 'lucide-react';
import { VenueInfo } from '../types';

interface LocationSectionProps {
  venues: { day1: VenueInfo; day2: VenueInfo };
}

export const LocationSection: React.FC<LocationSectionProps> = ({ venues }) => {
  return (
    <section id="locations" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A52A3A]/10 border border-[#A52A3A]/30 text-[#A52A3A] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#92916F]" />
          <span>Venues & Accommodations</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#493A36] tracking-tight">
          Location & Travel Details
        </h2>
        <p className="mt-3 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          Both venue locations are located in San Jose, California with ample valet, parking, and nearby hotel room blocks.
        </p>
      </div>

      {/* Venue Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Day 1 Venue Card */}
        <div className="bg-[#FFFDF7] rounded-2xl p-7 sm:p-10 shadow-xs border border-[#493A36]/10 hover:shadow-md hover:border-[#92916F] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="bg-[#FBF7ED] text-[#493A36] border border-[#493A36]/15 font-bold text-[10px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-md">
                Day 1 Venue
              </span>
              <Sparkles className="w-4 h-4 text-[#92916F]" />
            </div>

            <h3 className="font-serif-display text-3xl font-bold text-[#493A36] mb-1">
              {venues.day1.name}
            </h3>

            <p className="flex items-center gap-2 text-stone-600 text-xs sm:text-sm mb-4 font-semibold">
              <MapPin className="w-4 h-4 text-[#A52A3A] shrink-0" />
              <span>{venues.day1.address}, {venues.day1.city}</span>
            </p>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              {venues.day1.description}
            </p>

            {/* Parking & Hotel Pills */}
            <div className="space-y-3 mb-6 text-xs text-stone-700 font-light">
              <div className="flex items-start gap-3 bg-[#FBF7ED] p-3.5 rounded-xl border border-[#493A36]/10">
                <Car className="w-4 h-4 text-[#A52A3A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#493A36] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Parking Info:</strong>
                  <span className="text-stone-600">{venues.day1.parkingInfo}</span>
                </div>
              </div>

              {venues.day1.hotelInfo && (
                <div className="flex items-start gap-3 bg-[#FBF7ED] p-3.5 rounded-xl border border-[#493A36]/10">
                  <Hotel className="w-4 h-4 text-[#92916F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#493A36] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Hotel Block:</strong>
                    <span className="text-stone-600">{venues.day1.hotelInfo}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <a
            href={venues.day1.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-[0.18em] text-[#493A36] bg-[#FBF7ED] hover:bg-[#493A36] hover:text-[#FBF7ED] border border-[#493A36]/20 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-[#A52A3A]" />
            <span>Day 1 Google Maps Directions</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Day 2 Venue Card */}
        <div className="bg-[#FFFDF7] rounded-2xl p-7 sm:p-10 shadow-xs border border-[#493A36]/10 hover:shadow-md hover:border-[#92916F] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="bg-[#A52A3A]/10 text-[#A52A3A] border border-[#A52A3A]/20 font-bold text-[10px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-md">
                Day 2 Venue
              </span>
              <Sparkles className="w-4 h-4 text-[#92916F]" />
            </div>

            <h3 className="font-serif-display text-3xl font-bold text-[#493A36] mb-1">
              {venues.day2.name}
            </h3>

            <p className="flex items-center gap-2 text-stone-600 text-xs sm:text-sm mb-4 font-semibold">
              <MapPin className="w-4 h-4 text-[#A52A3A] shrink-0" />
              <span>{venues.day2.address}, {venues.day2.city}</span>
            </p>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              {venues.day2.description}
            </p>

            {/* Parking & Hotel Pills */}
            <div className="space-y-3 mb-6 text-xs text-stone-700 font-light">
              <div className="flex items-start gap-3 bg-[#FBF7ED] p-3.5 rounded-xl border border-[#493A36]/10">
                <Car className="w-4 h-4 text-[#A52A3A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#493A36] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Parking Info:</strong>
                  <span className="text-stone-600">{venues.day2.parkingInfo}</span>
                </div>
              </div>

              {venues.day2.hotelInfo && (
                <div className="flex items-start gap-3 bg-[#FBF7ED] p-3.5 rounded-xl border border-[#493A36]/10">
                  <Hotel className="w-4 h-4 text-[#92916F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#493A36] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Shuttle & Hotel:</strong>
                    <span className="text-stone-600">{venues.day2.hotelInfo}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <a
            href={venues.day2.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-[0.18em] text-[#FBF7ED] bg-[#A52A3A] hover:bg-[#871F30] border border-[#92916F]/40 shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Day 2 Google Maps Directions</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

      </div>
    </section>
  );
};
