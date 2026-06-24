import { useState } from 'react';

interface TopBarProps {
  spotifyConnected: boolean;
  spotifyBusy: boolean;
  showSpotifyButton: boolean;
  onSpotifyConnect: () => void;
  onSpotifyDisconnect: () => void;
  onOpenSettings: () => void;
  onResetGame: () => void;
}

export function TopBar({
  spotifyConnected,
  spotifyBusy,
  showSpotifyButton,
  onSpotifyConnect,
  onSpotifyDisconnect,
  onOpenSettings,
  onResetGame,
}: TopBarProps) {
  const [resetPending, setResetPending] = useState(false);

  function handleResetConfirm() {
    onResetGame();
    setResetPending(false);
  }

  return (
    <header className="top-bar">
      <div className="title-wrap">
        <h1>Jeoparty!</h1>
      </div>
      <div className="top-bar-actions">
        <button className="ghost-btn" onClick={onOpenSettings}>
          Innstillinger
        </button>
        {showSpotifyButton && (
          spotifyConnected ? (
            <button className="primary-btn" onClick={onSpotifyDisconnect} disabled={spotifyBusy}>
              {spotifyBusy ? 'Spotify jobber...' : 'Koble fra Spotify'}
            </button>
          ) : (
            <button className="primary-btn" onClick={onSpotifyConnect}>
              Koble Spotify
            </button>
          )
        )}
        {resetPending ? (
          <span className="reset-confirm" role="group" aria-label="Bekreft nullstilling">
            <span className="reset-confirm__label">Er du sikker?</span>
            <button className="danger-btn" onClick={handleResetConfirm}>
              Ja
            </button>
            <button className="ghost-btn" onClick={() => setResetPending(false)}>
              Avbryt
            </button>
          </span>
        ) : (
          <button className="danger-btn" onClick={() => setResetPending(true)}>
            Nullstill spill
          </button>
        )}
      </div>
    </header>
  );
}
