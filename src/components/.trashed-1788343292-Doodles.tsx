import React from 'react';

export const Doodles: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35 select-none">
      {/* Floating Envelope 1 */}
      <div className="absolute top-12 left-8 animate-bounce duration-[6000ms]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-800/40 dark:text-amber-200/40">
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M12 12 4 18" />
          <path d="m12 12 8 6" />
        </svg>
      </div>

      {/* Floating Paper Plane */}
      <div className="absolute top-24 right-12 animate-pulse duration-[4000ms]">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-800/40 dark:text-emerald-200/40">
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </div>

      {/* Gentle Stars */}
      <div className="absolute top-1/3 left-1/4 animate-spin duration-[15000ms]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-700/30 dark:text-amber-300/30">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
        </svg>
      </div>

      {/* Leaf Vine Doodle */}
      <div className="absolute bottom-16 left-12">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-800/30 dark:text-emerald-300/30">
          <path d="M10 90 Q 50 80, 80 20" strokeLinecap="round" />
          <path d="M30 75 C 20 60, 40 50, 30 75 Z" fill="currentColor" opacity="0.3" />
          <path d="M50 55 C 40 40, 60 30, 50 55 Z" fill="currentColor" opacity="0.3" />
          <path d="M68 35 C 60 20, 80 15, 68 35 Z" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      {/* Sparkles Right */}
      <div className="absolute bottom-24 right-16 animate-bounce duration-[8000ms]">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600/30 dark:text-amber-200/30">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Vintage Stamp Doodle */}
      <div className="absolute top-1/2 right-8 rotate-12">
        <div className="w-16 h-16 border-2 border-dashed border-amber-900/30 dark:border-amber-200/30 rounded p-1 flex items-center justify-center">
          <div className="text-[10px] text-center font-serif text-amber-900/40 dark:text-amber-200/40 uppercase tracking-widest">
            Air Mail<br />✦ 1984 ✦
          </div>
        </div>
      </div>
    </div>
  );
};
