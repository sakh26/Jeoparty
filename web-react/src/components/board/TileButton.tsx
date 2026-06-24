import type { Question } from '../../types';

interface TileButtonProps {
  question: Question;
  categoryName: string;
  isUsed: boolean;
  isLocked: boolean;
  isDoubleJeopardy?: boolean;
  onClick: (element: HTMLButtonElement) => void;
}

export function TileButton({ question, categoryName, isUsed, isLocked, isDoubleJeopardy = false, onClick }: TileButtonProps) {
  const label = [
    isUsed ? 'Brukt:' : '',
    categoryName,
    `${question.points} poeng`,
    isDoubleJeopardy ? '– Dobbel Jeopardy' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      disabled={isUsed || isLocked}
      className={`tile-btn ${isUsed ? 'used' : ''} ${isDoubleJeopardy ? 'double-jeopardy' : ''}`}
      onClick={(e) => onClick(e.currentTarget)}
      aria-label={label}
    >
      {isDoubleJeopardy && !isUsed && <span className="dj-badge" aria-hidden="true">★</span>}
      {question.points}
    </button>
  );
}
