import type { Team, TeamId } from '../../types';
import { TeamCard } from './TeamCard';
import { PickerControl } from './PickerControl';

interface ScoreboardProps {
  teams: Team[];
  scores: Record<TeamId, number>;
  currentPickerIndex: number;
  onPickerChange: (index: number) => void;
}

export function Scoreboard({ teams, scores, currentPickerIndex, onPickerChange }: ScoreboardProps) {
  return (
    <section className="scoreboard card">
      {teams.map((team, i) => (
        <TeamCard
          key={team.id}
          team={team}
          score={scores[team.id as TeamId] ?? 0}
          isActive={i === currentPickerIndex}
        />
      ))}
      <PickerControl
        teams={teams}
        currentPickerIndex={currentPickerIndex}
        onPickerChange={onPickerChange}
      />
    </section>
  );
}
