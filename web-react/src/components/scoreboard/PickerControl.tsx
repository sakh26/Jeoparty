import type { Team, TeamId } from '../../types';

interface PickerControlProps {
  teams: Team[];
  currentPickerIndex: number;
  onPickerChange: (index: number) => void;
}

export function PickerControl({ teams, currentPickerIndex, onPickerChange }: PickerControlProps) {
  return (
    <div className="picking-team card-soft">
      <p className="picker-label">Velgende lag</p>
      <div className="picker-actions">
        {teams.map((team, i) => (
          <button
            key={team.id}
            className={`pick-btn ${i === currentPickerIndex ? 'active' : ''}`}
            onClick={() => onPickerChange(i)}
            aria-pressed={i === currentPickerIndex}
          >
            {team.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { TeamId };
