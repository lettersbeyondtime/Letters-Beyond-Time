import React, { useState } from 'react';
import { SendLetterFormState, Letter } from '../types';
import { Send, Eye, Check, AlertCircle, Loader2, Sparkles, Heart } from 'lucide-react';

interface SendLetterFormProps {
  onLetterPublished: (letter: Letter) => void;
}

export const SendLetterForm: React.FC<SendLetterFormProps> = ({ onLetterPublished }) => {
  const [form, setForm] = useState<SendLetterFormState>({
    currentAge: 25,
    targetAge: 'Teens',
    feeling: '✨ Tell me I\'ll be okay',
    topics: ['Growing up', 'Self-confidence'],
    title: '',
    lifeLesson: '',
    content: '',
    isAnonymous: true,
    hasConsent: false,
  });

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const targetAgeOptions = [
    'Teens',
    '20s',
    '30s',
    '40s',
    '50s+',
    'Any Age',
  ];

  const feelings = [
    '🌸 Comfort',
    '💪 Motivation',
    '🌈 Hope',
    '✨ Reassurance',
    '🤍 Smile',
    '🌙 Calming',
    '🌻 Inspiration',
    '❤️ Self-Worth',
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

  const toggleTopic = (t: string) => {
    if (form.topics.includes(t)) {
      if (form.topics.length > 1) {
        setForm({ ...form, topics: form.topics.filter((item) => item !== t) });
      }
    } else {
      setForm({ ...form, topics: [...form.topics, t] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.content || form.content.trim().length < 25) {
      setErrorMessage('Please write a letter containing at least 25 characters of heartfelt encouragement.');
      return;
    }

    if (!form.hasConsent) {
      setErrorMessage('Please check the consent box to confirm you share this letter with kindness.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success && data.letter) {
        setSuccessMessage('Your letter has passed review and is now part of the Letters Beyond Time collection!');
        onLetterPublished(data.letter);
        // Reset form content
        setForm({
          ...form,
          title: '',
          lifeLesson: '',
          content: '',
          hasConsent: false,
        });
        setIsPreviewMode(false);
      } else {
        setErrorMessage(data.message || 'Unable to publish letter at this time.');
      }
    } catch (err) {
      console.error('Error publishing letter:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 font-serif">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 dark:text-amber-100 flex items-center justify-center gap-2">
          ✍️ Send a Letter Beyond Time
        </h2>
        <p className="text-sm italic text-amber-800/80 dark:text-amber-300/80 mt-1">
          &ldquo;What do you wish someone had told you when you were younger?&rdquo;
        </p>
      </div>

      <div className="bg-[#fcfaf4] dark:bg-stone-900 border border-amber-900/15 dark:border-stone-700 rounded-3xl p-6 sm:p-10 shadow-lg">
        
        {/* Messages */}
        {errorMessage && (
          <div className="mb-6 bg-rose-100/90 border-l-4 border-rose-500 text-rose-900 p-4 rounded-r-xl text-sm font-sans flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-emerald-100/90 border-l-4 border-emerald-500 text-emerald-900 p-4 rounded-r-xl text-sm font-sans flex items-center gap-2">
            <Check className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Toggle: Form vs Preview */}
        <div className="flex justify-end gap-2 mb-6 border-b border-amber-900/10 dark:border-stone-800 pb-3">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`px-4 py-1.5 rounded-xl text-xs font-sans font-semibold transition-colors ${
              !isPreviewMode
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700'
                : 'text-amber-900/70 dark:text-stone-300 hover:bg-amber-100'
            }`}
          >
            ✏️ Compose
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`px-4 py-1.5 rounded-xl text-xs font-sans font-semibold transition-colors flex items-center gap-1 ${
              isPreviewMode
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700'
                : 'text-amber-900/70 dark:text-stone-300 hover:bg-amber-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview Letter
          </button>
        </div>

        {!isPreviewMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Age & Recipient Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                  Your Current Age
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={form.currentAge}
                  onChange={(e) => setForm({ ...form, currentAge: parseInt(e.target.value, 10) || 18 })}
                  className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                  Who Are You Writing To?
                </label>
                <select
                  value={form.targetAge}
                  onChange={(e) => setForm({ ...form, targetAge: e.target.value })}
                  className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
                >
                  {targetAgeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'Any Age' ? 'Anyone in need' : `To people in their ${opt}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topics Multi-Select */}
            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                Select Topics Covered
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTopics.map((t) => {
                  const isSelected = form.topics.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTopic(t)}
                      className={`px-3 py-1 rounded-full text-xs font-sans transition-colors ${
                        isSelected
                          ? 'bg-amber-800 text-amber-50 dark:bg-amber-600'
                          : 'bg-amber-100/80 dark:bg-stone-800 text-amber-900 dark:text-stone-300 hover:bg-amber-200/60'
                      }`}
                    >
                      #{t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Letter Title (Optional) */}
            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                Letter Title <span className="font-normal opacity-70">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. To Everyone Struggling With Exams Right Now"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-4 py-2.5 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
              />
            </div>

            {/* Letter Body Textarea */}
            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                Your Letter <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={7}
                placeholder="Write your words with empathy, kindness, and warmth. Speak to someone who is where you once stood..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-[#faf7ef] dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-2xl p-4 text-base font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100 shadow-inner"
                required
              />
            </div>

            {/* Life Lesson Quote (Optional) */}
            <div>
              <label className="block text-xs font-sans font-bold text-amber-900 dark:text-amber-200 mb-1">
                Key Life Lesson / Takeaway Quote <span className="font-normal opacity-70">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. You are worth more than any grade on a piece of paper."
                value={form.lifeLesson}
                onChange={(e) => setForm({ ...form, lifeLesson: e.target.value })}
                className="w-full bg-amber-50/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-xl px-4 py-2.5 text-sm font-serif italic focus:outline-none focus:ring-2 focus:ring-amber-700 text-amber-950 dark:text-amber-100"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2 text-xs font-sans text-amber-900/90 dark:text-stone-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                  className="rounded accent-amber-800 w-4 h-4 cursor-pointer"
                />
                <span>Publish anonymously (Default & Recommended)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasConsent}
                  onChange={(e) => setForm({ ...form, hasConsent: e.target.checked })}
                  className="rounded accent-amber-800 w-4 h-4 cursor-pointer"
                  required
                />
                <span>I confirm this letter is written with goodwill and kindness to encourage others.</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 text-amber-50 font-serif font-bold text-base flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Reviewing & Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Publish Letter</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Preview Mode */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#fbf8f1] dark:bg-stone-800 border border-amber-900/15 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-inner">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 mb-4">
                <div className="text-xs font-sans font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Stationery Preview
                </div>
                <div className="text-xs font-sans text-amber-800/60 dark:text-stone-400">
                  Written by a {form.currentAge}-year-old traveler
                </div>
              </div>

              <h3 className="text-xl font-bold text-amber-950 dark:text-amber-100 mb-4">
                {form.title || 'An Anonymous Letter of Hope'}
              </h3>

              <p className="text-base leading-relaxed whitespace-pre-line text-amber-950/90 dark:text-stone-200 mb-6 font-serif">
                {form.content || '(Your letter content will appear here...)'}
              </p>

              {form.lifeLesson && (
                <div className="bg-amber-100/60 dark:bg-stone-900/60 border-l-4 border-amber-600 p-3 rounded-r-xl italic text-sm font-serif text-amber-900 dark:text-amber-200">
                  &ldquo;{form.lifeLesson}&rdquo;
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="px-6 py-2.5 bg-amber-800 text-amber-50 rounded-xl text-sm font-sans font-semibold"
              >
                Return to Editing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
