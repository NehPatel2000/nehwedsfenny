import React from "react";
import { Navbar } from "./components/Navbar";
import { Main } from "./components/Main";
import { PhotoGallerySection } from "./components/PhotoGallerySection";
import { ScheduleSection } from "./components/ScheduleSection";
import { RsvpSection } from "./components/RsvpSection";
import { RsvpPage } from "./components/RsvpPage";
import { PublicRsvpPage } from "./components/PublicRsvpPage";
import { AdminPage } from "./components/AdminPage";
import { Footer } from "./components/Footer";
import {
  defaultWeddingDetails,
  defaultVenues,
  defaultSchedules,
} from "./data/weddingData";

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/admin") return <AdminPage />;
  if (pathname === "/rsvp") return <PublicRsvpPage />;
  const publicRsvpMatch = pathname.match(/^\/rsvp\/guest\/([A-Za-z0-9_-]{10})$/)
    ?? pathname.match(/^\/rsvp\/([a-f0-9]{64})$/);
  if (publicRsvpMatch) return <PublicRsvpPage token={publicRsvpMatch[1]} />;
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

      <PhotoGallerySection />

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
