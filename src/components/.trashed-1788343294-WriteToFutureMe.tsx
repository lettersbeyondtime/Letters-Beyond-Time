import React, { useState, useEffect } from 'react';
import { FutureMeLetter } from '../types';
import { Clock, Lock, Unlock, Send, Sparkles, Check, Trash2 } from 'lucide-react';

export const WriteToFutureMe: React.FC = () => {
  const [letters, setLetters] = useState<FutureMeLetter[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [currentAge, setCurrentAge] = useState<number>(20);
  const [unlockYears, setUnlockYears] = useState<number>(1);
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('future_me_letters');
    if (saved) {
      try {
        setLetters(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveToLocalStorage = (list: FutureMeLetter[]) => {
    setLetters(list);
    localStorage.setItem('future_me_letters', JSON.stringify(list));
  };

  const handleCreateFutureLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const now = new Date();
    const unlockDate = new Date();
    unlockDate.setFullYear(now.getFullYear() + unlockYears);

    const newLetter: FutureMeLetter = {
      id: `future-letter-${Date.now()}`,
      writtenAt: now.toISOString(),
      unlockDate: unlockDate.toISOString(),
      currentAge,
      futureAge: currentAge + unlockYears,
      title: title || `Letter to My ${currentAge + unlockYears}-Year-Old Self`,
      content,
      isUnlocked: false,
    };

    const updated = [newLetter, ...letters];
    saveToLocalStorage(updated);

    setTitle('');
    setContent('');
    setSuccessMsg(`Your letter has been sealed into a time capsule! It will unlock in ${unlockYears} year(s).`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteLetter = (id: string) => {
    const updated = letters.filter((l) => l.id !== id);
    saveToLocalStorage(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-serif">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-950 dark:text-amber-100 flex items-center justify-center gap-2">
          <Clock className="w-7 h-7 text-amber-800 dark:text-amber-400" />
          <span>Write to Future Me</span>
        </h2>
        <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80 mt-1">
          Lock a message into a digital time capsule that will unlock years down the road.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Write Form */}
        <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-md">
          <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 mb-4 flex items-center gap-2">
            <span>✍️ Seal a Time Capsule Letter</span>
          </h3>

          {successMsg && (
            <div className="mb-4 bg-emerald-100 border-l-4 border-emerald-500 text-emerald-900 p-3 rounded-r-xl text-xs font-sans flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateFutureLetter} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                Your Current Age
              </label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(parseInt(e.target.value, 10) || 18)}
                className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                When Should This Unlock?
              </label>
              <select
                value={unlockYears}
                onChange={(e) => setUnlockYears(parseInt(e.target.value, 10))}
                className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
              >
                <option value={1}>1 Year from now (When you are {currentAge + 1})</option>
                <option value={3}>3 Years from now (When you are {currentAge + 3})</option>
                <option value={5}>5 Years from now (When you are {currentAge + 5})</option>
                <option value={10}>10 Years from now (When you are {currentAge + 10})</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                Capsule Title
              </label>
              <input
                type="text"
                placeholder="e.g. Read this on your 25th Birthday!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-3 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                Your Letter Content
              </label>
              <textarea
                rows={6}
                placeholder="What are your dreams right now? What are you afraid of? What do you hope your future self has accomplished?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#faf7ef] dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl p-3 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100 shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-serif font-bold text-sm shadow flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>Seal Time Capsule</span>
            </button>
          </form>
        </div>

        {/* Sealed Capsules List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
            <span>⌛ Sealed Capsules ({letters.length})</span>
          </h3>

          {letters.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {letters.map((item) => {
                const isNowUnlocked = new Date() >= new Date(item.unlockDate);

                return (
                  <div
                    key={item.id}
                    className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 dark:border-stone-700 rounded-2xl p-5 shadow-sm space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isNowUnlocked ? (
                          <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-sans font-bold">
                            <Unlock className="w-3 h-3" /> Unlocked!
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-900 dark:bg-stone-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-sans font-bold">
                            <Lock className="w-3 h-3 text-amber-700" /> Sealed
                          </span>
                        )}
                        <span className="text-xs text-amber-800/70 dark:text-stone-400 font-sans">
                          Written at age {item.currentAge} → Unlocks at age {item.futureAge}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteLetter(item.id)}
                        className="p-1 hover:bg-rose-100 text-rose-700 rounded transition-colors"
                        title="Delete capsule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-base text-amber-950 dark:text-amber-100">
                      {item.title}
                    </h4>

                    {isNowUnlocked ? (
                      <p className="text-sm font-serif text-amber-950/90 dark:text-stone-200 whitespace-pre-line border-l-2 border-emerald-500 pl-3 my-2">
                        {item.content}
                      </p>
                    ) : (
                      <div className="bg-amber-100/50 dark:bg-stone-800/50 p-4 rounded-xl text-center border border-dashed border-amber-900/20 my-2">
                        <Lock className="w-6 h-6 text-amber-700 dark:text-amber-400 mx-auto mb-1" />
                        <p className="text-xs font-sans text-amber-900/80 dark:text-amber-300">
                          This letter is safely locked in time until{' '}
                          {new Date(item.unlockDate).toLocaleDateString()}.
                        </p>
                      </div>
                    )}

                    <div className="text-[11px] font-sans text-amber-800/60 dark:text-stone-500">
                      Written on {new Date(item.writtenAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 rounded-3xl p-8 text-center text-xs font-sans text-amber-800/70 dark:text-stone-400">
              No time capsule letters created yet. Write a message to your future self on the left!
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
