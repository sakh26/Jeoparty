import { useCallback, useState } from 'react';

type Validator<T> = (raw: unknown) => raw is T;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate?: Validator<T>,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      const parsed: unknown = JSON.parse(item);
      if (validate && !validate(parsed)) return initialValue;
      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage quota exceeded or private mode — silently skip
        }
        return next;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
