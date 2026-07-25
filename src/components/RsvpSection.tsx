import React, { useState } from 'react';
import { Send, CheckCircle2, ExternalLink, Settings, Sparkles, Heart, Edit2, FileSpreadsheet } from 'lucide-react';
import { GaneshIcon } from './GaneshIcon';
import { WeddingDetails, RsvpResponse } from '../types';
import confetti from 'canvas-confetti';

interface RsvpSectionProps {
  details: WeddingDetails;
  onUpdateRsvpUrl: (newUrl: string) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ details, onUpdateRsvpUrl }) => {
  const [editingUrl, setEditingUrl] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(details.googleSheetRsvpUrl);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Quick Inline RSVP Form State
  const [formData, setFormData] = useState<RsvpResponse>({
    guestName: '',
    email: '',
    attendingDay1: true,
    attendingDay2: true,
    dietaryRestrictions: '',
    guestCount: 1,
    messageToCouple: ''
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#990000', '#2D2424', '#FAF9F6']
    });
  };

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConfetti();
    setIsSubmitted(true);

    // Save response locally for guest convenience
    const existingResponses = JSON.parse(localStorage.getItem('guest_rsvps') || '[]');
    existingResponses.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('guest_rsvps', JSON.stringify(existingResponses));

    // After brief pause, offer opening the Google Sheet
    setTimeout(() => {
      window.open(details.googleSheetRsvpUrl, '_blank');
    }, 1200);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onUpdateRsvpUrl(customUrlInput.trim());
      setEditingUrl(false);
    }
  };

  return (
    <section id="rsvp" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-[#2D2424] text-[#FAF9F6] rounded-2xl p-8 sm:p-14 shadow-2xl border-2 border-[#D4AF37]/40 relative overflow-hidden">
        
        {/* Background Mandala Symbol Accent */}
        <div className="absolute top-4 right-4 p-6 opacity-10 pointer-events-none text-[#D4AF37]">
          <GaneshIcon className="w-28 h-28 text-[#D4AF37]" />
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF9F6]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
            <Heart className="w-3.5 h-3.5 text-[#990000] fill-[#990000]" />
            <span>Kindly Respond</span>
          </div>

          <h2 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#FAF9F6] tracking-tight">
            RSVP For The Wedding
          </h2>

          <p className="mt-3 text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
            Please let us know if you can join us for Day 1 (Grah Shanti & Pithi) and Day 2 (Wedding & Reception) by October 1st, 2026.
          </p>

          {/* Direct Google Sheet Button Banner */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={details.googleSheetRsvpUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerConfetti}
              className="w-full sm:w-auto px-8 py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-[#FAF9F6] bg-[#990000] hover:bg-[#770000] border border-[#D4AF37]/50 shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5 text-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
              <span>Open RSVP Google Sheet / Form</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              onClick={() => setEditingUrl(!editingUrl)}
              className="px-4 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#FAF9F6]/10 transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{editingUrl ? 'Cancel Link Edit' : 'Edit Google Sheet Link'}</span>
            </button>
          </div>

          {/* Edit Google Sheet URL Drawer */}
          {editingUrl && (
            <form onSubmit={handleSaveUrl} className="mt-6 p-4 rounded-xl bg-[#1F1919] border border-[#D4AF37]/40 max-w-xl mx-auto text-left">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5">
                Configure Couple's Custom Google Sheet / Form URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  required
                  className="flex-1 bg-[#2D2424] border border-[#D4AF37]/40 rounded-lg px-3.5 py-2 text-xs text-[#FAF9F6] placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#2D2424] bg-[#D4AF37] hover:bg-amber-400 transition-colors"
                >
                  Save Link
                </button>
              </div>
              <p className="text-[10px] text-stone-400 mt-1.5">
                Paste your live Google Form or Google Sheet share link here. It persists locally so guests click your real form.
              </p>
            </form>
          )}
        </div>

        {/* Embedded / Interactive RSVP Form Card */}
        <div className="bg-[#FAF9F6] text-[#2D2424] rounded-2xl p-6 sm:p-10 shadow-xl max-w-2xl mx-auto relative z-10 border border-[#2D2424]/10">
          <div className="flex items-center justify-between border-b border-[#2D2424]/10 pb-4 mb-6">
            <div>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2D2424]">
                Quick Guest RSVP
              </h3>
              <p className="text-xs text-stone-500">
                Submit here to confirm your attendance directly
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2D2424]">
                Aabhar! Thank You, {formData.guestName}!
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
                Your RSVP response has been recorded. Opening the official Google Sheet form in a new tab...
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-[#2D2424] bg-white border border-[#2D2424]/20 hover:bg-[#FAF9F6] transition-colors"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleInlineSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2424] mb-1">
                  Full Name(s) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="e.g. Ramesh Patel & Family"
                  className="w-full bg-white border border-[#2D2424]/20 rounded-lg px-4 py-2.5 text-xs text-[#2D2424] focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2424] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-[#2D2424]/20 rounded-lg px-4 py-2.5 text-xs text-[#2D2424] focus:outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2424] mb-1">
                    Total Number of Guests *
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                    className="w-full bg-white border border-[#2D2424]/20 rounded-lg px-4 py-2.5 text-xs text-[#2D2424] focus:outline-none focus:border-[#990000]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attendance Selection */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2424]">
                  Which events will you attend?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.attendingDay1 ? 'bg-[#990000]/10 border-[#990000]' : 'bg-white border-[#2D2424]/15'}`}>
                    <input
                      type="checkbox"
                      checked={formData.attendingDay1}
                      onChange={(e) => setFormData({ ...formData, attendingDay1: e.target.checked })}
                      className="w-4 h-4 text-[#990000] rounded focus:ring-[#990000]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#2D2424] block">Day 1: Grah Shanti & Garba</span>
                      <span className="text-[10px] text-stone-500">Sat, Nov 14</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.attendingDay2 ? 'bg-[#990000]/10 border-[#990000]' : 'bg-white border-[#2D2424]/15'}`}>
                    <input
                      type="checkbox"
                      checked={formData.attendingDay2}
                      onChange={(e) => setFormData({ ...formData, attendingDay2: e.target.checked })}
                      className="w-4 h-4 text-[#990000] rounded focus:ring-[#990000]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#2D2424] block">Day 2: Wedding & Reception</span>
                      <span className="text-[10px] text-stone-500">Sun, Nov 15</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2424] mb-1">
                  Dietary Restrictions / Special Requests
                </label>
                <input
                  type="text"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  placeholder="e.g. Jain Vegetarian, Vegan, Nut allergy, etc."
                  className="w-full bg-white border border-[#2D2424]/20 rounded-lg px-4 py-2.5 text-xs text-[#2D2424] focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#2D2424] mb-1">
                  Warm Note or Message for Priya & Rohan
                </label>
                <textarea
                  rows={2}
                  value={formData.messageToCouple}
                  onChange={(e) => setFormData({ ...formData, messageToCouple: e.target.value })}
                  placeholder="Share a wish or blessing for the couple..."
                  className="w-full bg-white border border-[#2D2424]/20 rounded-lg px-4 py-2 text-xs text-[#2D2424] focus:outline-none focus:border-[#990000]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-lg font-bold text-xs uppercase tracking-[0.2em] text-[#FAF9F6] bg-[#990000] hover:bg-[#770000] shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit RSVP & Connect to Google Sheet</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

