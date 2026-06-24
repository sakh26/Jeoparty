import type React from 'react';

export type TeamId = 'A' | 'B' | 'C' | 'D';

export interface Team {
  id: TeamId;
  name: string;
}

export interface Question {
  id: string;
  level: number;
  points: number;
  targetWord: string;
  hint?: string;
  /** @deprecated Use hint */
  hostNote?: string;
  songTitle?: string;
  artist?: string;
  clue?: string;
  imageUrl?: string;
}

export interface Category {
  name: string;
  questions: Question[];
}

export interface QuestionPack {
  id: string;
  name: string;
  topic: string;
  version: string;
  categories: Category[];
}

export type ColorTheme = 'soft-pink' | 'lavender' | 'rose-gold' | 'midnight' | 'barbie';

export interface GameSettings {
  teams: Team[];
  pointsByLevel: [number, number, number, number, number];
  allowSteals: boolean;
  negativeScoring: boolean;
  showSongMeta: boolean;
  questionTimerSeconds: number | null;
  colorTheme: ColorTheme;
}

export interface ActiveQuestion {
  categoryName: string;
  question: Question;
}

export interface SpotifySession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export type ToastTone = 'info' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

export interface TransitionCard {
  categoryName: string;
  question: Question;
  animating: boolean;
  style: React.CSSProperties & Record<`--${string}`, string>;
}

export interface GameLogEntry {
  timestamp: number;
  questionId: string;
  categoryName: string;
  points: number;
  outcome: 'correct' | 'wrong' | 'steal' | 'no-one';
  teamId: TeamId | null;
  stealTeamId?: TeamId;
}

export interface TopicPlugin {
  id: string;
  name: string;
  description: string;
  icon: string;
  supportsSpotify: boolean;
  supportsImageClues: boolean;
  renderQuestionClue?: (question: Question) => React.ReactNode;
  validatePack?: (pack: QuestionPack) => string[];
}
