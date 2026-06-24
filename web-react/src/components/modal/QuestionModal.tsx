import { useEffect, useRef, useState } from 'react';
import type { ActiveQuestion, GameSettings, TeamId, TopicPlugin } from '../../types';
import { StealModal } from './StealModal';
import { QuestionTimer } from './QuestionTimer';

interface QuestionModalProps {
  activeQuestion: ActiveQuestion;
  settings: GameSettings;
  currentPickerIndex: number;
  topicPlugin: TopicPlugin;
  onAward: (teamId: TeamId) => void;
  onWrongPick: (stealTeamId?: TeamId | null) => void;
  onNoOne: () => void;
  onClose: () => void;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function QuestionModal({
  activeQuestion,
  settings,
  currentPickerIndex,
  topicPlugin,
  onAward,
  onWrongPick,
  onNoOne,
  onClose,
}: QuestionModalProps) {
  const [hintRevealed, setHintRevealed] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [showStealModal, setShowStealModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { question, categoryName } = activeQuestion;
  const pickerTeam = settings.teams[currentPickerIndex];
  const pickerName = pickerTeam?.name ?? 'Unknown';
  const pickerTeamId = pickerTeam?.id as TeamId | undefined;

  // Focus trap
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const getFocusable = () => Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE));
    getFocusable()[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const els = getFocusable();
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }

    card.addEventListener('keydown', handleKeyDown);
    return () => card.removeEventListener('keydown', handleKeyDown);
  }, [showStealModal]); // re-trap when steal modal swaps the buttons

  function handleWrongPick() {
    if (settings.allowSteals) {
      setShowStealModal(true);
    } else {
      onWrongPick(null);
    }
  }

  function handleStealSelect(teamId: TeamId | null) {
    setShowStealModal(false);
    onWrongPick(teamId);
  }

  const hasHint = Boolean(question.hint ?? question.hostNote);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-question-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card" ref={cardRef}>
        <div className="modal-head compact-head reveal reveal-1">
          <h2 id="modal-question-title">{categoryName}</h2>
          <button className="ghost-btn" onClick={onClose} aria-label="Lukk spørsmål">
            Lukk
          </button>
        </div>

        <div className="meta-grid reveal reveal-2">
          <div className="meta-item">
            <p className="meta-label">Kategori</p>
            <p className="meta-value">{categoryName}</p>
          </div>
          <div className="meta-item">
            <p className="meta-label">Nivå</p>
            <p className="meta-value">{question.level}</p>
          </div>
          <div className="meta-item">
            <p className="meta-label">Poeng</p>
            <p className="meta-value">{question.points}</p>
          </div>
          <div className="meta-item">
            <p className="meta-label">Velgende lag</p>
            <p className="meta-value">{pickerName}</p>
          </div>
        </div>

        {settings.showSongMeta && question.songTitle && (
          <div className="song-meta reveal reveal-3">
            <p className="song-title">{question.songTitle}</p>
            <p className="song-artist">{question.artist}</p>
          </div>
        )}

        {(() => { const clue = topicPlugin.renderQuestionClue?.(question) ?? null; return clue && <div className="topic-clue reveal reveal-3">{clue}</div>; })()}

        {settings.questionTimerSeconds !== null && (
          <QuestionTimer
            seconds={settings.questionTimerSeconds}
            onExpire={onNoOne}
          />
        )}

        <div className="answer-reveal reveal reveal-4">
          <button
            className="ghost-btn"
            onClick={() => setHintRevealed((p) => !p)}
            disabled={!hasHint}
            aria-expanded={hintRevealed}
          >
            {hintRevealed ? 'Skjul hint' : 'Vis hint'}
          </button>
          {hintRevealed && (
            <p className="hint-text" role="status">
              {question.hint ?? question.hostNote ?? 'Ingen hint tilgjengelig.'}
            </p>
          )}
          <button
            className="ghost-btn"
            onClick={() => setAnswerRevealed((p) => !p)}
            aria-expanded={answerRevealed}
          >
            {answerRevealed ? 'Skjul riktig svar' : 'Vis riktig svar'}
          </button>
          {answerRevealed && (
            <p className="target-word" role="status">{question.targetWord}</p>
          )}
        </div>

        {showStealModal && pickerTeamId ? (
          <div className="modal-actions reveal reveal-5">
            <StealModal
              teams={settings.teams}
              wrongPickTeamId={pickerTeamId}
              onSelect={handleStealSelect}
            />
          </div>
        ) : (
          <div className="modal-actions reveal reveal-5">
            {settings.teams.map((team) => (
              <button
                key={team.id}
                className="primary-btn"
                onClick={() => onAward(team.id as TeamId)}
              >
                {team.name} riktig
              </button>
            ))}
            <button className="ghost-btn" onClick={handleWrongPick}>
              Feil svar
            </button>
            <button className="ghost-btn" onClick={onNoOne}>
              Ingen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
