import type { Category, Question, QuestionPack } from '../types';

export function mapPoints(
  categories: Category[],
  pointsByLevel: [number, number, number, number, number],
): Category[] {
  return categories.map((category) => ({
    ...category,
    questions: category.questions.map((q) => ({
      ...q,
      points: pointsByLevel[q.level - 1] ?? q.level * 100,
    })),
  }));
}

export function computeProgress(pack: QuestionPack, usedIds: Set<string>): number {
  const total = pack.categories.reduce((acc, c) => acc + c.questions.length, 0);
  if (total === 0) return 0;
  return Math.round((usedIds.size / total) * 100);
}

export function isPackFinished(pack: QuestionPack, usedIds: Set<string>): boolean {
  return pack.categories.every((c) =>
    c.questions.every((q) => usedIds.has(q.id)),
  );
}

export function getQuestionById(pack: QuestionPack, id: string): Question | undefined {
  for (const category of pack.categories) {
    const q = category.questions.find((q) => q.id === id);
    if (q) return q;
  }
  return undefined;
}
