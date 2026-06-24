import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../../../src/hooks/useToast';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useToast', () => {
  it('starts with no toast', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast).toBeNull();
  });

  it('shows a toast after showToast is called', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast('Hello', 'success'));
    expect(result.current.toast?.message).toBe('Hello');
    expect(result.current.toast?.tone).toBe('success');
  });

  it('defaults tone to info', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast('Test'));
    expect(result.current.toast?.tone).toBe('info');
  });

  it('auto-dismisses after 3.2 seconds', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast('Bye'));
    expect(result.current.toast).not.toBeNull();
    act(() => vi.advanceTimersByTime(3200));
    expect(result.current.toast).toBeNull();
  });

  it('dismissToast clears the toast immediately', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast('Dismiss me'));
    act(() => result.current.dismissToast());
    expect(result.current.toast).toBeNull();
  });
});
