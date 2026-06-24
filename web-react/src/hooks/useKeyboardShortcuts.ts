import { useEffect } from 'react';

type Bindings = Record<string, (() => void) | undefined>;

export function useKeyboardShortcuts(bindings: Bindings) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const handler = bindings[e.key];
      if (handler) handler();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bindings]);
}
