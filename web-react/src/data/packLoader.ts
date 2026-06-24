import type { QuestionPack } from '../types';

const modules = import.meta.glob('./packs/*.json', { eager: true }) as Record<
  string,
  { default: QuestionPack }
>;

export const AVAILABLE_PACKS: QuestionPack[] = Object.values(modules).map(
  (m) => m.default,
);
