import React from 'react';
import { Letter } from '../types';
import { Doodles } from './Doodles';
import { LetterCard } from './LetterCard';
import { Inbox, Send, Sparkles, Heart, Compass, Gift } from 'lucide-react';

interface HeroProps {
  onReceiveClick: () => void;
  onSendClick: () => void;
  onBrowseClick: () => void;
  dailyLetter: Letter | null;
  randomLetter: Letter | null;
  onPullRandomLetter: () => void;
  onToggleFavorite: (letter: Letter) => void;
  isFavorite: (id: string) => boolean;
  onReact: (id: string, type: string) => void;
  onOpenSurprise: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onReceiveClick,
  onSendClick,
  onBrowseClick,
  dailyLetter,
  randomLetter,
  onPullRandomLetter,
  onToggleFavorite,
  isFavorite,
  onReact,
  onOpenSurprise,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative Doodles Background */}
      <Doodles />

      {/* Hero Central Card */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        
        {/* Soft Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-100/90 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 px-4 py-1.5 rounded-full text-xs font-serif text-amber-900 dark:text-amber-200 shadow-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>A safe haven of anonymous encouragement across generations</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-amber-950 dark:text-amber-100 tracking-tight leading-tight">
          Welcome to <span className="italic text-amber-800 dark:text-amber-300">Letters Beyond Time</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-2xl font-serif italic text-amber-900/90 dark:text-amber-200/90 max-w-2xl mx-auto leading-relaxed">
          &ldquo;Somewhere in another year, someone has already survived what you&apos;re facing today.&rdquo;
        </p>

        {/* Call to Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onReceiveClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 text-amber-50 font-serif font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
          >
            <Inbox className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>📩 Receive a Letter</span>
          </button>

          <button
            onClick={onSendClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-100 hover:bg-amber-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-amber-950 dark:text-amber-100 border-2 border-amber-800/30 dark:border-stone-600 font-serif font-semibold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
          >
            <Send className="w-5 h-5 text-amber-800 dark:text-amber-300 group-hover:translate-x-1 transition-transform" />
            <span>✍️ Send a Letter</span>
          </button>
        </div>

        {/* Quick Features Row */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-sans text-amber-900/80 dark:text-amber-300/80">
          <button 
            onClick={onOpenSurprise}
            className="flex items-center gap-1.5 bg-amber-100/60 dark:bg-stone-800/60 hover:bg-amber-200/60 px-3 py-1.5 rounded-full border border-amber-900/10 transition-all"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>Surprise Letter</span>
          </button>
          <span>•</span>
          <button 
            onClick={onBrowseClick}
            className="flex items-center gap-1.5 bg-amber-100/60 dark:bg-stone-800/60 hover:bg-amber-200/60 px-3 py-1.5 rounded-full border border-amber-900/10 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Browse Library</span>
          </button>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>100% Anonymous & Kind</span>
          </span>
        </div>

      </div>

      {/* Interactive Feature Grid below Hero */}
      <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Daily Letter Section */}
        {dailyLetter && (
          <div className="bg-amber-100/50 dark:bg-stone-900/50 border border-amber-900/15 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 bg-amber-200/80 dark:bg-stone-800 px-3 py-1 rounded-full">
                  💭 Daily Letter of Hope
                </span>
                <span className="text-xs text-amber-800/60 dark:text-stone-400">
                  Refreshes daily
                </span>
              </div>
              <LetterCard
                letter={dailyLetter}
                isFavorite={isFavorite(dailyLetter.id)}
                onToggleFavorite={onToggleFavorite}
                onReact={onReact}
                expandedDefault={false}
              />
            </div>
          </div>
        )}

        {/* Pull a Random Letter Jar Widget */}
        <div className="bg-amber-100/50 dark:bg-stone-900/50 border border-amber-900/15 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-stone-800 px-3 py-1 rounded-full">
                🌍 Random Letter Jar
              </span>
              <button
                onClick={onPullRandomLetter}
                className="text-xs font-serif font-medium text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>Pull another</span> 🔄
              </button>
            </div>

            {randomLetter ? (
              <LetterCard
                letter={randomLetter}
                isFavorite={isFavorite(randomLetter.id)}
                onToggleFavorite={onToggleFavorite}
                onReact={onReact}
                expandedDefault={false}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-sm italic text-amber-800/70 dark:text-stone-400">
                  Reach into the jar to draw an encouraging letter from somewhere in the world.
                </p>
                <button
                  onClick={onPullRandomLetter}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-amber-800 text-amber-50 font-serif text-sm shadow hover:bg-amber-900 transition-all"
                >
                  ✉️ Open a Random Letter
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
