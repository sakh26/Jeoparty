import type { Question } from '../../types';

type DraftQuestion = Omit<Question, 'id' | 'points'> & { id?: string; points?: number };

interface QuestionEditorProps {
  question: DraftQuestion;
  index: number;
  onChange: (updated: DraftQuestion) => void;
  onDelete: () => void;
  isMusicTopic: boolean;
}

export function QuestionEditor({ question, index, onChange, onDelete, isMusicTopic }: QuestionEditorProps) {
  function field(key: keyof DraftQuestion, label: string, placeholder?: string) {
    return (
      <label>
        {label}
        <input
          type="text"
          value={(question[key] as string | undefined) ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange({ ...question, [key]: e.target.value })}
        />
      </label>
    );
  }

  return (
    <div className="question-editor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <strong style={{ fontSize: '0.85rem' }}>Spørsmål {index + 1} (Nivå {question.level})</strong>
        <button type="button" className="danger-btn" onClick={onDelete} style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}>
          Slett
        </button>
      </div>
      {field('targetWord', 'Riktig svar', 'f.eks. hai')}
      {field('hint', 'Hint (valgfritt)', 'f.eks. Sjødyr med finner')}
      {isMusicTopic && field('songTitle', 'Sangtittel', 'f.eks. She Wolf')}
      {isMusicTopic && field('artist', 'Artist', 'f.eks. Shakira')}
      {!isMusicTopic && field('clue', 'Ledetekst (valgfritt)', 'f.eks. Et dyr med fire bein')}
    </div>
  );
}
