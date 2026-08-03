import React, { useState } from 'react';
import { ReadingTheme, SoundOption } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  Send, 
  Inbox, 
  Gift, 
  Calendar, 
  Clock, 
  Star, 
  Home,
  Music,
  Palette
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTheme: ReadingTheme;
  setTheme: (theme: ReadingTheme) => void;
  onOpenSurprise: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentTheme,
  setTheme,
  onOpenSurprise,
  favoritesCount,
}) => {
  const [activeSound, setActiveSound] = useState<SoundOption>('none');
  const [soundVolume, setSoundVolume] = useState<number>(0.3);
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const [showSoundMenu, setShowSoundMenu] = useState<boolean>(false);
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);

  const themeOptions: { id: ReadingTheme; label: string; icon: string }[] = [
    { id: 'vintage', label: 'Vintage Paper', icon: '📜' },
    { id: 'rain', label: 'Rain Window', icon: '🌧️' },
    { id: 'sakura', label: 'Sakura Garden', icon: '🌸' },
    { id: 'forest', label: 'Forest Cabin', icon: '🌲' },
    { id: 'starry', label: 'Starry Night', icon: '🌌' },
    { id: 'cafe', label: 'Cozy Café', icon: '☕' },
    { id: 'candlelight', label: 'Candlelight', icon: '🕯️' },
    { id: 'library', label: 'Library', icon: '📚' },
  ];

  const soundOptions: { id: SoundOption; label: string; icon: string }[] = [
    { id: 'none', label: 'Mute', icon: '🔇' },
    { id: 'rain', label: 'Gentle Rain', icon: '🌧️' },
    { id: 'fireplace', label: 'Cozy Fireplace', icon: '🔥' },
    { id: 'piano', label: 'Ambient Piano', icon: '🎹' },
    { id: 'ocean', label: 'Ocean Waves', icon: '🌊' },
    { id: 'birds', label: 'Forest Birds', icon: '🐦' },
    { id: 'cafe', label: 'Café Ambience', icon: '☕' },
    { id: 'wind', label: 'Soft Breeze', icon: '🍃' },
    { id: 'whitenoise', label: 'Pink Noise', icon: '☁️' },
  ];

  const handleSoundSelect = (sound: SoundOption) => {
    setActiveSound(sound);
    if (sound === 'none') {
      soundEngine.stopSound();
      setIsPlayingSound(false);
    } else {
      soundEngine.playSound(sound, soundVolume);
      setIsPlayingSound(true);
    }
  };

  const togglePlaySound = () => {
    if (activeSound === 'none') {
      handleSoundSelect('rain');
    } else if (isPlayingSound) {
      soundEngine.stopSound();
      setIsPlayingSound(false);
    } else {
      soundEngine.playSound(activeSound, soundVolume);
      setIsPlayingSound(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setSoundVolume(vol);
    soundEngine.setVolume(vol);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-amber-50/70 dark:bg-stone-900/80 border-b border-amber-900/10 dark:border-stone-700/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer flex items-center gap-3 group text-center md:text-left"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-stone-800 border border-amber-800/20 dark:border-stone-600 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
              🌿
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-amber-950 dark:text-amber-100 flex items-center justify-center md:justify-start gap-2">
                Letters Beyond Time
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
              </h1>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-serif italic">
                &ldquo;Every YOU has something to say&rdquo;
              </p>
            </div>
          </div>

          {/* Controls: Audio & Theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Background Sound Widget */}
            <div className="relative">
              <div className="flex items-center bg-amber-100/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-full px-3 py-1.5 text-xs text-amber-900 dark:text-amber-200">
                <button
                  onClick={togglePlaySound}
                  className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 mr-2 font-medium"
                  title="Toggle Ambient Audio"
                >
                  {isPlayingSound ? (
                    <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-amber-800/60 dark:text-amber-300/60" />
                  )}
                  <span className="hidden sm:inline">
                    {soundOptions.find((s) => s.id === activeSound)?.label || 'Audio'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowSoundMenu(!showSoundMenu);
                    setShowThemeMenu(false);
                  }}
                  className="border-l border-amber-900/15 dark:border-stone-600 pl-2 text-amber-800 hover:text-amber-950 dark:text-amber-300"
                >
                  <Music className="w-3.5 h-3.5" />
                </button>
              </div>

              {showSoundMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-amber-50 dark:bg-stone-900 border border-amber-900/20 dark:border-stone-700 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-900/10 dark:border-stone-800">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-amber-600" /> Ambient Sounds
                    </span>
                    <span className="text-[10px] text-amber-700/60 dark:text-amber-400/60">Synthesized</span>
                  </div>

                  <div className="space-y-1 mb-3">
                    {soundOptions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          handleSoundSelect(s.id);
                          setShowSoundMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          activeSound === s.id
                            ? 'bg-amber-200/80 dark:bg-stone-800 text-amber-950 dark:text-amber-100 font-semibold'
                            : 'hover:bg-amber-100 dark:hover:bg-stone-800/50 text-amber-900/80 dark:text-amber-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{s.icon}</span>
                          <span>{s.label}</span>
                        </span>
                        {activeSound === s.id && isPlayingSound && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </button>
                    ))}
                  </div>

                  {activeSound !== 'none' && (
                    <div className="pt-2 border-t border-amber-900/10 dark:border-stone-800">
                      <div className="flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-300 mb-1">
                        <span>Volume</span>
                        <span>{Math.round(soundVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={soundVolume}
                        onChange={handleVolumeChange}
                        className="w-full accent-amber-700 cursor-pointer h-1.5 rounded-lg bg-amber-200 dark:bg-stone-700"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reading Theme Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowSoundMenu(false);
                }}
                className="flex items-center gap-1.5 bg-amber-100/80 dark:bg-stone-800 border border-amber-900/20 dark:border-stone-700 rounded-full px-3 py-1.5 text-xs text-amber-900 dark:text-amber-200 hover:bg-amber-200/60 transition-colors"
                title="Change Reading Theme"
              >
                <Palette className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                <span className="hidden sm:inline font-medium">
                  {themeOptions.find((t) => t.id === currentTheme)?.label || 'Theme'}
                </span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-amber-50 dark:bg-stone-900 border border-amber-900/20 dark:border-stone-700 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-bold text-amber-900 dark:text-amber-200 px-2 py-1 mb-1 border-b border-amber-900/10 dark:border-stone-800">
                    Reading Experience
                  </div>
                  <div className="space-y-0.5">
                    {themeOptions.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentTheme === t.id
                            ? 'bg-amber-200/80 dark:bg-stone-800 text-amber-950 dark:text-amber-100 font-semibold'
                            : 'hover:bg-amber-100 dark:hover:bg-stone-800/50 text-amber-900/80 dark:text-amber-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{t.icon}</span>
                          <span>{t.label}</span>
                        </span>
                        {currentTheme === t.id && <span className="text-amber-700 dark:text-amber-400">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-3 pt-2 border-t border-amber-900/10 dark:border-stone-800 flex items-center justify-center sm:justify-start gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'home'
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700 shadow-sm'
                : 'text-amber-900/80 dark:text-amber-200/80 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>

          <button
            onClick={() => setActiveTab('receive')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'receive'
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700 shadow-sm'
                : 'text-amber-900/80 dark:text-amber-200/80 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" /> Receive
          </button>

          <button
            onClick={() => setActiveTab('send')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'send'
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700 shadow-sm'
                : 'text-amber-900/80 dark:text-amber-200/80 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'library'
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700 shadow-sm'
                : 'text-amber-900/80 dark:text-amber-200/80 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Library
          </button>

          <button
            onClick={onOpenSurprise}
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap text-amber-800 dark:text-amber-300 hover:bg-amber-200/60 dark:hover:bg-stone-800 transition-all border border-amber-800/20 dark:border-stone-700"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" /> Surprise
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'daily'
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700 shadow-sm'
                : 'text-amber-900/80 dark:text-amber-200/80 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Daily Letter
          </button>

          <button
            onClick={() => setActiveTab('future')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'future'
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700 shadow-sm'
                : 'text-amber-900/80 dark:text-amber-200/80 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Future Me
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'favorites'
                ? 'bg-amber-800 text-amber-50 dark:bg-amber-700 shadow-sm'
                : 'text-amber-900/80 dark:text-amber-200/80 hover:bg-amber-100/60 dark:hover:bg-stone-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Favorites ({favoritesCount})
          </button>
        </nav>
      </div>
    </header>
  );
};
