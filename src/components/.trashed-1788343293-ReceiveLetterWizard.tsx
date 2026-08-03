import React, { useState } from 'react';
import { Letter, ReceiveLetterFormState } from '../types';
import { LetterCard } from './LetterCard';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';

interface ReceiveLetterWizardProps {
  onToggleFavorite: (letter: Letter) => void;
  isFavorite: (id: string) => boolean;
  onReact: (id: string, type: string) => void;
  allLetters: Letter[];
}

export const ReceiveLetterWizard: React.FC<ReceiveLetterWizardProps> = ({
  onToggleFavorite,
  isFavorite,
  onReact,
  allLetters,
}) => {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<ReceiveLetterFormState>({
    currentAge: 18,
    perspective: 'Future Me',
    feeling: '✨ Tell me I\'ll be okay',
    topics: ['Growing up'],
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [receivedLetter, setReceivedLetter] = useState<Letter | null>(null);

  const perspectives = [
    { id: 'Future Me', label: 'Future Me', icon: '⏳', desc: 'A letter from your older self writing back in time' },
    { id: 'Someone who is 25', label: 'Someone who is 25', icon: '🌱', desc: 'Words from someone in their mid-twenties' },
    { id: 'Someone who is 40', label: 'Someone who is 40', icon: '🌿', desc: 'Wisdom from someone navigating adulthood' },
    { id: 'Someone who is 70', label: 'Someone who is 70', icon: '🌳', desc: 'Gentle reflection from an elder who lived it all' },
  ];

  const feelings = [
    { id: '🌸 Comfort me', label: 'Comfort me', icon: '🌸' },
    { id: '💪 Motivate me', label: 'Motivate me', icon: '💪' },
    { id: '🌈 Give me hope', label: 'Give me hope', icon: '🌈' },
    { id: '✨ Tell me I\'ll be okay', label: 'Tell me I\'ll be okay', icon: '✨' },
    { id: '🤍 Make me smile', label: 'Make me smile', icon: '🤍' },
    { id: '🌙 Calm my anxiety', label: 'Calm my anxiety', icon: '🌙' },
    { id: '🌻 Inspire me', label: 'Inspire me', icon: '🌻' },
    { id: '❤️ Remind me I\'m enough', label: 'Remind me I\'m enough', icon: '❤️' },
  ];

  const availableTopics = [
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

  const toggleTopic = (topic: string) => {
    if (form.topics.includes(topic)) {
      if (form.topics.length > 1) {
        setForm({ ...form, topics: form.topics.filter((t) => t !== topic) });
      }
    } else {
      setForm({ ...form, topics: [...form.topics, topic] });
    }
  };

  const handleFetchLetter = async () => {
    setIsLoading(true);
    setStep(5);

    try {
      // 1. First search for a matching human community letter if not explicitly requesting "Future Me"
      if (form.perspective !== 'Future Me') {
        const match = allLetters.find(
          (l) =>
            !l.isAI &&
            l.feeling.toLowerCase().includes(form.feeling.toLowerCase().replace(/[^\w\s]/gi, '').trim()) &&
            l.topics.some((t) => form.topics.includes(t))
        );

        if (match) {
          setTimeout(() => {
            setReceivedLetter(match);
            setIsLoading(false);
          }, 800);
          return;
        }
      }

      // 2. If no exact match or "Future Me" selected -> Request AI server-side generated letter
      const res = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success && data.letter) {
        setReceivedLetter(data.letter);
      } else {
        throw new Error('Failed to generate letter');
      }
    } catch (err) {
      console.error('Error fetching letter:', err);
      // Fallback fallback
      setReceivedLetter({
        id: `ai-letter-fallback-${Date.now()}`,
        authorAge: Number(form.currentAge) + 20,
        targetAge: String(form.currentAge),
        senderPerspective: form.perspective,
        feeling: form.feeling,
        topics: form.topics,
        title: 'A Letter Through Time',
        content: `Dear friend,\n\nI hear you. I know how deeply you are feeling ${form.topics.join(' and ')} right now.\n\nTake a slow, soft breath. You don't have to carry the whole world today. Everything you are passing through right now is preparing you for a life sweeter and broader than you can currently imagine.\n\nYou are going to be more than okay.`,
        lifeLesson: 'Trust the process of becoming yourself.',
        isAI: true,
        createdAt: new Date().toISOString(),
        reactions: { neededThis: 10, feltUnderstood: 8, beautiful: 12, hopeful: 15, madeMeSmile: 7 },
        location: 'Future Perspective',
        waxSealColor: '#d4a359',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setReceivedLetter(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-serif">
      
      {/* Wizard Header Progress */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 dark:text-amber-100">
          📩 Receive a Letter
        </h2>
        <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80 mt-1">
          Tell us what you are walking through, and let wisdom find you.
        </p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-amber-800 dark:bg-amber-500'
                  : s < step
                  ? 'w-2 bg-amber-600 dark:bg-amber-700'
                  : 'w-2 bg-amber-200 dark:bg-stone-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Container Card */}
      <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 dark:border-stone-700 rounded-3xl p-6 sm:p-10 shadow-lg">
        
        {/* STEP 1: Current Age */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="text-center">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Step 1 of 4
              </span>
              <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                Enter your current age
              </h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">
                This helps us find or write a letter tailored to your stage of life.
              </p>
            </div>

            <div className="max-w-xs mx-auto text-center space-y-4 pt-4">
              <div className="text-5xl font-bold text-amber-900 dark:text-amber-200">
                {form.currentAge} <span className="text-xl font-normal text-amber-800/60">years old</span>
              </div>

              <input
                type="range"
                min="10"
                max="95"
                value={form.currentAge}
                onChange={(e) => setForm({ ...form, currentAge: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-800 dark:accent-amber-500 cursor-pointer h-2 rounded-lg bg-amber-200 dark:bg-stone-700"
              />

              <div className="flex justify-between text-xs font-sans text-amber-800/60 dark:text-stone-400">
                <span>10 y/o</span>
                <span>25 y/o</span>
                <span>50 y/o</span>
                <span>80+ y/o</span>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-2xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-sans font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Whose letter */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="text-center">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Step 2 of 4
              </span>
              <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                Whose letter would you like to receive?
              </h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">
                Choose the perspective that speaks most to what you need today.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {perspectives.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setForm({ ...form, perspective: p.id })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    form.perspective === p.id
                      ? 'bg-amber-100/90 border-amber-800 dark:bg-stone-800 dark:border-amber-400 shadow-sm ring-1 ring-amber-800'
                      : 'border-amber-900/15 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{p.icon}</div>
                  <div className="font-bold text-amber-950 dark:text-amber-100 text-sm">
                    {p.label}
                  </div>
                  <div className="text-xs text-amber-800/70 dark:text-stone-400 mt-0.5">
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-amber-800 dark:text-amber-300 font-sans text-sm flex items-center gap-1 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-sans font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Feeling */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="text-center">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Step 3 of 4
              </span>
              <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                Choose the feeling you need right now
              </h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">
                What tone should this letter carry for your heart today?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {feelings.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setForm({ ...form, feeling: f.id })}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    form.feeling === f.id
                      ? 'bg-amber-200/90 border-amber-800 dark:bg-stone-800 dark:border-amber-400 shadow-sm font-bold text-amber-950 dark:text-amber-100'
                      : 'border-amber-900/15 dark:border-stone-700 text-amber-900 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-xs font-sans font-medium">{f.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-amber-800 dark:text-amber-300 font-sans text-sm flex items-center gap-1 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-2xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-sans font-semibold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Choose Topics */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="text-center">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Step 4 of 4
              </span>
              <h3 className="text-2xl font-bold text-amber-950 dark:text-amber-100 mt-1">
                Choose the topics on your mind
              </h3>
              <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">
                Select one or more themes you are navigating right now.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {availableTopics.map((topic) => {
                const isSelected = form.topics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-800 text-amber-50 dark:bg-amber-600 dark:text-amber-50 shadow-sm scale-105'
                        : 'bg-amber-100/70 dark:bg-stone-800 text-amber-900 dark:text-stone-300 hover:bg-amber-200/70'
                    }`}
                  >
                    #{topic}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-amber-800 dark:text-amber-300 font-sans text-sm flex items-center gap-1 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleFetchLetter}
                className="px-8 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 text-amber-50 font-serif font-bold text-base flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                <span>Receive My Letter</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Receive Letter Display */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {isLoading ? (
              <div className="py-16 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-amber-800 dark:text-amber-400 animate-spin mx-auto" />
                <h3 className="text-xl font-bold text-amber-950 dark:text-amber-100">
                  Unfolding words across time...
                </h3>
                <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80">
                  Searching community wisdom and crafting encouragement for your {form.currentAge}-year-old self.
                </p>
              </div>
            ) : receivedLetter ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-amber-900/10 dark:border-stone-800 pb-3">
                  <div className="text-xs font-sans text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>✉️ Your Letter Has Arrived</span>
                  </div>
                  <button
                    onClick={handleStartOver}
                    className="text-xs font-sans text-amber-800/80 dark:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Request Another
                  </button>
                </div>

                <LetterCard
                  letter={receivedLetter}
                  isFavorite={isFavorite(receivedLetter.id)}
                  onToggleFavorite={onToggleFavorite}
                  onReact={onReact}
                  expandedDefault={true}
                />

                <div className="text-center pt-2">
                  <button
                    onClick={handleStartOver}
                    className="px-6 py-2.5 rounded-xl border border-amber-800/30 dark:border-stone-600 text-amber-900 dark:text-amber-200 text-sm font-sans font-medium hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    Request a letter for a different feeling
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
