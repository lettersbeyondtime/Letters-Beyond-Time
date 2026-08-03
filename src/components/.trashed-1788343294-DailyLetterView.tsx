import React from 'react';
import { Letter } from '../types';
import { LetterCard } from './LetterCard';
import { Calendar, Sparkles, Sun } from 'lucide-react';

interface DailyLetterViewProps {
  dailyLetter: Letter | null;
  onToggleFavorite: (letter: Letter) => void;
  isFavorite: (id: string) => boolean;
  onReact: (id: string, type: string) => void;
}

export const DailyLetterView: React.FC<DailyLetterViewProps> = ({
  dailyLetter,
  onToggleFavorite,
  isFavorite,
  onReact,
}) => {
  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-serif">
      
      {/* Header Banner */}
      <div className="text-center mb-8 bg-amber-100/60 dark:bg-stone-900 border border-amber-900/15 dark:border-stone-800 rounded-3xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 bg-amber-200/80 dark:bg-stone-800 px-4 py-1 rounded-full text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-2">
          <Calendar className="w-3.5 h-3.5 text-amber-700" />
          <span>Daily Wisdom • {todayDateString}</span>
        </div>

        <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-100 mt-1">
          💭 Letter of the Day
        </h2>

        <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80 max-w-xl mx-auto mt-2">
          &ldquo;Every morning brings a new letter to carry through your day.&rdquo;
        </p>
      </div>

      {dailyLetter ? (
        <div className="space-y-8">
          <LetterCard
            letter={dailyLetter}
            isFavorite={isFavorite(dailyLetter.id)}
            onToggleFavorite={onToggleFavorite}
            onReact={onReact}
            expandedDefault={true}
          />

          {/* Daily Reflection Journal Prompt */}
          <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-md">
            <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <span>Today&apos;s Reflection Prompt</span>
            </h3>

            <p className="text-sm italic text-amber-900/80 dark:text-amber-300 leading-relaxed mb-4">
              &ldquo;What is one small kindness you can offer yourself today based on the words in this letter?&rdquo;
            </p>

            <textarea
              rows={3}
              placeholder="Write a private reflection note for yourself..."
              className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-2xl p-4 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100 shadow-inner"
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm italic text-amber-800/70 dark:text-stone-400">
            Loading today&apos;s letter...
          </p>
        </div>
      )}

    </div>
  );
};
