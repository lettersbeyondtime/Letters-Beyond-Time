import React, { useState, useEffect } from 'react';
import { Letter, ReadingTheme } from './types';
import { INITIAL_LETTERS } from './data/initialLetters';
import { ThemeWrapper } from './components/ThemeWrapper';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ReceiveLetterWizard } from './components/ReceiveLetterWizard';
import { SendLetterForm } from './components/SendLetterForm';
import { LetterLibrary } from './components/LetterLibrary';
import { DailyLetterView } from './components/DailyLetterView';
import { WriteToFutureMe } from './components/WriteToFutureMe';
import { FavoritesView } from './components/FavoritesView';
import { SurpriseLetterModal } from './components/SurpriseLetterModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentTheme, setCurrentTheme] = useState<ReadingTheme>('vintage');
  const [letters, setLetters] = useState<Letter[]>(INITIAL_LETTERS);
  const [dailyLetter, setDailyLetter] = useState<Letter | null>(INITIAL_LETTERS[0]);
  const [randomLetter, setRandomLetter] = useState<Letter | null>(INITIAL_LETTERS[1]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState<boolean>(false);

  // Load community letters & daily letter from server API
  useEffect(() => {
    fetch('/api/letters')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.letters) {
          setLetters(data.letters);
        }
      })
      .catch((err) => console.log('Using initial client letters:', err));

    fetch('/api/daily-letter')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.letter) {
          setDailyLetter(data.letter);
        }
      })
      .catch((err) => console.log('Using default daily letter:', err));

    // Load saved favorites
    const savedFavs = localStorage.getItem('lbt_favorites');
    if (savedFavs) {
      try {
        setFavoriteIds(JSON.parse(savedFavs));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleToggleFavorite = (letter: Letter) => {
    let updated: string[];
    if (favoriteIds.includes(letter.id)) {
      updated = favoriteIds.filter((id) => id !== letter.id);
    } else {
      updated = [...favoriteIds, letter.id];
    }
    setFavoriteIds(updated);
    localStorage.setItem('lbt_favorites', JSON.stringify(updated));
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const handleReact = async (letterId: string, reactionType: string) => {
    // Update locally
    setLetters((prev) =>
      prev.map((l) => {
        if (l.id === letterId) {
          const updatedReactions = { ...l.reactions };
          const key = reactionType as keyof typeof l.reactions;
          if (typeof updatedReactions[key] === 'number') {
            updatedReactions[key] += 1;
          }
          return { ...l, reactions: updatedReactions };
        }
        return l;
      })
    );

    if (dailyLetter && dailyLetter.id === letterId) {
      const updated = { ...dailyLetter.reactions };
      const key = reactionType as keyof typeof dailyLetter.reactions;
      if (typeof updated[key] === 'number') updated[key] += 1;
      setDailyLetter({ ...dailyLetter, reactions: updated });
    }

    if (randomLetter && randomLetter.id === letterId) {
      const updated = { ...randomLetter.reactions };
      const key = reactionType as keyof typeof randomLetter.reactions;
      if (typeof updated[key] === 'number') updated[key] += 1;
      setRandomLetter({ ...randomLetter, reactions: updated });
    }

    try {
      await fetch('/api/letters/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterId, reactionType }),
      });
    } catch {
      // ignore
    }
  };

  const handlePullRandomLetter = () => {
    if (letters.length > 0) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      setRandomLetter(letters[randomIndex]);
    }
  };

  const handleLetterPublished = (newLetter: Letter) => {
    setLetters((prev) => [newLetter, ...prev]);
  };

  const favoriteLetters = letters.filter((l) => favoriteIds.includes(l.id));

  return (
    <ThemeWrapper theme={currentTheme}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
        favoritesCount={favoriteIds.length}
      />

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-160px)] pb-20">
        {activeTab === 'home' && (
          <Hero
            onReceiveClick={() => setActiveTab('receive')}
            onSendClick={() => setActiveTab('send')}
            onBrowseClick={() => setActiveTab('library')}
            dailyLetter={dailyLetter}
            randomLetter={randomLetter}
            onPullRandomLetter={handlePullRandomLetter}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onReact={handleReact}
            onOpenSurprise={() => setIsSurpriseOpen(true)}
          />
        )}

        {activeTab === 'receive' && (
          <ReceiveLetterWizard
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onReact={handleReact}
            allLetters={letters}
          />
        )}

        {activeTab === 'send' && (
          <SendLetterForm onLetterPublished={handleLetterPublished} />
        )}

        {activeTab === 'library' && (
          <LetterLibrary
            letters={letters}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onReact={handleReact}
          />
        )}

        {activeTab === 'daily' && (
          <DailyLetterView
            dailyLetter={dailyLetter}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onReact={handleReact}
          />
        )}

        {activeTab === 'future' && <WriteToFutureMe />}

        {activeTab === 'favorites' && (
          <FavoritesView
            favoriteLetters={favoriteLetters}
            onToggleFavorite={handleToggleFavorite}
            onReact={handleReact}
          />
        )}
      </main>

      {/* Surprise Letter Modal */}
      <SurpriseLetterModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        letters={letters}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
        onReact={handleReact}
      />

      {/* Footer */}
      <footer className="border-t border-amber-900/10 dark:border-stone-800 py-8 px-4 text-center font-serif text-xs text-amber-900/70 dark:text-stone-400 space-y-2">
        <p className="font-medium text-sm text-amber-950 dark:text-amber-100">
          Letters Beyond Time 🌿
        </p>
        <p className="italic">
          &ldquo;To remind people that every difficult moment is temporary and that someone has words you need to hear today.&rdquo;
        </p>
        <p className="text-[11px] opacity-75">
          100% Anonymous & Kindness Moderated • Powered by Real Stories & Compassionate AI
        </p>
      </footer>
    </ThemeWrapper>
  );
}
