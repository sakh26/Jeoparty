import { useCallback, useEffect, useState } from 'react';
import type { ColorTheme, GameSettings } from '../types';

export function useSettings(defaults: GameSettings) {
  const [settings, setSettings] = useState<GameSettings>(defaults);
  const [draft, setDraft] = useState<GameSettings>(defaults);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.colorTheme);
  }, [settings.colorTheme]);

  const updateDraft = useCallback((partial: Partial<GameSettings>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const commitDraft = useCallback(() => {
    setSettings(draft);
  }, [draft]);

  const discardDraft = useCallback(() => {
    setDraft(settings);
  }, [settings]);

  const openDraft = useCallback(() => {
    setDraft({ ...settings });
  }, [settings]);

  const applyThemePreview = useCallback((theme: ColorTheme) => {
    document.documentElement.setAttribute('data-theme', theme);
    setDraft((prev) => ({ ...prev, colorTheme: theme }));
  }, []);

  return { settings, setSettings, draft, updateDraft, commitDraft, discardDraft, openDraft, applyThemePreview };
}
