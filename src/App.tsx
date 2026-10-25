import React from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ScheduleSection } from "./components/ScheduleSection";
import { RsvpSection } from "./components/RsvpSection";
import { RsvpPage } from "./components/RsvpPage";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import {
  defaultWeddingDetails,
  defaultSchedules,
} from "./data/weddingData";

export default function App() {
  const invitationMatch = window.location.pathname.match(/^\/rsvp\/([^/]+)\/?$/);
  if (window.location.pathname.startsWith("/rsvp")) {
    return <RsvpPage token={invitationMatch?.[1] ?? ""} />;
  }

  const handleOpenRsvpScroll = () => {
    const rsvpElement = document.getElementById("rsvp");
    if (rsvpElement) {
      rsvpElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-stone-800 font-sans-body">
      {/* Navigation Header */}
      <Navbar
        onOpenRsvp={handleOpenRsvpScroll}
      />

      {/* Hero Header with Countdown & Blessing */}
      <Hero details={defaultWeddingDetails} onOpenRsvp={handleOpenRsvpScroll} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2-Day Schedule (Day 1: Grah Shanti & Pithi; Day 2: Wedding) */}
        <ScheduleSection schedules={defaultSchedules} />

        <RsvpSection />

        {/* Guest FAQs */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer details={defaultWeddingDetails} onOpenRsvp={handleOpenRsvpScroll} />
    </div>
  );
}
