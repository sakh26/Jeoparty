import { useCallback, useRef, useState } from 'react';
import type { Toast, ToastTone } from '../types';

const TOAST_DURATION_MS = 3200;

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ id: String(Date.now()), message, tone });
    timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
