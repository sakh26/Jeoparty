import type { QuestionPack } from '../../types';
import { getPlugin } from '../../plugins';

interface PackSelectorScreenProps {
  packs: QuestionPack[];
  onSelect: (pack: QuestionPack) => void;
}

export function PackSelectorScreen({ packs, onSelect }: PackSelectorScreenProps) {
  return (
    <div className="pack-selector">
      <div className="pack-selector__header">
        <h1>Jeoparty!</h1>
        <p className="pack-selector__subtitle">Velg et spørsmålssett for kvelden</p>
      </div>
      <div className="pack-selector__grid">
        {packs.map((pack) => {
          const plugin = getPlugin(pack.topic);
          return (
            <button
              key={pack.id}
              className="pack-card"
              onClick={() => onSelect(pack)}
              aria-label={`Start ${pack.name}`}
            >
              <span className="pack-card__icon" aria-hidden="true">{plugin.icon}</span>
              <h2 className="pack-card__name">{pack.name}</h2>
              <p className="pack-card__meta">
                {pack.categories.length} kategorier ·{' '}
                {pack.categories.reduce((n, c) => n + c.questions.length, 0)} spørsmål
              </p>
              <p className="pack-card__topic">{plugin.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
