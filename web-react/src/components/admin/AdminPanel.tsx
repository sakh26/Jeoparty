import { useCallback, useState } from 'react';
import type { QuestionPack } from '../../types';
import { CategoryEditor, type DraftQuestion } from './CategoryEditor';
import { validatePackSchema, exportPackAsJson } from '../../utils/sanitize';
import { TOPIC_PLUGINS } from '../../plugins';

interface AdminPanelProps {
  onClose: () => void;
  onImport: (pack: QuestionPack) => void;
}

interface DraftCategory {
  name: string;
  questions: DraftQuestion[];
}

interface DraftPack {
  id: string;
  name: string;
  topic: string;
  version: string;
  categories: DraftCategory[];
}

const EMPTY_PACK: DraftPack = {
  id: 'my-pack-' + Date.now(),
  name: '',
  topic: 'music',
  version: '1.0',
  categories: [],
};

function draftToPackSchema(draft: DraftPack): QuestionPack {
  return {
    ...draft,
    categories: draft.categories.map((cat, ci) => ({
      name: cat.name || `Category ${ci + 1}`,
      questions: cat.questions.map((q, qi) => ({
        id: q.id ?? `${draft.id}-cat${ci}-q${qi}`,
        level: q.level,
        points: q.level * 100,
        targetWord: q.targetWord,
        hint: q.hint,
        songTitle: q.songTitle,
        artist: q.artist,
        clue: q.clue,
      })),
    })),
  };
}

export function AdminPanel({ onClose, onImport }: AdminPanelProps) {
  const [draft, setDraft] = useState<DraftPack>(() => {
    try {
      const saved = localStorage.getItem('jeoparty_admin_draft');
      if (saved) return JSON.parse(saved) as DraftPack;
    } catch { /* ignore */ }
    return EMPTY_PACK;
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [importError, setImportError] = useState('');

  function saveDraft(next: DraftPack) {
    setDraft(next);
    localStorage.setItem('jeoparty_admin_draft', JSON.stringify(next));
  }

  function addCategory() {
    saveDraft({ ...draft, categories: [...draft.categories, { name: '', questions: [] }] });
  }

  function updateCategory(index: number, updated: DraftCategory) {
    saveDraft({ ...draft, categories: draft.categories.map((c, i) => (i === index ? updated : c)) });
  }

  function deleteCategory(index: number) {
    saveDraft({ ...draft, categories: draft.categories.filter((_, i) => i !== index) });
  }

  function handleExport() {
    const pack = draftToPackSchema(draft);
    const errs = validatePackSchema(pack);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    exportPackAsJson(pack);
  }

  function handlePlayNow() {
    const pack = draftToPackSchema(draft);
    const errs = validatePackSchema(pack);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    onImport(pack);
    onClose();
  }

  const handleFileImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as DraftPack;
        const errs = validatePackSchema(parsed);
        if (errs.length > 0) {
          setImportError(`Ugyldig pakke: ${errs[0]}`);
          return;
        }
        saveDraft(parsed);
        setImportError('');
      } catch {
        setImportError('Ugyldig JSON-fil. Kan ikke importere.');
      }
    };
    reader.readAsText(file);
  }, []);

  const isMusicTopic = draft.topic === 'music';
  const totalQuestions = draft.categories.reduce((n, c) => n + c.questions.length, 0);

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1>Spørsmålsbygger</h1>
        <button className="ghost-btn" onClick={onClose}>← Tilbake til spillet</button>
      </div>

      <div className="admin-section">
        <h2>Pakkeinfo</h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <label style={{ display: 'grid', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
            Pakkenavn
            <input type="text" value={draft.name} placeholder="f.eks. Lisas bursdag 2025" onChange={(e) => saveDraft({ ...draft, name: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') || draft.id })} />
          </label>
          <label style={{ display: 'grid', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
            Tema
            <select value={draft.topic} onChange={(e) => saveDraft({ ...draft, topic: e.target.value })}>
              {Object.values(TOPIC_PLUGINS).map((p) => (
                <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Kategorier ({draft.categories.length}) · {totalQuestions} spørsmål</h2>
          <button type="button" className="primary-btn" onClick={addCategory} disabled={draft.categories.length >= 8}>
            + Ny kategori
          </button>
        </div>
        {draft.categories.map((cat, i) => (
          <CategoryEditor
            key={i}
            category={cat}
            categoryIndex={i}
            isMusicTopic={isMusicTopic}
            onNameChange={(name) => updateCategory(i, { ...cat, name })}
            onQuestionsChange={(questions) => updateCategory(i, { ...cat, questions })}
            onDelete={() => deleteCategory(i)}
          />
        ))}
        {draft.categories.length === 0 && (
          <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Ingen kategorier ennå. Klikk "+ Ny kategori" for å starte.</p>
        )}
      </div>

      {errors.length > 0 && (
        <div style={{ padding: '0.75rem', background: 'var(--toast-error-bg)', borderRadius: '10px', marginBottom: '1rem' }}>
          <strong style={{ color: 'var(--toast-error-text)' }}>Feil i pakken:</strong>
          <ul style={{ margin: '0.4rem 0 0 1rem', color: 'var(--toast-error-text)' }}>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="admin-actions">
        <button type="button" className="primary-btn" onClick={handlePlayNow}>
          ▶ Spill nå
        </button>
        <button type="button" className="ghost-btn" onClick={handleExport}>
          ↓ Eksporter JSON
        </button>
        <label className="ghost-btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          ↑ Importer JSON
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileImport} />
        </label>
        <button type="button" className="danger-btn" onClick={() => { localStorage.removeItem('jeoparty_admin_draft'); saveDraft(EMPTY_PACK); }}>
          Nullstill utkast
        </button>
      </div>
      {importError && <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.85rem' }}>{importError}</p>}
    </div>
  );
}
