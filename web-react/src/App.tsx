import { useCallback, useMemo, useRef, useState } from 'react';
import './index.css';
import settingsJson from './data/settings.json';
import { AVAILABLE_PACKS } from './data/packLoader';
import { mapPoints } from './utils/gameLogic';
import { useToast } from './hooks/useToast';
import { useSpotify } from './hooks/useSpotify';
import { useSettings } from './hooks/useSettings';
import { useGameState } from './hooks/useGameState';
import { useCardFlipTransition } from './hooks/useCardFlipTransition';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getPlugin } from './plugins';
import { TopBar } from './components/layout/TopBar';
import { Scoreboard } from './components/scoreboard/Scoreboard';
import { Board } from './components/board/Board';
import { SettingsDrawer } from './components/settings/SettingsDrawer';
import { QuestionModal } from './components/modal/QuestionModal';
import { CardFlipTransition } from './components/modal/CardFlipTransition';
import { Toast } from './components/shared/Toast';
import { ConfettiOverlay } from './components/shared/ConfettiOverlay';
import { PackSelectorScreen } from './components/screens/PackSelectorScreen';
import { ResumePrompt } from './components/screens/ResumePrompt';
import { AdminPanel } from './components/admin/AdminPanel';
import type { GameSettings, QuestionPack, Team, TeamId } from './types';

type AppScreen = 'game' | 'admin';

const DEFAULT_SETTINGS: GameSettings = {
  teams: settingsJson.teams as Team[],
  pointsByLevel: settingsJson.pointsByLevel as [number, number, number, number, number],
  allowSteals: settingsJson.allowSteals,
  negativeScoring: settingsJson.negativeScoring,
  showSongMeta: settingsJson.showSongMeta,
  questionTimerSeconds: settingsJson.questionTimerSeconds,
  colorTheme: settingsJson.colorTheme as GameSettings['colorTheme'],
};

function pickRandomDoubleJeopardyIds(pack: QuestionPack, count = 2): Set<string> {
  const allIds = pack.categories.flatMap((c) => c.questions.map((q) => q.id));
  const shuffled = [...allIds].sort(() => Math.random() - 0.5);
  return new Set(shuffled.slice(0, count));
}

export default function App() {
  const [activePack, setActivePack] = useState<QuestionPack | null>(
    AVAILABLE_PACKS.length === 1 ? (AVAILABLE_PACKS[0] ?? null) : null,
  );
  const [screen, setScreen] = useState<AppScreen>('game');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [doubleJeopardyIds, setDoubleJeopardyIds] = useState<Set<string>>(() => {
    const initial = activePack ?? AVAILABLE_PACKS[0];
    return initial ? pickRandomDoubleJeopardyIds(initial) : new Set<string>();
  });
  const [lastCheckedPackId, setLastCheckedPackId] = useState<string | null>(null);
  const modalMeasureRef = useRef<HTMLDivElement | null>(null);

  const { toast, showToast } = useToast();
  const { settings, draft, openDraft, updateDraft, commitDraft, discardDraft, applyThemePreview } =
    useSettings(DEFAULT_SETTINGS);
  const spotify = useSpotify(showToast);

  const pack = activePack ?? AVAILABLE_PACKS[0];
  const game = useGameState(pack!, settings);
  const { transitionCard, startTransition, clearTransition } = useCardFlipTransition();

  const topicPlugin = useMemo(() => getPlugin(pack?.topic ?? 'default'), [pack?.topic]);

  const categories = useMemo(
    () => (pack ? mapPoints(pack.categories, settings.pointsByLevel) : []),
    [pack, settings.pointsByLevel],
  );

  useKeyboardShortcuts(
    useMemo(
      () => ({
        Escape: game.activeQuestion ? game.closeQuestion : undefined,
      }),
      [game.activeQuestion, game.closeQuestion],
    ),
  );

  const handleTileClick = useCallback(
    (categoryName: string, question: Parameters<typeof startTransition>[1], el: HTMLButtonElement) => {
      if (transitionCard || game.activeQuestion) return;
      startTransition(categoryName, question, el, modalMeasureRef.current, (active) => {
        game.openQuestion(active);
        if (topicPlugin.supportsSpotify) void spotify.playForQuestion(question);
      });
    },
    [transitionCard, game, startTransition, topicPlugin.supportsSpotify, spotify],
  );

  const handleAward = useCallback(
    (teamId: TeamId) => {
      game.awardWinner(teamId);
      setConfettiTrigger((n) => n + 1);
    },
    [game],
  );

  const handleReset = useCallback(() => {
    game.resetGame();
    clearTransition();
  }, [game, clearTransition]);

  function openSettings() {
    openDraft();
    setSettingsOpen(true);
  }

  function closeSettings() {
    discardDraft();
    setSettingsOpen(false);
  }

  function saveSettings() {
    commitDraft();
    setSettingsOpen(false);
  }

  function handleSelectPack(pack: QuestionPack) {
    setActivePack(pack);
    setDoubleJeopardyIds(pickRandomDoubleJeopardyIds(pack));
  }

  if (screen === 'admin') {
    return (
      <>
        <div className="sparkle-overlay" aria-hidden="true" />
        <AdminPanel
          onClose={() => setScreen('game')}
          onImport={(pack) => {
            handleSelectPack(pack);
            setScreen('game');
          }}
        />
      </>
    );
  }

  if (!activePack && AVAILABLE_PACKS.length > 1) {
    return (
      <>
        <div className="sparkle-overlay" aria-hidden="true" />
        <PackSelectorScreen packs={AVAILABLE_PACKS} onSelect={handleSelectPack} />
      </>
    );
  }

  if (!pack) return <p>No question packs found.</p>;

  if (game.hasSavedGame && lastCheckedPackId !== pack.id) {
    return (
      <>
        <div className="sparkle-overlay" aria-hidden="true" />
        <ResumePrompt
          packName={pack.name}
          onResume={() => { game.resumeGame(); setLastCheckedPackId(pack.id); }}
          onNewGame={() => { game.resetGame(); setLastCheckedPackId(pack.id); }}
        />
      </>
    );
  }

  return (
    <>
      <div className="sparkle-overlay" aria-hidden="true" />

      <TopBar
        spotifyConnected={spotify.isConnected}
        spotifyBusy={spotify.isBusy}
        showSpotifyButton={topicPlugin.supportsSpotify}
        onSpotifyConnect={spotify.connect}
        onSpotifyDisconnect={spotify.disconnect}
        onOpenSettings={openSettings}
        onResetGame={handleReset}
      />
      <button
        className="admin-fab ghost-btn"
        onClick={() => setScreen('admin')}
        aria-label="Åpne spørsmålsbygger"
        title="Lag ny spørsmålspakke"
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50, borderRadius: '24px', padding: '0.5rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}
      >
        ✏️ Ny pakke
      </button>

      <main className="app-shell">
        <Scoreboard
          teams={settings.teams}
          scores={game.scores}
          currentPickerIndex={game.currentPickerIndex}
          onPickerChange={game.setCurrentPickerIndex}
        />
        <Board
          categories={categories}
          usedQuestionIds={game.usedQuestionIds}
          doubleJeopardyIds={doubleJeopardyIds}
          isLocked={!!transitionCard}
          onTileClick={handleTileClick}
        />
      </main>

      <SettingsDrawer
        isOpen={settingsOpen}
        draft={draft}
        settings={settings}
        categories={categories}
        topicPlugin={topicPlugin}
        gameLog={game.gameLog}
        onDraftChange={updateDraft}
        onSave={saveSettings}
        onClose={closeSettings}
        onThemePreview={applyThemePreview}
      />

      {(transitionCard || game.activeQuestion) && (
        <div
          className={`modal-backdrop-layer ${transitionCard ? 'transitioning' : 'steady'}`}
          aria-hidden="true"
        />
      )}

      <CardFlipTransition transitionCard={transitionCard} settings={settings} />

      <div className="modal-size-probe-wrap" aria-hidden="true">
        <div ref={modalMeasureRef} className="modal-card modal-size-probe">
          <div className="modal-head compact-head">
            <h2>Kategori</h2>
            <button className="ghost-btn" type="button">Lukk</button>
          </div>
          <div className="meta-grid">
            {['Kategori', 'Nivå', 'Poeng', 'Lag'].map((label) => (
              <div key={label} className="meta-item">
                <p className="meta-label">{label}</p>
                <p className="meta-value">–</p>
              </div>
            ))}
          </div>
          <div className="answer-reveal">
            <button className="ghost-btn" type="button">Vis hint</button>
            <button className="ghost-btn" type="button">Vis riktig svar</button>
          </div>
          <div className="modal-actions">
            {settings.teams.map((team) => (
              <button key={team.id} className="primary-btn" type="button">{team.name}</button>
            ))}
            <button className="ghost-btn" type="button">Feil svar</button>
            <button className="ghost-btn" type="button">Ingen</button>
          </div>
        </div>
      </div>

      {game.activeQuestion && (
        <QuestionModal
          activeQuestion={game.activeQuestion}
          settings={settings}
          currentPickerIndex={game.currentPickerIndex}
          topicPlugin={topicPlugin}
          onAward={handleAward}
          onWrongPick={game.handleWrongPick}
          onNoOne={game.markNoOne}
          onClose={game.closeQuestion}
        />
      )}

      <ConfettiOverlay trigger={confettiTrigger} />
      <Toast toast={toast} />
    </>
  );
}
