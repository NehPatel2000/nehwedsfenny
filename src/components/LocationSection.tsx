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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#990000]/10 border border-[#990000]/30 text-[#990000] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Venues & Accommodations</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#2D2424] tracking-tight">
          Location & Travel Details
        </h2>
        <p className="mt-3 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          Both venue locations are located in San Jose, California with ample valet, parking, and nearby hotel room blocks.
        </p>
      </div>

      {/* Venue Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Day 1 Venue Card */}
        <div className="bg-white rounded-2xl p-7 sm:p-10 shadow-xs border border-[#2D2424]/10 hover:shadow-md hover:border-[#D4AF37] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="bg-[#FAF9F6] text-[#2D2424] border border-[#2D2424]/15 font-bold text-[10px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-md">
                Day 1 Venue (Grah Shanti & Pithi & Garba)
              </span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>

            <h3 className="font-serif-display text-3xl font-bold text-[#2D2424] mb-1">
              {venues.day1.name}
            </h3>

            <p className="flex items-center gap-2 text-stone-600 text-xs sm:text-sm mb-4 font-semibold">
              <MapPin className="w-4 h-4 text-[#990000] shrink-0" />
              <span>{venues.day1.address}, {venues.day1.city}</span>
            </p>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              {venues.day1.description}
            </p>

            {/* Parking & Hotel Pills */}
            <div className="space-y-3 mb-6 text-xs text-stone-700 font-light">
              <div className="flex items-start gap-3 bg-[#FAF9F6] p-3.5 rounded-xl border border-[#2D2424]/10">
                <Car className="w-4 h-4 text-[#990000] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2D2424] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Parking Info:</strong>
                  <span className="text-stone-600">{venues.day1.parkingInfo}</span>
                </div>
              </div>

              {venues.day1.hotelInfo && (
                <div className="flex items-start gap-3 bg-[#FAF9F6] p-3.5 rounded-xl border border-[#2D2424]/10">
                  <Hotel className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2D2424] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Hotel Block:</strong>
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
            className="w-full py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-[0.18em] text-[#2D2424] bg-[#FAF9F6] hover:bg-[#2D2424] hover:text-[#FAF9F6] border border-[#2D2424]/20 transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-[#990000]" />
            <span>Day 1 Google Maps Directions</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Day 2 Venue Card */}
        <div className="bg-white rounded-2xl p-7 sm:p-10 shadow-xs border border-[#2D2424]/10 hover:shadow-md hover:border-[#D4AF37] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="bg-[#990000]/10 text-[#990000] border border-[#990000]/20 font-bold text-[10px] uppercase tracking-[0.2em] px-3.5 py-1 rounded-md">
                Day 2 Venue (Wedding & Reception)
              </span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>

            <h3 className="font-serif-display text-3xl font-bold text-[#2D2424] mb-1">
              {venues.day2.name}
            </h3>

            <p className="flex items-center gap-2 text-stone-600 text-xs sm:text-sm mb-4 font-semibold">
              <MapPin className="w-4 h-4 text-[#990000] shrink-0" />
              <span>{venues.day2.address}, {venues.day2.city}</span>
            </p>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
              {venues.day2.description}
            </p>

            {/* Parking & Hotel Pills */}
            <div className="space-y-3 mb-6 text-xs text-stone-700 font-light">
              <div className="flex items-start gap-3 bg-[#FAF9F6] p-3.5 rounded-xl border border-[#2D2424]/10">
                <Car className="w-4 h-4 text-[#990000] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2D2424] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Parking Info:</strong>
                  <span className="text-stone-600">{venues.day2.parkingInfo}</span>
                </div>
              </div>

              {venues.day2.hotelInfo && (
                <div className="flex items-start gap-3 bg-[#FAF9F6] p-3.5 rounded-xl border border-[#2D2424]/10">
                  <Hotel className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#2D2424] font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">Shuttle & Hotel:</strong>
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
            className="w-full py-3 px-5 rounded-lg font-bold text-xs uppercase tracking-[0.18em] text-[#FAF9F6] bg-[#990000] hover:bg-[#770000] border border-[#D4AF37]/40 shadow-xs transition-all flex items-center justify-center gap-2"
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

