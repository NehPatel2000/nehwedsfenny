import React from "react";
import { Navbar } from "./components/Navbar";
import { Main } from "./components/Main";
import { ScheduleSection } from "./components/ScheduleSection";
import { RsvpSection } from "./components/RsvpSection";
import { RsvpPage } from "./components/RsvpPage";
import { Footer } from "./components/Footer";
import {
  defaultWeddingDetails,
  defaultVenues,
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
    <div className="min-h-screen flex flex-col bg-[#FBF7ED] text-stone-800 font-sans-body">
      {/* Navigation Header */}
      <Navbar
        onOpenRsvp={handleOpenRsvpScroll}
      />

      {/* Main page header with countdown and blessing */}
      <Main details={defaultWeddingDetails} onOpenRsvp={handleOpenRsvpScroll} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Two-day wedding schedule */}
        <ScheduleSection schedules={defaultSchedules} locationUrl={defaultVenues.day1.googleMapsUrl} />

        <RsvpSection />

      </main>

      {/* Footer */}
      <Footer details={defaultWeddingDetails} onOpenRsvp={handleOpenRsvpScroll} />
    </div>
  );
}
