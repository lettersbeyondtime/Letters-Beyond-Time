import React, { useState } from 'react';
import { Letter } from '../types';
import { LetterCard } from './LetterCard';
import { Search, Filter, BookOpen } from 'lucide-react';

interface LetterLibraryProps {
  letters: Letter[];
  onToggleFavorite: (letter: Letter) => void;
  isFavorite: (id: string) => boolean;
  onReact: (id: string, type: string) => void;
}

export const LetterLibrary: React.FC<LetterLibraryProps> = ({
  letters,
  onToggleFavorite,
  isFavorite,
  onReact,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedFeeling, setSelectedFeeling] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const ageCategories = ['All', 'Teens', '20s', '30s', '40s', '50s+'];

  const topicsList = [
    'All',
    'School',
    'Exams',
    'Friendship',
    'Family',
    'Self-confidence',
    'Career',
    'Dreams',
    'Failure',
    'Loneliness',
    'Healing',
    'Happiness',
    'Love',
    'Identity',
    'Growing up',
  ];

  const feelingsList = [
    'All',
    'Comfort',
    'Motivate',
    'Hope',
    'OK',
    'Smile',
    'Anxiety',
    'Inspire',
    'Enough',
  ];

  const filteredLetters = letters.filter((letter) => {
    // Search filter
    if (searchTerm.trim().length > 0) {
      const q = searchTerm.toLowerCase();
      const matchQuery =
        letter.title.toLowerCase().includes(q) ||
        letter.content.toLowerCase().includes(q) ||
        (letter.lifeLesson && letter.lifeLesson.toLowerCase().includes(q)) ||
        letter.topics.some((t) => t.toLowerCase().includes(q));
      if (!matchQuery) return false;
    }

    // Age filter
    if (selectedAge !== 'All') {
      if (selectedAge === 'Teens' && (letter.authorAge < 13 || letter.authorAge > 19)) return false;
      if (selectedAge === '20s' && (letter.authorAge < 20 || letter.authorAge > 29)) return false;
      if (selectedAge === '30s' && (letter.authorAge < 30 || letter.authorAge > 39)) return false;
      if (selectedAge === '40s' && (letter.authorAge < 40 || letter.authorAge > 49)) return false;
      if (selectedAge === '50s+' && letter.authorAge < 50) return false;
    }

    // Topic filter
    if (selectedTopic !== 'All') {
      if (!letter.topics.some((t) => t.toLowerCase() === selectedTopic.toLowerCase())) return false;
    }

    // Feeling filter
    if (selectedFeeling !== 'All') {
      if (!letter.feeling.toLowerCase().includes(selectedFeeling.toLowerCase())) return false;
    }

    // Source filter
    if (selectedSource === 'Human' && letter.isAI) return false;
    if (selectedSource === 'AI' && !letter.isAI) return false;

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-serif">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-100 flex items-center justify-center gap-2">
          <BookOpen className="w-7 h-7 text-amber-800 dark:text-amber-400" />
          <span>Letter Collection & Library</span>
        </h2>
        <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80 mt-1">
          Explore a growing archive of wisdom, hope, and kindness shared across generations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 dark:border-stone-700 rounded-3xl p-5 mb-8 shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-amber-800/60 dark:text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search letters by keyword, title, or life lesson..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-2xl pl-12 pr-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
          
          {/* Age Category */}
          <div>
            <label className="block text-amber-900 dark:text-amber-200 font-bold mb-1">
              Author Age
            </label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-950 dark:text-amber-100"
            >
              {ageCategories.map((a) => (
                <option key={a} value={a}>
                  {a === 'All' ? 'All Ages' : `Author in ${a}`}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-amber-900 dark:text-amber-200 font-bold mb-1">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-950 dark:text-amber-100"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Topics' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Feeling */}
          <div>
            <label className="block text-amber-900 dark:text-amber-200 font-bold mb-1">
              Feeling
            </label>
            <select
              value={selectedFeeling}
              onChange={(e) => setSelectedFeeling(e.target.value)}
              className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-950 dark:text-amber-100"
            >
              {feelingsList.map((f) => (
                <option key={f} value={f}>
                  {f === 'All' ? 'All Feelings' : f}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-amber-900 dark:text-amber-200 font-bold mb-1">
              Source
            </label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-950 dark:text-amber-100"
            >
              <option value="All">All Sources</option>
              <option value="Human">Community (Human)</option>
              <option value="AI">Future Self (AI)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 font-sans text-xs text-amber-900/80 dark:text-amber-300">
        <span>Showing {filteredLetters.length} letter(s)</span>
        {(searchTerm || selectedAge !== 'All' || selectedTopic !== 'All' || selectedFeeling !== 'All' || selectedSource !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedAge('All');
              setSelectedTopic('All');
              setSelectedFeeling('All');
              setSelectedSource('All');
            }}
            className="text-amber-800 dark:text-amber-400 hover:underline"
          >
            Reset Filters ↺
          </button>
        )}
      </div>

      {/* Letters Grid */}
      {filteredLetters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLetters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              isFavorite={isFavorite(letter.id)}
              onToggleFavorite={onToggleFavorite}
              onReact={onReact}
              expandedDefault={false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 rounded-3xl p-12 text-center space-y-3">
          <p className="text-base font-serif italic text-amber-900/70 dark:text-stone-400">
            No letters found matching your selected search or filters.
          </p>
          <p className="text-xs font-sans text-amber-800/60 dark:text-stone-500">
            Try adjusting your search query or reset your filters above.
          </p>
        </div>
      )}

    </div>
  );
};
