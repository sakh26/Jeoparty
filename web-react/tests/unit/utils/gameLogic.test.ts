import { describe, it, expect } from 'vitest';
import { mapPoints, computeProgress, isPackFinished } from '../../../src/utils/gameLogic';
import { MOCK_PACK } from '../../fixtures';

describe('mapPoints', () => {
  const points: [number, number, number, number, number] = [100, 200, 300, 400, 500];

  it('maps level to correct point value', () => {
    const result = mapPoints(MOCK_PACK.categories, points);
    expect(result[0]?.questions[0]?.points).toBe(100); // level 1 → 100
    expect(result[0]?.questions[1]?.points).toBe(200); // level 2 → 200
    expect(result[0]?.questions[4]?.points).toBe(500); // level 5 → 500
  });

  it('falls back to level * 100 when pointsByLevel is too short', () => {
    const shortPoints: [number, number, number, number, number] = [100, 200, 300, 400, 500];
    const category = [{ name: 'Test', questions: [{ id: 'x', level: 3, points: 0, targetWord: 'hi' }] }];
    const result = mapPoints(category, shortPoints);
    expect(result[0]?.questions[0]?.points).toBe(300);
  });

  it('does not mutate the input categories', () => {
    const original = structuredClone(MOCK_PACK.categories);
    mapPoints(MOCK_PACK.categories, points);
    expect(MOCK_PACK.categories[0]?.questions[0]?.points).toBe(original[0]?.questions[0]?.points);
  });

  it('preserves all other question fields', () => {
    const result = mapPoints(MOCK_PACK.categories, points);
    const q = result[0]?.questions[0];
    expect(q?.id).toBe('a-1');
    expect(q?.targetWord).toBe('cat');
    expect(q?.songTitle).toBe('Cat Song');
  });
});

describe('computeProgress', () => {
  it('returns 0 when no questions are used', () => {
    expect(computeProgress(MOCK_PACK, new Set())).toBe(0);
  });

  it('returns 100 when all questions are used', () => {
    const allIds = MOCK_PACK.categories.flatMap((c) => c.questions.map((q) => q.id));
    expect(computeProgress(MOCK_PACK, new Set(allIds))).toBe(100);
  });

  it('returns 50 when half the questions are used', () => {
    const halfIds = MOCK_PACK.categories[0]!.questions.map((q) => q.id);
    expect(computeProgress(MOCK_PACK, new Set(halfIds))).toBe(50);
  });
});

describe('isPackFinished', () => {
  it('returns false when questions remain', () => {
    expect(isPackFinished(MOCK_PACK, new Set())).toBe(false);
  });

  it('returns true when all questions are used', () => {
    const allIds = MOCK_PACK.categories.flatMap((c) => c.questions.map((q) => q.id));
    expect(isPackFinished(MOCK_PACK, new Set(allIds))).toBe(true);
  });
});
