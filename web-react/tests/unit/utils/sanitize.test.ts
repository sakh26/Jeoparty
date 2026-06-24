import { describe, it, expect } from 'vitest';
import { sanitizeName, validatePackSchema } from '../../../src/utils/sanitize';
import { MOCK_PACK } from '../../fixtures';

describe('sanitizeName', () => {
  it('returns trimmed input when non-empty', () => {
    expect(sanitizeName('  Alice  ', 'default')).toBe('Alice');
  });

  it('returns fallback when input is empty', () => {
    expect(sanitizeName('', 'fallback')).toBe('fallback');
  });

  it('returns fallback when input is whitespace only', () => {
    expect(sanitizeName('   ', 'fallback')).toBe('fallback');
  });

  it('returns fallback when input is null', () => {
    expect(sanitizeName(null, 'fallback')).toBe('fallback');
  });

  it('returns fallback when input is undefined', () => {
    expect(sanitizeName(undefined, 'fallback')).toBe('fallback');
  });
});

describe('validatePackSchema', () => {
  it('returns empty array for a valid pack', () => {
    const errors = validatePackSchema(MOCK_PACK);
    expect(errors).toHaveLength(0);
  });

  it('returns error when pack is not an object', () => {
    expect(validatePackSchema('not a pack')).toContain('Pack must be an object');
  });

  it('returns error when id is missing', () => {
    const errors = validatePackSchema({ ...MOCK_PACK, id: '' });
    expect(errors.some((e) => e.includes('id'))).toBe(true);
  });

  it('returns error when categories is not an array', () => {
    const errors = validatePackSchema({ ...MOCK_PACK, categories: 'nope' });
    expect(errors.some((e) => e.includes('categories'))).toBe(true);
  });

  it('returns errors for questions missing targetWord', () => {
    const badPack = {
      ...MOCK_PACK,
      categories: [{
        name: 'Test',
        questions: [{ id: 'q1', level: 1 }], // missing targetWord
      }],
    };
    const errors = validatePackSchema(badPack);
    expect(errors.some((e) => e.includes('targetWord'))).toBe(true);
  });
});
