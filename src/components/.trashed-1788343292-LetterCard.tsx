import React, { useState } from 'react';
import { Letter } from '../types';
import { 
  Heart, 
  Smile, 
  Sparkles, 
  Bookmark, 
  Share2, 
  Check, 
  MapPin, 
  Bot, 
  User, 
  Quote 
} from 'lucide-react';

interface LetterCardProps {
  letter: Letter;
  isFavorite: boolean;
  onToggleFavorite: (letter: Letter) => void;
  onReact: (letterId: string, reactionType: string) => void;
  expandedDefault?: boolean;
}

export const LetterCard: React.FC<LetterCardProps> = ({
  letter,
  isFavorite,
  onToggleFavorite,
  onReact,
  expandedDefault = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(expandedDefault);
  const [copied, setCopied] = useState<boolean>(false);
  const [userReacted, setUserReacted] = useState<Record<string, boolean>>({});

  const handleCopy = () => {
    const textToCopy = `"${letter.title}"\n\n${letter.content}\n\n— ${letter.senderPerspective}\nLetters Beyond Time`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReactionClick = (type: string) => {
    if (!userReacted[type]) {
      onReact(letter.id, type);
      setUserReacted((prev) => ({ ...prev, [type]: true }));
    }
  };

  const reactionsList = [
    { key: 'neededThis', label: 'I needed this', icon: '❤️' },
    { key: 'feltUnderstood', label: 'I felt understood', icon: '🫂' },
    { key: 'beautiful', label: 'Beautiful', icon: '🌸' },
    { key: 'hopeful', label: 'Hopeful', icon: '✨' },
    { key: 'madeMeSmile', label: 'It made me smile', icon: '😊' },
  ];

  return (
    <div className="group relative bg-[#fbf8f1] dark:bg-stone-800/90 text-amber-950 dark:text-stone-100 border border-amber-900/15 dark:border-stone-700/80 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 font-serif">
      
      {/* Stationery Paper Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/10 dark:border-stone-700 pb-4 mb-5">
        
        {/* Left Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Wax Seal / Age Stamp */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-amber-50 font-bold text-xs shadow-md border-2 border-white/20"
            style={{ backgroundColor: letter.waxSealColor || '#a84232' }}
            title={`Written by ${letter.senderPerspective}`}
          >
            {letter.authorAge}y
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-amber-900 dark:text-amber-200">
              {letter.isAI ? (
                <span className="flex items-center gap-1 bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full text-[11px] border border-amber-400/30">
                  <Bot className="w-3 h-3 text-amber-700 dark:text-amber-400" /> AI Future Self
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full text-[11px] border border-emerald-400/30">
                  <User className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> Community Letter
                </span>
              )}
              <span className="text-amber-800/60 dark:text-stone-400 font-serif font-normal">
                to {letter.targetAge === 'Any' ? 'Anyone' : `age ${letter.targetAge}`}
              </span>
            </div>

            <p className="text-[11px] text-amber-800/70 dark:text-stone-400 flex items-center gap-1 mt-0.5">
              <span>{letter.senderPerspective}</span>
              {letter.location && (
                <span className="flex items-center gap-0.5 text-amber-700/80 dark:text-amber-400 ml-1">
                  • <MapPin className="w-2.5 h-2.5 inline" /> {letter.location}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(letter)}
            className={`p-2 rounded-full transition-colors border ${
              isFavorite
                ? 'bg-amber-100 border-amber-400 text-amber-600 dark:bg-stone-700'
                : 'border-amber-900/10 dark:border-stone-700 hover:bg-amber-100/50 dark:hover:bg-stone-700 text-amber-800/60 dark:text-stone-400'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-full border border-amber-900/10 dark:border-stone-700 hover:bg-amber-100/50 dark:hover:bg-stone-700 text-amber-800/60 dark:text-stone-400 transition-colors"
            title="Copy letter"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Topics & Feeling Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="text-[11px] bg-amber-100/90 dark:bg-stone-700 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-md font-sans">
          {letter.feeling}
        </span>
        {letter.topics.map((t, idx) => (
          <span
            key={idx}
            className="text-[11px] bg-amber-900/5 dark:bg-stone-800 text-amber-800 dark:text-stone-300 px-2.5 py-0.5 rounded-md font-sans border border-amber-900/10 dark:border-stone-700"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Letter Title */}
      <h3 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-lg sm:text-xl font-serif font-bold text-amber-950 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer mb-3 leading-snug transition-colors"
      >
        {letter.title}
      </h3>

      {/* Main Letter Body */}
      {isExpanded && (
        <div className="space-y-4 text-amber-950/90 dark:text-stone-200 text-base leading-relaxed tracking-wide whitespace-pre-line border-l-2 border-amber-800/20 dark:border-amber-400/30 pl-4 my-4 font-serif">
          {letter.content}
        </div>
      )}

      {/* Life Lesson Callout Quote */}
      {letter.lifeLesson && isExpanded && (
        <div className="my-5 bg-amber-100/60 dark:bg-stone-900/60 border-l-4 border-amber-600 dark:border-amber-500 rounded-r-2xl p-4 flex items-start gap-3">
          <Quote className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm font-serif italic text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
            &ldquo;{letter.lifeLesson}&rdquo;
          </p>
        </div>
      )}

      {/* Expand/Collapse Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-sans text-amber-800/80 dark:text-amber-300 hover:underline"
        >
          {isExpanded ? 'Fold letter ▲' : 'Unfold letter ▼'}
        </button>
      </div>

      {/* Reactions Bar */}
      <div className="pt-4 border-t border-amber-900/10 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-sans text-amber-800/70 dark:text-stone-400 font-medium">
          Leave a reaction:
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {reactionsList.map((r) => {
            const count = (letter.reactions && letter.reactions[r.key as keyof typeof letter.reactions]) || 0;
            const reacted = userReacted[r.key];
            return (
              <button
                key={r.key}
                onClick={() => handleReactionClick(r.key)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 font-sans ${
                  reacted
                    ? 'bg-amber-200 border-amber-400 text-amber-950 font-bold scale-105'
                    : 'bg-amber-50/80 dark:bg-stone-700/80 border-amber-900/15 dark:border-stone-600 text-amber-900/80 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-700'
                }`}
                title={r.label}
              >
                <span>{r.icon}</span>
                <span>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
