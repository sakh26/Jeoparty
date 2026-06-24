import type { GameSettings, TeamId } from '../../types';
import { sanitizeName } from '../../utils/sanitize';
import { ThemeSelector } from './ThemeSelector';

interface SettingsFormProps {
  draft: GameSettings;
  onChange: (updated: GameSettings) => void;
  onSave: () => void;
  onThemePreview: (theme: GameSettings['colorTheme']) => void;
}

const TEAM_IDS: TeamId[] = ['A', 'B', 'C', 'D'];

export function SettingsForm({ draft, onChange, onSave, onThemePreview }: SettingsFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave();
  }

  function handleAddTeam() {
    const nextId = TEAM_IDS[draft.teams.length];
    if (!nextId) return;
    onChange({
      ...draft,
      teams: [...draft.teams, { id: nextId, name: `Lag ${nextId}` }],
    });
  }

  function handleRemoveTeam() {
    if (draft.teams.length <= 2) return;
    onChange({ ...draft, teams: draft.teams.slice(0, -1) });
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <fieldset className="team-fieldset">
        <legend>Lag</legend>
        {draft.teams.map((team, i) => (
          <label key={team.id}>
            Lagnavn {team.id}
            <input
              type="text"
              maxLength={24}
              value={team.name}
              onChange={(e) =>
                onChange({
                  ...draft,
                  teams: draft.teams.map((t, j) =>
                    j === i ? { ...t, name: e.target.value } : t,
                  ),
                })
              }
              onBlur={(e) =>
                onChange({
                  ...draft,
                  teams: draft.teams.map((t, j) =>
                    j === i ? { ...t, name: sanitizeName(e.target.value, `Lag ${t.id}`) } : t,
                  ),
                })
              }
            />
          </label>
        ))}
        <div className="team-count-controls">
          <button
            type="button"
            className="ghost-btn"
            onClick={handleRemoveTeam}
            disabled={draft.teams.length <= 2}
            aria-label="Fjern siste lag"
          >
            − Fjern lag
          </button>
          <span className="team-count-label">{draft.teams.length} lag</span>
          <button
            type="button"
            className="ghost-btn"
            onClick={handleAddTeam}
            disabled={draft.teams.length >= 4}
            aria-label="Legg til lag"
          >
            + Legg til lag
          </button>
        </div>
      </fieldset>

      <label>
        Poeng per nivå
        <input
          type="text"
          value={draft.pointsByLevel.join(', ')}
          readOnly
        />
      </label>

      <label>
        Spørsmål-timer
        <select
          value={draft.questionTimerSeconds ?? ''}
          onChange={(e) =>
            onChange({
              ...draft,
              questionTimerSeconds: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        >
          <option value="">Ingen timer</option>
          <option value="15">15 sekunder</option>
          <option value="30">30 sekunder</option>
          <option value="45">45 sekunder</option>
          <option value="60">60 sekunder</option>
        </select>
      </label>

      <label className="toggle-row">
        <input
          type="checkbox"
          checked={draft.allowSteals}
          onChange={(e) => onChange({ ...draft, allowSteals: e.target.checked })}
        />
        Tillat stjeling
      </label>
      <label className="toggle-row">
        <input
          type="checkbox"
          checked={draft.negativeScoring}
          onChange={(e) => onChange({ ...draft, negativeScoring: e.target.checked })}
        />
        Trekk poeng ved feil svar
      </label>
      <label className="toggle-row">
        <input
          type="checkbox"
          checked={draft.showSongMeta}
          onChange={(e) => onChange({ ...draft, showSongMeta: e.target.checked })}
        />
        Vis sangtittel og artist
      </label>

      <ThemeSelector
        value={draft.colorTheme}
        onChange={(theme) => {
          onChange({ ...draft, colorTheme: theme });
          onThemePreview(theme);
        }}
      />

      <div className="form-actions">
        <button type="submit" className="primary-btn">
          Lagre innstillinger
        </button>
      </div>
    </form>
  );
}
