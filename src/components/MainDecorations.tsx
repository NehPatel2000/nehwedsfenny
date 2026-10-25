import React from 'react';

export const MainDecorations: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block">
    {/* Rose ornament from a 1905 advertisement, public domain. See public/THIRD-PARTY-NOTICES.txt. */}
    <div
      className="absolute bottom-8 left-0 z-0 h-64 w-28 -rotate-[28deg] bg-[#A52A3A]/65 sm:bottom-12 sm:h-72 sm:w-36 lg:h-80 lg:w-44"
      style={{
        maskImage: "url('/rose-ornament.svg')",
        WebkitMaskImage: "url('/rose-ornament.svg')",
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
    <div
      className="absolute bottom-8 right-0 z-0 h-64 w-28 rotate-[28deg] -scale-x-100 bg-[#A52A3A]/65 sm:bottom-12 sm:h-72 sm:w-36 lg:h-80 lg:w-44"
      style={{
        maskImage: "url('/rose-ornament.svg')",
        WebkitMaskImage: "url('/rose-ornament.svg')",
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
    <div
      className="absolute -top-24 -left-8 z-0 h-64 w-28 rotate-[28deg] bg-[#A52A3A]/45 sm:-top-28 sm:h-72 sm:w-36 lg:h-80 lg:w-44"
      style={{
        maskImage: "url('/rose-ornament.svg')",
        WebkitMaskImage: "url('/rose-ornament.svg')",
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
    <div
      className="absolute -top-24 -right-8 z-0 h-64 w-28 -rotate-[28deg] -scale-x-100 bg-[#A52A3A]/45 sm:-top-28 sm:h-72 sm:w-36 lg:h-80 lg:w-44"
      style={{
        maskImage: "url('/rose-ornament.svg')",
        WebkitMaskImage: "url('/rose-ornament.svg')",
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  </div>
);
