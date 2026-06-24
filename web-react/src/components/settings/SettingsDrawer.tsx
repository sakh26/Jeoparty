import type { Category, GameLogEntry, GameSettings, TopicPlugin } from '../../types';
import { ContentLibrary } from './ContentLibrary';
import { SettingsForm } from './SettingsForm';
import { GameLog } from '../shared/GameLog';

interface SettingsDrawerProps {
  isOpen: boolean;
  draft: GameSettings;
  settings: GameSettings;
  categories: Category[];
  topicPlugin: TopicPlugin;
  gameLog: GameLogEntry[];
  onDraftChange: (updated: GameSettings) => void;
  onSave: () => void;
  onClose: () => void;
  onThemePreview: (theme: GameSettings['colorTheme']) => void;
}

export function SettingsDrawer({
  isOpen,
  draft,
  settings,
  categories,
  topicPlugin,
  gameLog,
  onDraftChange,
  onSave,
  onClose,
  onThemePreview,
}: SettingsDrawerProps) {
  return (
    <aside
      className={`settings-drawer ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      aria-label="Game settings"
    >
      <div className="drawer-header">
        <h2>Spillinnstillinger</h2>
        <button className="ghost-btn" onClick={onClose} aria-label="Close settings">
          Lukk
        </button>
      </div>
      <SettingsForm
        draft={draft}
        onChange={onDraftChange}
        onSave={onSave}
        onThemePreview={onThemePreview}
      />
      <ContentLibrary categories={categories} topicPlugin={topicPlugin} />
      <GameLog entries={gameLog} settings={settings} />
    </aside>
  );
}
