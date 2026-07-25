import React, { useState } from 'react';
import { BookOpen, Sparkles, Sun, Music, Flame, Heart, Info, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { TraditionInfo } from '../types';

interface TraditionGuideProps {
  traditions: TraditionInfo[];
}

export const TraditionGuide: React.FC<TraditionGuideProps> = ({ traditions }) => {
  const [selectedTradition, setSelectedTradition] = useState<TraditionInfo | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
      case 'Sun': return <Sun className="w-5 h-5 text-[#990000]" />;
      case 'Music': return <Music className="w-5 h-5 text-[#990000]" />;
      case 'Flame': return <Flame className="w-5 h-5 text-[#D4AF37]" />;
      case 'Heart': return <Heart className="w-5 h-5 text-[#990000]" />;
      default: return <BookOpen className="w-5 h-5 text-[#2D2424]" />;
    }
  };

  return (
    <section id="traditions" className="py-24 bg-[#FAF9F6] border-y border-[#2D2424]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#990000]/10 border border-[#990000]/30 text-[#990000] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cultural Insights for Guests</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#2D2424] tracking-tight">
            Gujarati Wedding Traditions Explained
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            New to Gujarati Hindu wedding rituals? Here is a welcoming guide to the meaningful symbolism behind Grah Shanti, Pithi, Garba, and Pheras.
          </p>
        </div>

        {/* Tradition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {traditions.map((tradition) => (
            <div
              key={tradition.id}
              className="bg-white rounded-2xl p-7 shadow-xs border border-[#2D2424]/10 hover:shadow-md hover:border-[#D4AF37] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#2D2424]/10 group-hover:border-[#D4AF37] transition-colors">
                    {getIcon(tradition.iconName)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#990000] bg-[#990000]/10 px-3 py-1 rounded-md">
                    {tradition.day}
                  </span>
                </div>

                {/* Titles */}
                <div className="mb-3">
                  <h3 className="font-serif-display text-2xl font-bold text-[#2D2424]">
                    {tradition.title}
                  </h3>
                  <span className="font-sanskrit text-xs text-[#990000] block mt-0.5 font-bold">
                    {tradition.gujaratiTitle}
                  </span>
                </div>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5 font-light">
                  {tradition.shortDesc}
                </p>
              </div>

              {/* Guest Tip Pill */}
              <div className="pt-4 border-t border-[#2D2424]/10">
                <div className="bg-[#FAF9F6] rounded-xl p-3 border border-[#2D2424]/10 flex items-start gap-2 text-xs text-[#2D2424] mb-4">
                  <Info className="w-4 h-4 text-[#990000] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#2D2424] text-[11px] block mb-0.5 uppercase tracking-wider">Guest Tip:</span>
                    <span className="font-light text-stone-600 text-xs">{tradition.guestTip}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTradition(tradition)}
                  className="w-full py-2.5 px-4 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] text-[#2D2424] bg-[#FAF9F6] hover:bg-[#990000] hover:text-[#FAF9F6] transition-all flex items-center justify-center gap-2 group border border-[#2D2424]/15"
                >
                  <span>Read Sacred Meaning</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#990000] group-hover:text-[#FAF9F6] group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Attire & Color Guide Banner - Editorial Lookbook */}
        <div className="mt-16 bg-[#2D2424] text-[#FAF9F6] rounded-2xl p-8 sm:p-12 shadow-lg border-2 border-[#D4AF37]/40 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.25em] block mb-2">
              👗 Guest Attire & Color Advice
            </span>
            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#FAF9F6]">
              What to Wear to a Gujarati Indian Wedding
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed font-light">
              Indian weddings are a vibrant symphony of color! We invite you to dress in your favorite festive traditional attire or elegant formal wear.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs">
              <div className="flex items-start gap-3 bg-[#1F1919] p-4 rounded-xl border border-[#D4AF37]/30">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#D4AF37] block mb-0.5 uppercase tracking-wider text-[10px]">Day 1 (Grah Shanti & Pithi):</strong>
                  <span className="text-stone-300 leading-relaxed font-light">Wear cheerful yellows, mustard, gold, or bright pastels. Casual or festive Kurtas and Sarees.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#1F1919] p-4 rounded-xl border border-[#D4AF37]/30">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#D4AF37] block mb-0.5 uppercase tracking-wider text-[10px]">Day 2 (Wedding & Reception):</strong>
                  <span className="text-stone-300 leading-relaxed font-light">Royal silks, Lehengas, Sherwanis, or formal suits. *Cultural note:* Avoid solid black or solid white for the morning mandap puja.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tradition Modal Explainer */}
      {selectedTradition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2424]/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37]/50 relative">
            <button
              onClick={() => setSelectedTradition(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#2D2424]/10">
                {getIcon(selectedTradition.iconName)}
              </div>
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#2D2424]">
                  {selectedTradition.title}
                </h3>
                <span className="font-sanskrit text-xs text-[#990000] font-bold">
                  {selectedTradition.gujaratiTitle} ({selectedTradition.day})
                </span>
              </div>
            </div>

            <div className="space-y-4 my-6 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              <div>
                <strong className="text-[#2D2424] font-semibold uppercase tracking-wider text-[11px] block mb-1">Cultural Significance:</strong>
                <p>{selectedTradition.fullDesc}</p>
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#2D2424]/10 text-xs text-[#2D2424]">
                <strong className="text-[#990000] font-bold uppercase tracking-wider text-[10px] block mb-1">Guest Tip for this Ritual:</strong>
                <p>{selectedTradition.guestTip}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTradition(null)}
              className="w-full py-3 rounded-lg font-bold text-xs uppercase tracking-[0.2em] text-[#FAF9F6] bg-[#990000] hover:bg-[#770000] transition-colors shadow"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

