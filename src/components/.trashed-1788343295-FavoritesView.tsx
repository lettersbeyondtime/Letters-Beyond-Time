import React from 'react';
import { Letter } from '../types';
import { LetterCard } from './LetterCard';
import { Star, Bookmark } from 'lucide-react';

interface FavoritesViewProps {
  favoriteLetters: Letter[];
  onToggleFavorite: (letter: Letter) => void;
  onReact: (id: string, type: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteLetters,
  onToggleFavorite,
  onReact,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-serif">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-100 flex items-center justify-center gap-2">
          <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
          <span>Your Favorite Letters</span>
        </h2>
        <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80 mt-1">
          A personal keepsake box of words that comforted or inspired you.
        </p>
      </div>

      {favoriteLetters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteLetters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onReact={onReact}
              expandedDefault={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 dark:border-stone-700 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <Bookmark className="w-10 h-10 text-amber-800/40 dark:text-stone-600 mx-auto" />
          <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100">
            Your Keepsake Box is Empty
          </h3>
          <p className="text-xs font-sans text-amber-800/70 dark:text-stone-400 leading-relaxed">
            Whenever you read a letter that touches your heart, click the bookmark icon to save it here for quiet days.
          </p>
        </div>
      )}

    </div>
  );
};
