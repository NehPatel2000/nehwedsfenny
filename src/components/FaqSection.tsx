import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { guestFaqs } from '../data/weddingData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#FBF7ED] border-t border-[#493A36]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A52A3A]/10 border border-[#A52A3A]/30 text-[#A52A3A] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#92916F]" />
            <span>Guest Assistance</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#493A36] tracking-tight">
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
                className="bg-[#FFFDF7] rounded-2xl border border-[#493A36]/10 shadow-xs overflow-hidden transition-all hover:border-[#92916F]"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-[#FBF7ED]/80 transition-colors"
                >
                  <span className="font-serif-display text-xl sm:text-2xl font-bold text-[#493A36]">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl bg-[#FBF7ED] border border-[#493A36]/10 text-[#493A36] transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#A52A3A] text-[#FBF7ED] border-[#A52A3A]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-[#493A36]/10 font-light">
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
