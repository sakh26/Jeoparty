import { useCallback, useRef, useState } from 'react';
import type { ActiveQuestion, TransitionCard } from '../types';

const CARD_TRANSITION_MS = 950;
const CONTENT_LEAD_MS = 480;

interface UseCardFlipTransitionResult {
  transitionCard: TransitionCard | null;
  startTransition: (
    categoryName: string,
    question: ActiveQuestion['question'],
    sourceElement: HTMLElement,
    modalMeasureEl: HTMLElement | null,
    onReady: (active: ActiveQuestion) => void,
  ) => void;
  clearTransition: () => void;
}

export function useCardFlipTransition(): UseCardFlipTransitionResult {
  const [transitionCard, setTransitionCard] = useState<TransitionCard | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTransition = useCallback(() => {
    setTransitionCard(null);
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (endTimerRef.current) clearTimeout(endTimerRef.current);
  }, []);

  const startTransition = useCallback(
    (
      categoryName: string,
      question: ActiveQuestion['question'],
      sourceElement: HTMLElement,
      modalMeasureEl: HTMLElement | null,
      onReady: (active: ActiveQuestion) => void,
    ) => {
      const rect = sourceElement.getBoundingClientRect();
      const toWidth = modalMeasureEl?.offsetWidth ?? Math.min(900, window.innerWidth * 0.95);
      const toHeight = modalMeasureEl?.offsetHeight ?? Math.min(560, window.innerHeight * 0.86);
      const toLeft = (window.innerWidth - toWidth) / 2;
      const toTop = (window.innerHeight - toHeight) / 2;

      setTransitionCard({
        categoryName,
        question,
        animating: false,
        style: {
          '--from-left': `${rect.left}px`,
          '--from-top': `${rect.top}px`,
          '--from-width': `${rect.width}px`,
          '--from-height': `${rect.height}px`,
          '--to-left': `${toLeft}px`,
          '--to-top': `${toTop}px`,
          '--to-width': `${toWidth}px`,
          '--to-height': `${toHeight}px`,
        },
      });

      requestAnimationFrame(() => {
        setTransitionCard((prev) => (prev ? { ...prev, animating: true } : prev));
      });

      const delay = Math.max(0, CARD_TRANSITION_MS - CONTENT_LEAD_MS);
      openTimerRef.current = setTimeout(() => {
        onReady({ categoryName, question });
      }, delay);

      endTimerRef.current = setTimeout(() => {
        setTransitionCard(null);
      }, CARD_TRANSITION_MS);
    },
    [],
  );

  return { transitionCard, startTransition, clearTransition };
}
