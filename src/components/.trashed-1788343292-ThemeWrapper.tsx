import React from 'react';
import { ReadingTheme } from '../types';

interface ThemeWrapperProps {
  theme: ReadingTheme;
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children }) => {
  const getThemeClasses = (): string => {
    switch (theme) {
      case 'vintage':
        return 'bg-[#f8f4eb] text-[#4a3b32] selection:bg-amber-200';
      case 'rain':
        return 'bg-[#2b3541] text-[#e2e8f0] selection:bg-slate-700';
      case 'sakura':
        return 'bg-[#fcf2f4] text-[#4a2e35] selection:bg-pink-200';
      case 'forest':
        return 'bg-[#1e2e26] text-[#e3ebe6] selection:bg-emerald-900';
      case 'starry':
        return 'bg-[#0f172a] text-[#f1f5f9] selection:bg-indigo-900';
      case 'cafe':
        return 'bg-[#2c221e] text-[#f3ece7] selection:bg-stone-800';
      case 'candlelight':
        return 'bg-[#1c120c] text-[#fce8d5] selection:bg-amber-950';
      case 'library':
        return 'bg-[#f4efe6] text-[#332922] selection:bg-amber-200';
      default:
        return 'bg-[#f8f4eb] text-[#4a3b32]';
    }
  };

  const renderVisualOverlay = () => {
    switch (theme) {
      case 'rain':
        return (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
        );
      case 'sakura':
        return (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-15 bg-[radial-gradient(#f472b6_1px,transparent_1px)] [background-size:24px_24px]" />
        );
      case 'starry':
        return (
          <div className="pointer-events-none fixed inset-0 z-0 opacity-30 bg-[radial-gradient(#fef08a_1px,transparent_1px)] [background-size:28px_28px]" />
        );
      case 'candlelight':
        return (
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)]" />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 relative font-serif ${getThemeClasses()}`}>
      {renderVisualOverlay()}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
