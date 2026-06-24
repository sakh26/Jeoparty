import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiOverlayProps {
  trigger: number;
}

export function ConfettiOverlay({ trigger }: ConfettiOverlayProps) {
  useEffect(() => {
    if (trigger === 0) return;
    void confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#f9a8d4', '#c084fc', '#60a5fa', '#34d399', '#fbbf24'],
    });
  }, [trigger]);

  return null;
}
