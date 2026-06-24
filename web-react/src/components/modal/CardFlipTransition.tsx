import type { GameSettings, TransitionCard } from '../../types';

interface CardFlipTransitionProps {
  transitionCard: TransitionCard | null;
  settings: Pick<GameSettings, 'showSongMeta' | 'teams'>;
}

export function CardFlipTransition({ transitionCard, settings }: CardFlipTransitionProps) {
  if (!transitionCard) return null;

  return (
    <div
      className={`card-transition-layer ${transitionCard.animating ? 'active' : ''}`}
      aria-hidden="true"
    >
      <div className="transition-card-shell" style={transitionCard.style}>
        <div className="transition-card-inner">
          <div className="transition-card-face transition-card-front">
            <span>{transitionCard.question.points}</span>
          </div>
          <div className="transition-card-face transition-card-back">
            <div className="transition-modal-clone">
              <div className="modal-head compact-head">
                <h2>{transitionCard.categoryName}</h2>
              </div>
              <div className="meta-grid">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="meta-item">
                    <p className="meta-label">&nbsp;</p>
                    <p className="meta-value">&nbsp;</p>
                  </div>
                ))}
              </div>
              {settings.showSongMeta && <div className="song-meta song-meta-placeholder" />}
              <div className="answer-reveal answer-reveal-placeholder">
                <span className="placeholder-chip" />
                <span className="placeholder-chip wide" />
              </div>
              <div className="modal-actions modal-actions-placeholder">
                {settings.teams.map((t) => (
                  <span key={t.id} className="placeholder-btn" />
                ))}
                <span className="placeholder-btn" />
                <span className="placeholder-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
