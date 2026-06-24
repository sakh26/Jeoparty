import { useEffect, useRef } from 'react';
import type { Team, TeamId } from '../../types';

interface TeamCardProps {
  team: Team;
  score: number;
  isActive: boolean;
}

export function TeamCard({ team, score, isActive }: TeamCardProps) {
  const scoreRef = useRef<HTMLParagraphElement | null>(null);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current && scoreRef.current) {
      scoreRef.current.classList.remove('score-flash');
      void scoreRef.current.offsetWidth; // reflow to restart animation
      scoreRef.current.classList.add('score-flash');
    }
    prevScore.current = score;
  }, [score]);

  return (
    <article className={`team-card ${isActive ? 'team-card--active' : ''}`}>
      <h2>{team.name}</h2>
      <p
        ref={scoreRef}
        className="score-value"
        aria-live="polite"
        aria-label={`${team.name} score: ${score}`}
      >
        {score}
      </p>
    </article>
  );
}

// Needed externally for TeamCard iteration
export type { TeamId };
