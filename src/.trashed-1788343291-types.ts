export type ReadingTheme = 
  | 'vintage' 
  | 'rain' 
  | 'sakura' 
  | 'forest' 
  | 'starry' 
  | 'cafe' 
  | 'candlelight' 
  | 'library';

export type SoundOption = 
  | 'none' 
  | 'rain' 
  | 'fireplace' 
  | 'piano' 
  | 'ocean' 
  | 'birds' 
  | 'cafe' 
  | 'wind' 
  | 'whitenoise';

export interface ReactionCounts {
  neededThis: number;
  feltUnderstood: number;
  beautiful: number;
  hopeful: number;
  madeMeSmile: number;
}

export interface Letter {
  id: string;
  authorAge: number;
  targetAge: string; // e.g. "18", "Teens", "20s", "40s", "Any"
  senderPerspective: string; // e.g., "Future Me (Age 35)", "Someone who is 70", "A 28-year-old sister"
  feeling: string; // e.g., "Comfort me", "Give me hope", "Calm my anxiety"
  topics: string[];
  title: string;
  content: string;
  lifeLesson?: string;
  isAI: boolean;
  createdAt: string;
  reactions: ReactionCounts;
  location?: string;
  waxSealColor?: string;
}

export interface ReceiveLetterFormState {
  currentAge: number;
  perspective: string; // "Future Me", "Someone who is 25", "Someone who is 40", "Someone who is 70"
  customPerspectiveAge?: number;
  feeling: string;
  topics: string[];
}

export interface SendLetterFormState {
  currentAge: number;
  targetAge: string;
  feeling: string;
  topics: string[];
  title: string;
  lifeLesson: string;
  content: string;
  isAnonymous: boolean;
  hasConsent: boolean;
}

export interface FutureMeLetter {
  id: string;
  writtenAt: string;
  unlockDate: string;
  currentAge: number;
  futureAge: number;
  title: string;
  content: string;
  isUnlocked: boolean;
}

export interface ModerationResult {
  isApproved: boolean;
  reason?: string;
}
