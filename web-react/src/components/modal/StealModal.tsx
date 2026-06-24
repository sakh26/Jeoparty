import type { Team, TeamId } from '../../types';

interface StealModalProps {
  teams: Team[];
  wrongPickTeamId: TeamId;
  onSelect: (teamId: TeamId | null) => void;
}

export function StealModal({ teams, wrongPickTeamId, onSelect }: StealModalProps) {
  const otherTeams = teams.filter((t) => t.id !== wrongPickTeamId);

  return (
    <div className="steal-modal" role="dialog" aria-modal="true" aria-label="Who stole?">
      <p className="steal-modal__prompt">Hvem tok stjelingen?</p>
      <div className="steal-modal__actions">
        {otherTeams.map((team) => (
          <button
            key={team.id}
            className="primary-btn"
            onClick={() => onSelect(team.id as TeamId)}
          >
            {team.name}
          </button>
        ))}
        <button className="ghost-btn" onClick={() => onSelect(null)}>
          Ingen stjeling
        </button>
      </div>
    </div>
  );
}
