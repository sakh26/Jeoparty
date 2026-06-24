import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../../src/hooks/useLocalStorage';

const KEY = 'test_key';

beforeEach(() => {
  localStorage.clear();
});

describe('useLocalStorage', () => {
  it('returns initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('returns stored value when key exists', () => {
    localStorage.setItem(KEY, JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('returns initial value when stored JSON is corrupt', () => {
    localStorage.setItem(KEY, 'not-json{{{');
    const { result } = renderHook(() => useLocalStorage(KEY, 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists updated value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 0));
    act(() => result.current[1](42));
    expect(result.current[0]).toBe(42);
    expect(JSON.parse(localStorage.getItem(KEY) ?? 'null')).toBe(42);
  });

  it('supports functional updater', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 10));
    act(() => result.current[1]((prev) => prev + 5));
    expect(result.current[0]).toBe(15);
  });

  it('returns initial value when validator rejects stored data', () => {
    localStorage.setItem(KEY, JSON.stringify({ bad: 'shape' }));
    const isNumber = (v: unknown): v is number => typeof v === 'number';
    const { result } = renderHook(() => useLocalStorage(KEY, 99, isNumber));
    expect(result.current[0]).toBe(99);
  });
});
