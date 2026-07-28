import React, { useRef, useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Sparkles, Sun, Utensils, Music, Flame, Heart, GlassWater, Download, ExternalLink, Check } from 'lucide-react';
import { DaySchedule, ScheduleItem } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface ScheduleSectionProps {
  schedules: DaySchedule[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules }) => {
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [bookView, setBookView] = useState<'cover' | 'open'>('open');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);

  const leftSchedule = schedules[0];
  const rightSchedule = schedules[1] || schedules[0];

  const getBaseDate = (dayNumber: number) => dayNumber === 1 ? '2026-11-14' : '2026-11-15';

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

  const handleAddToGoogleCalendar = (event: ScheduleItem, dayNumber: number) => {
    const baseDate = getBaseDate(dayNumber);
    const startDateIso = `${baseDate}T09:00:00`;
    const endDateIso = `${baseDate}T13:00:00`;

    const url = generateGoogleCalendarUrl(
      `Neh & Fenny's Wedding - ${event.title}`,
      `${event.description}\n\nDress Code: ${event.dressCode || 'Traditional Indian'}`,
      event.location,
      startDateIso,
      endDateIso
    );

    window.open(url, '_blank');
  };

  const handleDownloadIcs = (event: ScheduleItem, dayNumber: number) => {
    const baseDate = getBaseDate(dayNumber);
    const startDateIso = `${baseDate}T09:00:00`;
    const endDateIso = `${baseDate}T13:00:00`;

    downloadIcsFile(
      `Wedding_${event.title.replace(/[^a-zA-Z0-9]/g, '_')}`,
      `Neh & Fenny Wedding - ${event.title}`,
      `${event.description}\n\nDress Code: ${event.dressCode || 'Traditional Indian'}`,
      event.location,
      startDateIso,
      endDateIso
    );

    setDownloadSuccessId(event.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    setDragOffset(Math.max(-90, Math.min(90, delta)));
  };

  const handlePointerUp = () => {
    if (!isDragging) return;

    if (dragOffset > 50) {
      setBookView('cover');
    } else if (dragOffset < -50) {
      if (bookView === 'cover') {
        setBookView('open');
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    dragStartX.current = null;
  };

  const renderPage = (schedule: any, dayNumber: number, align: 'left' | 'right') => {
    if (!schedule) return null;

    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[#2D2424]/10 bg-[#FAF9F6] p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(45,36,36,0.35)] min-h-[640px] h-full flex flex-col">
        <div className={`absolute inset-y-0 ${align === 'left' ? 'left-0' : 'right-0'} w-1.5 bg-gradient-to-b from-[#D4AF37] via-[#990000] to-[#2D2424]`} />
        <div className={`absolute inset-y-0 ${align === 'left' ? 'right-0' : 'left-0'} w-8 ${align === 'left' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#2D2424]/5 to-transparent`} />
        <div className={`${align === 'left' ? 'pl-4 pr-2' : 'pr-2 pl-4'} flex-1 overflow-y-auto`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#990000]">
                {align === 'left' ? 'Left Page' : 'Right Page'}
              </p>
              <h3 className="mt-1 font-serif-display text-3xl sm:text-4xl font-bold text-[#2D2424]">
                Day {dayNumber}
              </h3>
            </div>
            <div className="rounded-full border border-[#D4AF37]/40 bg-[#FFFDF8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2D2424]">
              {schedule.date}
            </div>
          </div>

          <p className="mt-3 text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            {schedule.tagline}
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-[#2D2424]/10 bg-[#FFFDF8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2D2424]">
            <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>{schedule.events.length} Scheduled Events</span>
          </div>

          <div className="mt-6 space-y-4">
            {schedule.events.map((event: ScheduleItem) => (
              <div
                key={event.id}
                className="rounded-2xl border border-[#2D2424]/10 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-serif-display text-xl sm:text-2xl font-bold text-[#2D2424]">
                        {event.title}
                      </h4>
                      {event.gujaratiName && (
                        <span className="rounded-full border border-[#990000]/20 bg-[#990000]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#990000]">
                          {event.gujaratiName}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-stone-600">
                      <span className="flex items-center gap-1.5 rounded-md bg-[#990000]/10 px-2.5 py-1 text-[#990000]">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-md border border-[#2D2424]/10 bg-[#FAF9F6] px-2.5 py-1 text-[#2D2424]">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToGoogleCalendar(event, dayNumber)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#2D2424]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2D2424] transition-colors hover:bg-[#2D2424]/5"
                      title="Add event to Google Calendar"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#990000]" />
                      <span>Google Cal</span>
                    </button>

                    <button
                      onClick={() => handleDownloadIcs(event, dayNumber)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#2D2424]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2D2424] transition-colors hover:bg-[#2D2424]/5"
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

                <p className="mt-3 text-sm leading-relaxed text-stone-600 font-light">
                  {event.description}
                </p>

                {event.dressCode && (
                  <div className="mt-4 flex items-center gap-2 border-t border-[#2D2424]/10 pt-3 text-xs text-[#2D2424]">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#990000]">Suggested Attire:</span>
                    <span className="rounded-md border border-[#2D2424]/15 bg-[#FAF9F6] px-2.5 py-0.5 font-medium">
                      ✨ {event.dressCode}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

      </div>

      <div className="mt-8 rounded-[2rem] border border-[#2D2424]/10 bg-[#FBF4E8] p-4 sm:p-6 lg:p-8 shadow-[0_25px_80px_-35px_rgba(45,36,36,0.45)]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FAF9F6] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#990000]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Open the book</span>
          </div>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            Turn the pages to discover the sacred rituals and celebrations planned for each day of the wedding weekend.
          </p>
        </div>

        <div
          className="relative mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-stretch"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div className="absolute left-1/2 top-0 hidden h-full w-8 -translate-x-1/2 rounded-full bg-[#2D2424]/90 shadow-[0_0_0_6px_rgba(212,175,55,0.2)] lg:block" />
          <div className="absolute left-1/2 top-6 hidden h-[calc(100%-3rem)] w-2 -translate-x-1/2 rounded-full bg-[#D4AF37]/70 lg:block" />

          <div className="w-full lg:w-[calc(50%-1rem)] lg:pr-4 flex">
            <div
              className="relative overflow-hidden rounded-[1.75rem] border border-[#2D2424]/10 bg-[#FAF9F6] p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(45,36,36,0.35)] transition-all duration-300 w-full h-full"
              style={{ transform: `translateX(${isDragging ? dragOffset * 0.2 : 0}px)` }}
            >
              {bookView === 'cover' ? (
                <div className="flex min-h-[640px] h-full flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-[#D4AF37]/50 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.2),_transparent_60%)] p-8 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FAF9F6] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#990000]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Front Cover</span>
                  </div>
                  <h3 className="mt-6 font-serif-display text-3xl sm:text-4xl font-bold text-[#2D2424]">
                    Neh & Fenny&apos;s
                  </h3>
                  <p className="mt-2 font-serif-display text-2xl sm:text-3xl font-semibold text-[#990000]">
                    Wedding Schedule
                  </p>
                  <p className="mt-6 max-w-md text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                    Drag left to open the book and discover the celebration timeline for each day of the wedding weekend.
                  </p>
                </div>
              ) : (
                renderPage(leftSchedule, 1, 'left')
              )}
            </div>
          </div>

          <div className="w-full lg:w-[calc(50%-1rem)] lg:pl-4 flex">
            <div
              className="relative overflow-hidden rounded-[1.75rem] border border-[#2D2424]/10 bg-[#FAF9F6] p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(45,36,36,0.35)] transition-all duration-300 w-full h-full"
              style={{ transform: `translateX(${isDragging ? dragOffset * 0.2 : 0}px)` }}
            >
              {bookView === 'cover' ? (
                <div className="flex min-h-[640px] h-full flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-[#D4AF37]/50 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.2),_transparent_60%)] p-8 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#FAF9F6] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#990000]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Back Cover</span>
                  </div>
                  <h3 className="mt-6 font-serif-display text-3xl sm:text-4xl font-bold text-[#2D2424]">
                    We cannot wait
                  </h3>
                  <p className="mt-2 font-serif-display text-2xl sm:text-3xl font-semibold text-[#990000]">
                    to celebrate together
                  </p>
                  <p className="mt-6 max-w-md text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                    Drag right to close the book, or drag left from the cover to open it.
                  </p>
                </div>
              ) : (
                renderPage(rightSchedule, 2, 'right')
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

