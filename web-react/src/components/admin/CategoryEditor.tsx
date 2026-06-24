import type { Question } from '../../types';
import { QuestionEditor } from './QuestionEditor';

type DraftQuestion = Omit<Question, 'id' | 'points'> & { id?: string; points?: number };

interface CategoryEditorProps {
  category: { name: string; questions: DraftQuestion[] };
  categoryIndex: number;
  isMusicTopic: boolean;
  onNameChange: (name: string) => void;
  onQuestionsChange: (questions: DraftQuestion[]) => void;
  onDelete: () => void;
}

const LEVELS = [1, 2, 3, 4, 5];

export function CategoryEditor({
  category,
  categoryIndex,
  isMusicTopic,
  onNameChange,
  onQuestionsChange,
  onDelete,
}: CategoryEditorProps) {
  function updateQuestion(index: number, updated: DraftQuestion) {
    onQuestionsChange(category.questions.map((q, i) => (i === index ? updated : q)));
  }

  function deleteQuestion(index: number) {
    onQuestionsChange(category.questions.filter((_, i) => i !== index));
  }

  function addQuestion() {
    const usedLevels = new Set(category.questions.map((q) => q.level));
    const nextLevel = LEVELS.find((l) => !usedLevels.has(l)) ?? (category.questions.length + 1);
    onQuestionsChange([
      ...category.questions,
      { level: nextLevel, targetWord: '', hint: '' },
    ]);
  }

  return (
    <div className="category-editor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <label style={{ flex: 1, marginRight: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>Kategorinavn</span>
          <input
            type="text"
            value={category.name}
            placeholder={`Kategori ${categoryIndex + 1}`}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>
        <button type="button" className="danger-btn" onClick={onDelete} style={{ marginTop: '1.1rem' }}>
          Slett kategori
        </button>
      </div>
      {category.questions
        .slice()
        .sort((a, b) => a.level - b.level)
        .map((q, i) => (
          <QuestionEditor
            key={i}
            question={q}
            index={i}
            onChange={(updated) => updateQuestion(i, updated)}
            onDelete={() => deleteQuestion(i)}
            isMusicTopic={isMusicTopic}
          />
        ))}
      {category.questions.length < 5 && (
        <button type="button" className="ghost-btn" onClick={addQuestion} style={{ fontSize: '0.85rem' }}>
          + Legg til spørsmål
        </button>
      )}
    </div>
  );
}

export type { DraftQuestion };
