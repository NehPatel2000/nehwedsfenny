import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Sparkles, Sun, Utensils, Music, Flame, Heart, GlassWater, Download, ExternalLink, Check } from 'lucide-react';
import { DaySchedule, ScheduleItem } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface ScheduleSectionProps {
  schedules: DaySchedule[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules }) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const currentSchedule = schedules.find((s) => s.dayNumber === activeDay) || schedules[0];

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-[#990000]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#D4AF37]" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-[#2D2424]" />;
      case 'Music': return <Music className="w-4 h-4 text-[#990000]" />;
      case 'Flame': return <Flame className="w-4 h-4 text-[#D4AF37]" />;
      case 'Heart': return <Heart className="w-4 h-4 text-[#990000]" />;
      case 'GlassWater': return <GlassWater className="w-4 h-4 text-[#2D2424]" />;
      default: return <CalendarIcon className="w-4 h-4 text-[#990000]" />;
    }
  };

  const handleAddToGoogleCalendar = (event: ScheduleItem, dateStr: string) => {
    const baseDate = activeDay === 1 ? '2026-11-14' : '2026-11-15';
    const startDateIso = `${baseDate}T09:00:00`;
    const endDateIso = `${baseDate}T13:00:00`;

    const url = generateGoogleCalendarUrl(
      `Priya & Rohan Wedding - ${event.title}`,
      `${event.description}\n\nDress Code: ${event.dressCode || 'Traditional Indian'}`,
      event.location,
      startDateIso,
      endDateIso
    );

    window.open(url, '_blank');
  };

  const handleDownloadIcs = (event: ScheduleItem) => {
    const baseDate = activeDay === 1 ? '2026-11-14' : '2026-11-15';
    const startDateIso = `${baseDate}T09:00:00`;
    const endDateIso = `${baseDate}T13:00:00`;

    downloadIcsFile(
      `Wedding_${event.title.replace(/[^a-zA-Z0-9]/g, '_')}`,
      `Priya & Rohan Wedding - ${event.title}`,
      `${event.description}\n\nDress Code: ${event.dressCode || 'Traditional Indian'}`,
      event.location,
      startDateIso,
      endDateIso
    );

    setDownloadSuccessId(event.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <section id="schedule" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#990000]/10 border border-[#990000]/30 text-[#990000] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Celebration Timeline</span>
        </div>
        <h2 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#2D2424] tracking-tight">
          Wedding Schedule & Events
        </h2>
        <p className="mt-3 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          Join us for two unforgettable days of sacred Hindu rituals, vibrant Gujarati festivities, music, and love.
        </p>

        {/* Day Switcher Tabs - Modern Editorial */}
        <div className="mt-8 inline-flex p-1.5 rounded-xl bg-white border border-[#2D2424]/15 shadow-sm">
          {schedules.map((schedule) => (
            <button
              key={schedule.dayNumber}
              onClick={() => setActiveDay(schedule.dayNumber)}
              className={`px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-[0.18em] transition-all duration-200 flex items-center gap-2.5 ${
                activeDay === schedule.dayNumber
                  ? 'bg-[#990000] text-[#FAF9F6] shadow-sm border border-[#D4AF37]/40'
                  : 'text-[#2D2424] hover:bg-[#FAF9F6]'
              }`}
            >
              <span className="font-serif-display text-base font-bold">Day {schedule.dayNumber}</span>
              <span className="text-[10px] opacity-80 font-sans-body font-normal">({schedule.dayNumber === 1 ? 'Grah Shanti & Pithi' : 'Lagna & Reception'})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Day Banner */}
      <div className="bg-[#2D2424] text-[#FAF9F6] rounded-2xl p-6 sm:p-8 mb-12 shadow-lg border-2 border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[#D4AF37] font-serif-display text-base tracking-[0.2em] uppercase font-bold block">
            {currentSchedule.date}
          </span>
          <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#FAF9F6] mt-1">
            {currentSchedule.title}
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 font-light">
            {currentSchedule.tagline}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-[#1F1919] border border-[#D4AF37]/50 px-4 py-2 rounded-lg text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
          <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>{currentSchedule.events.length} Scheduled Events</span>
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="relative border-l-2 border-[#D4AF37] ml-4 sm:ml-8 md:ml-12 pl-6 sm:pl-10 space-y-8">
        {currentSchedule.events.map((event) => (
          <div
            key={event.id}
            className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#2D2424]/10 hover:shadow-md hover:border-[#D4AF37] transition-all group"
          >
            {/* Timeline Circle Bullet */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-7 w-8 h-8 rounded-full bg-[#FAF9F6] border-2 border-[#D4AF37] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#990000] group-hover:border-[#990000] transition-all">
              {getEventIcon(event.iconName)}
            </div>

            {/* Event Header & Time */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2D2424]">
                    {event.title}
                  </h4>
                  {event.gujaratiName && (
                    <span className="font-sanskrit text-xs px-2.5 py-0.5 rounded-full bg-[#990000]/10 text-[#990000] border border-[#990000]/20 font-bold">
                      {event.gujaratiName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-stone-600 mt-2.5 flex-wrap">
                  <span className="flex items-center gap-1.5 text-[#990000] bg-[#990000]/10 px-3 py-1 rounded-md font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#2D2424] bg-[#FAF9F6] border border-[#2D2424]/15 px-3 py-1 rounded-md text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Add to Calendar Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddToGoogleCalendar(event, currentSchedule.date)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#2D2424] border border-[#2D2424]/20 hover:bg-[#2D2424]/5 transition-colors flex items-center gap-1.5"
                  title="Add event to Google Calendar"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#990000]" />
                  <span>Google Cal</span>
                </button>

                <button
                  onClick={() => handleDownloadIcs(event)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#2D2424] border border-[#2D2424]/20 hover:bg-[#2D2424]/5 transition-colors flex items-center gap-1.5"
                  title="Download .ics file for Apple Calendar or Outlook"
                >
                  {downloadSuccessId === event.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-800">Saved .ics</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>.ICS File</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Event Description */}
            <p className="text-stone-600 text-sm leading-relaxed my-3 font-light">
              {event.description}
            </p>

            {/* Dress Code Recommendation */}
            {event.dressCode && (
              <div className="mt-4 pt-3 border-t border-[#2D2424]/10 flex items-center gap-2 text-xs text-[#2D2424]">
                <span className="font-bold text-[#990000] uppercase tracking-wider text-[10px]">Suggested Attire:</span>
                <span className="bg-[#FAF9F6] text-[#2D2424] px-2.5 py-0.5 rounded-md font-medium border border-[#2D2424]/15">
                  ✨ {event.dressCode}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

