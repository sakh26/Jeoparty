interface ResumePromptProps {
  packName: string;
  onResume: () => void;
  onNewGame: () => void;
}

export function ResumePrompt({ packName, onResume, onNewGame }: ResumePromptProps) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="resume-title">
      <div className="modal-card resume-prompt">
        <h2 id="resume-title">Gjenoppta spill?</h2>
        <p>
          Du har et lagret spill for <strong>{packName}</strong>.{' '}
          Vil du fortsette der du slapp?
        </p>
        <div className="resume-prompt__actions">
          <button className="primary-btn" onClick={onResume} autoFocus>
            Gjenoppta
          </button>
          <button className="ghost-btn" onClick={onNewGame}>
            Nytt spill
          </button>
        </div>
      </div>
    </div>
  );
}
