import React, { useState } from 'react';
import { Letter } from '../types';
import { LetterCard } from './LetterCard';
import { Gift, X, Sparkles } from 'lucide-react';

interface SurpriseLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: Letter[];
  onToggleFavorite: (letter: Letter) => void;
  isFavorite: (id: string) => boolean;
  onReact: (id: string, type: string) => void;
}

export const SurpriseLetterModal: React.FC<SurpriseLetterModalProps> = ({
  isOpen,
  onClose,
  letters,
  onToggleFavorite,
  isFavorite,
  onReact,
}) => {
  const [surpriseLetter, setSurpriseLetter] = useState<Letter | null>(null);
  const [isUnsealing, setIsUnsealing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDrawSurprise = () => {
    setIsUnsealing(true);
    setTimeout(() => {
      if (letters.length > 0) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        setSurpriseLetter(letters[randomIndex]);
      }
      setIsUnsealing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/20 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-2xl font-serif max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800 text-amber-900 dark:text-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 text-2xl mb-2 shadow-inner">
            🎁
          </div>
          <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100">
            Surprise Gift Letter
          </h3>
          <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80 mt-1">
            &ldquo;I don&apos;t mind who it&apos;s from.&rdquo;
          </p>
        </div>

        {!surpriseLetter ? (
          <div className="text-center py-10 space-y-6">
            <p className="text-base text-amber-900/80 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              Step away from expectations. Open a random envelope written by a stranger somewhere across time who left words you might need to hear today.
            </p>

            <button
              onClick={handleDrawSurprise}
              disabled={isUnsealing}
              className="px-8 py-4 rounded-2xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              {isUnsealing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
                  <span>Unsealing Envelope...</span>
                </>
              ) : (
                <>
                  <span>💌 Unseal Surprise Letter</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <LetterCard
              letter={surpriseLetter}
              isFavorite={isFavorite(surpriseLetter.id)}
              onToggleFavorite={onToggleFavorite}
              onReact={onReact}
              expandedDefault={true}
            />

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleDrawSurprise}
                className="px-6 py-2.5 rounded-xl bg-amber-800 text-amber-50 text-sm font-sans font-semibold hover:bg-amber-900 transition-colors"
              >
                Draw Another Surprise 🎁
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
