import type { Toast as ToastType } from '../../types';

interface ToastProps {
  toast: ToastType | null;
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.tone}`} role="status" aria-live="polite">
      {toast.message}
    </div>
  );
}
