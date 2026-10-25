import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Sparkles, Sun, Utensils, Music, Flame, Heart, GlassWater } from 'lucide-react';
import { DaySchedule, ScheduleItem } from '../types';

interface ScheduleSectionProps {
  schedules: DaySchedule[];
  locationUrl: string;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules, locationUrl }) => {
  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-[#A52A3A]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#92916F]" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-[#493A36]" />;
      case 'Music': return <Music className="w-4 h-4 text-[#A52A3A]" />;
      case 'Flame': return <Flame className="w-4 h-4 text-[#92916F]" />;
      case 'Heart': return <Heart className="w-4 h-4 text-[#A52A3A]" />;
      case 'GlassWater': return <GlassWater className="w-4 h-4 text-[#493A36]" />;
      default: return <CalendarIcon className="w-4 h-4 text-[#A52A3A]" />;
    }
  };

  const renderDay = (schedule: DaySchedule) => {
    if (!schedule) return null;

    return (
      <article className="overflow-hidden rounded-3xl border border-[#92916F]/30 bg-[#FBF7ED] shadow-[0_18px_50px_-32px_rgba(73,58,54,0.45)]">
        <header className="border-b border-[#92916F]/25 bg-[#F4EBDD] px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {schedule.title && (
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A52A3A]">
                  {schedule.title}
                </p>
              )}
              <h3 className="mt-1 font-serif-display text-3xl sm:text-4xl font-bold text-[#493A36]">
                Day {schedule.dayNumber}
              </h3>
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1.5 text-xs text-[#675A53] hover:text-[#A52A3A] transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#92916F]" />
                {schedule.events[0]?.location}
              </a>
            </div>
            <div className="rounded-full border border-[#92916F]/40 bg-[#FBF7ED] px-3 py-1 text-xs font-semibold text-[#493A36]">
              {schedule.date}
            </div>
          </div>

          {schedule.tagline && (
            <p className="mt-3 text-sm sm:text-base text-[#675A53] font-light leading-relaxed">
              {schedule.tagline}
            </p>
          )}
        </header>

        <ol className="divide-y divide-[#92916F]/20 px-5 sm:px-8">
          {schedule.events.map((event: ScheduleItem) => (
            <li key={event.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9D9D1] sm:mt-0">
                  {getEventIcon(event.iconName)}
                </span>
                <div className="min-w-0">
                  <h4 className="font-serif-display text-xl font-bold leading-tight text-[#493A36] sm:text-2xl">
                    {event.title}
                  </h4>
                </div>
              </div>

              <div className="pl-[3.25rem] sm:shrink-0 sm:pl-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1E4E2] px-3 py-1.5 text-xs font-semibold text-[#8D293C]">
                  <Clock className="h-3.5 w-3.5" />
                  {event.time}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </article>
    );
  };

  return (
    <section id="schedule" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#A52A3A]/20 bg-[#F1E4E2] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8D293C]">
          <Sparkles className="h-3.5 w-3.5 text-[#92916F]" />
          <span>Celebration Timeline</span>
        </div>
        <h2 className="font-serif-display text-4xl font-bold tracking-tight text-[#493A36] sm:text-6xl">
          Wedding Schedule & Events
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed text-[#675A53] sm:text-base">
          Join us for the ceremonies and meals planned across two days.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {schedules.map(renderDay)}
      </div>
    </section>
  );
};
