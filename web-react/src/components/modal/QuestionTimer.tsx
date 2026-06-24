import { useEffect, useRef, useState } from 'react';

interface QuestionTimerProps {
  seconds: number;
  onExpire: () => void;
}

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function QuestionTimer({ seconds, onExpire }: QuestionTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const progress = remaining / seconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isWarning = remaining <= 10;

  return (
    <div className={`question-timer ${isWarning ? 'question-timer--warning' : ''}`} aria-live="polite" aria-label={`${remaining} seconds remaining`}>
      <svg viewBox="0 0 64 64" className="timer-ring" aria-hidden="true">
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          className="timer-ring__track"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          className="timer-ring__progress"
          strokeWidth="4"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className="timer-value">{remaining}</span>
    </div>
  );
}
