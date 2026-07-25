import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { guestFaqs } from '../data/weddingData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#FAF9F6] border-t border-[#2D2424]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#990000]/10 border border-[#990000]/30 text-[#990000] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Guest Assistance</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#2D2424] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            Everything you need to know about the Gujarati wedding schedule, food, attire, and logistics.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {guestFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#2D2424]/10 shadow-xs overflow-hidden transition-all hover:border-[#D4AF37]"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-[#FAF9F6]/80 transition-colors"
                >
                  <span className="font-serif-display text-xl sm:text-2xl font-bold text-[#2D2424]">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl bg-[#FAF9F6] border border-[#2D2424]/10 text-[#2D2424] transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#990000] text-[#FAF9F6] border-[#990000]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-[#2D2424]/10 font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

