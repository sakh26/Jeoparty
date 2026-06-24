import type { Category, Question } from '../../types';
import { TileButton } from './TileButton';

interface BoardProps {
  categories: Category[];
  usedQuestionIds: Set<string>;
  doubleJeopardyIds?: Set<string>;
  isLocked: boolean;
  onTileClick: (categoryName: string, question: Question, element: HTMLButtonElement) => void;
}

export function Board({
  categories,
  usedQuestionIds,
  doubleJeopardyIds,
  isLocked,
  onTileClick,
}: BoardProps) {
  return (
    <section className="board card">
      <div className="board-head">
        <p>Velg kategori og vanskelighetsgrad. Første riktige lag får poengene.</p>
      </div>
      <div className="board-grid">
        {categories.map((category) => (
          <div key={category.name} className="category-column">
            <div className="category-header">{category.name}</div>
            {category.questions
              .slice()
              .sort((a, b) => a.level - b.level)
              .map((question) => (
                <TileButton
                  key={question.id}
                  question={question}
                  categoryName={category.name}
                  isUsed={usedQuestionIds.has(question.id)}
                  isLocked={isLocked}
                  isDoubleJeopardy={doubleJeopardyIds?.has(question.id)}
                  onClick={(el) => onTileClick(category.name, question, el)}
                />
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
