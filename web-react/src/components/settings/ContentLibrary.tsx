import { useMemo, useState } from 'react';
import type { Category, TopicPlugin } from '../../types';

interface ContentLibraryProps {
  categories: Category[];
  topicPlugin: TopicPlugin;
}

export function ContentLibrary({ categories, topicPlugin }: ContentLibraryProps) {
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (q) =>
            q.targetWord.toLowerCase().includes(term) ||
            (q.songTitle?.toLowerCase().includes(term) ?? false) ||
            (q.artist?.toLowerCase().includes(term) ?? false) ||
            (q.clue?.toLowerCase().includes(term) ?? false),
        ),
      }))
      .filter((cat) => cat.questions.length > 0);
  }, [categories, filter]);

  const placeholder =
    topicPlugin.supportsSpotify
      ? 'Prøv: tiger, Gaga, vin'
      : 'Søk etter svar eller hint...';

  const libraryTitle =
    topicPlugin.supportsSpotify ? 'Sangbibliotek' : 'Innholdsbibliotek';

  return (
    <section className="song-library">
      <h3>{libraryTitle}</h3>
      <label className="song-filter">
        Søk etter innhold
        <input
          type="text"
          placeholder={placeholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </label>
      {filtered.map((category) => (
        <details key={`lib-${category.name}`} className="song-library-group">
          <summary>{category.name}</summary>
          <ul>
            {category.questions
              .slice()
              .sort((a, b) => a.level - b.level)
              .map((q) => (
                <li key={`lib-item-${q.id}`}>
                  <span>L{q.level}</span>{' '}
                  {topicPlugin.supportsSpotify
                    ? `${q.songTitle ?? ''} – ${q.artist ?? ''}`
                    : (q.clue ?? q.targetWord)}
                </li>
              ))}
          </ul>
        </details>
      ))}
      {filtered.length === 0 && (
        <p className="empty-library">Ingen treff for dette søket.</p>
      )}
    </section>
  );
}
