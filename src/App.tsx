import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ScheduleSection } from "./components/ScheduleSection";
import { LocationSection } from "./components/LocationSection";
import { RsvpSection } from "./components/RsvpSection";
import { FaqSection } from "./components/FaqSection";
import { Footer } from "./components/Footer";
import {
  defaultWeddingDetails,
  defaultSchedules,
  defaultVenues,
} from "./data/weddingData";
import { WeddingDetails } from "./types";

export default function App() {
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails>(() => {
    const savedSheetUrl = localStorage.getItem("wedding_google_sheet_url");
    if (savedSheetUrl) {
      return { ...defaultWeddingDetails, googleSheetRsvpUrl: savedSheetUrl };
    }
    return defaultWeddingDetails;
  });

  const handleUpdateRsvpUrl = (newUrl: string) => {
    localStorage.setItem("wedding_google_sheet_url", newUrl);
    setWeddingDetails((prev) => ({ ...prev, googleSheetRsvpUrl: newUrl }));
  };

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
        rsvpUrl={weddingDetails.googleSheetRsvpUrl}
      />

      {/* Hero Header with Countdown & Blessing */}
      <Hero details={weddingDetails} onOpenRsvp={handleOpenRsvpScroll} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2-Day Schedule (Day 1: Grah Shanti & Pithi; Day 2: Wedding) */}
        <ScheduleSection schedules={defaultSchedules} />

        {/* Locations, Venues & Maps */}
        <LocationSection venues={defaultVenues} />

        {/* RSVP Section linking to Google Sheet */}
        <RsvpSection
          details={weddingDetails}
          onUpdateRsvpUrl={handleUpdateRsvpUrl}
        />

        {/* Guest FAQs */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer details={weddingDetails} onOpenRsvp={handleOpenRsvpScroll} />
    </div>
  );
}
