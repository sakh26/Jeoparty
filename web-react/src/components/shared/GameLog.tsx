import type { GameLogEntry, GameSettings, TeamId } from '../../types';

interface GameLogProps {
  entries: GameLogEntry[];
  settings: GameSettings;
}

const OUTCOME_LABELS: Record<GameLogEntry['outcome'], string> = {
  correct: '✓ Riktig',
  wrong: '✗ Feil',
  steal: '⚡ Stjeling',
  'no-one': '— Ingen',
};

const OUTCOME_CLASSES: Record<GameLogEntry['outcome'], string> = {
  correct: 'log-correct',
  wrong: 'log-wrong',
  steal: 'log-steal',
  'no-one': 'log-none',
};

export function GameLog({ entries, settings }: GameLogProps) {
  if (entries.length === 0) {
    return (
      <section className="game-log">
        <h3>Spilllogg</h3>
        <p className="game-log__empty">Ingen spørsmål er brukt ennå.</p>
      </section>
    );
  }

  function teamName(id: TeamId | null): string {
    if (!id) return '–';
    return settings.teams.find((t) => t.id === id)?.name ?? id;
  }

  return (
    <section className="game-log">
      <h3>Spilllogg</h3>
      <ul className="game-log__list">
        {[...entries].reverse().map((entry) => (
          <li key={`${entry.questionId}-${entry.timestamp}`} className={`game-log__item ${OUTCOME_CLASSES[entry.outcome]}`}>
            <span className="log-category">{entry.categoryName}</span>
            <span className="log-points">{entry.points}p</span>
            <span className="log-outcome">{OUTCOME_LABELS[entry.outcome]}</span>
            <span className="log-team">
              {entry.outcome === 'steal' && entry.stealTeamId
                ? `${teamName(entry.teamId)} → ${teamName(entry.stealTeamId)}`
                : teamName(entry.teamId)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
