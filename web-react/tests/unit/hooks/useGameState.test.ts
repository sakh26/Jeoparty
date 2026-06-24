import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from '../../../src/hooks/useGameState';
import { MOCK_PACK, MOCK_SETTINGS } from '../../fixtures';
import type { ActiveQuestion } from '../../../src/types';

beforeEach(() => {
  localStorage.clear();
});

const firstQuestion = MOCK_PACK.categories[0]!.questions[0]!;
const firstActive: ActiveQuestion = {
  categoryName: 'Animals',
  question: { ...firstQuestion, points: 100 },
};

function setup() {
  return renderHook(() => useGameState(MOCK_PACK, MOCK_SETTINGS));
}

describe('useGameState — initial state', () => {
  it('starts with all scores at 0', () => {
    const { result } = setup();
    expect(result.current.scores.A).toBe(0);
    expect(result.current.scores.B).toBe(0);
  });

  it('starts with no used questions', () => {
    const { result } = setup();
    expect(result.current.usedQuestionIds.size).toBe(0);
  });

  it('starts with picker at index 0', () => {
    const { result } = setup();
    expect(result.current.currentPickerIndex).toBe(0);
  });

  it('starts as not finished', () => {
    const { result } = setup();
    expect(result.current.isFinished).toBe(false);
  });

  it('starts with 0% progress', () => {
    const { result } = setup();
    expect(result.current.progressPercent).toBe(0);
  });
});

describe('useGameState — awardWinner', () => {
  it('adds question points to the winning team', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('A'));
    expect(result.current.scores.A).toBe(100);
    expect(result.current.scores.B).toBe(0);
  });

  it('marks the question as used', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('A'));
    expect(result.current.usedQuestionIds.has('a-1')).toBe(true);
  });

  it('closes the active question after awarding', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('B'));
    expect(result.current.activeQuestion).toBeNull();
  });

  it('advances the picker to next team after awarding', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('A'));
    expect(result.current.currentPickerIndex).toBe(1);
  });
});

describe('useGameState — handleWrongPick', () => {
  it('does not change scores when negativeScoring is false', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.handleWrongPick(null));
    expect(result.current.scores.A).toBe(0);
    expect(result.current.scores.B).toBe(0);
  });

  it('deducts from picker team when negativeScoring is true', () => {
    const negSettings = { ...MOCK_SETTINGS, negativeScoring: true };
    const { result } = renderHook(() => useGameState(MOCK_PACK, negSettings));
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.handleWrongPick(null));
    expect(result.current.scores.A).toBe(-100);
  });

  it('awards steal team when stealTeamId provided', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.handleWrongPick('B'));
    expect(result.current.scores.B).toBe(100);
  });

  it('marks question as used even with no steal', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.handleWrongPick(null));
    expect(result.current.usedQuestionIds.has('a-1')).toBe(true);
  });
});

describe('useGameState — markNoOne', () => {
  it('marks question used without scoring', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.markNoOne());
    expect(result.current.usedQuestionIds.has('a-1')).toBe(true);
    expect(result.current.scores.A).toBe(0);
    expect(result.current.scores.B).toBe(0);
  });
});

describe('useGameState — resetGame', () => {
  it('resets scores to zero', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('A'));
    act(() => result.current.resetGame());
    expect(result.current.scores.A).toBe(0);
  });

  it('clears usedQuestionIds', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('A'));
    act(() => result.current.resetGame());
    expect(result.current.usedQuestionIds.size).toBe(0);
  });

  it('clears the game log', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('A'));
    expect(result.current.gameLog.length).toBe(1);
    act(() => result.current.resetGame());
    expect(result.current.gameLog.length).toBe(0);
  });
});

describe('useGameState — isFinished', () => {
  it('becomes true when all questions are used', () => {
    const { result } = setup();
    const allQuestions = MOCK_PACK.categories.flatMap((c) => c.questions);
    for (const q of allQuestions) {
      const active: ActiveQuestion = { categoryName: 'Animals', question: { ...q, points: 100 } };
      act(() => result.current.openQuestion(active));
      act(() => result.current.awardWinner('A'));
    }
    expect(result.current.isFinished).toBe(true);
  });
});

describe('useGameState — game log', () => {
  it('records a correct answer in the log', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.awardWinner('A'));
    expect(result.current.gameLog[0]?.outcome).toBe('correct');
    expect(result.current.gameLog[0]?.teamId).toBe('A');
  });

  it('records a steal in the log', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.handleWrongPick('B'));
    expect(result.current.gameLog[0]?.outcome).toBe('steal');
    expect(result.current.gameLog[0]?.stealTeamId).toBe('B');
  });

  it('records no-one in the log', () => {
    const { result } = setup();
    act(() => result.current.openQuestion(firstActive));
    act(() => result.current.markNoOne());
    expect(result.current.gameLog[0]?.outcome).toBe('no-one');
  });
});
