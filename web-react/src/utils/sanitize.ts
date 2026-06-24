import type { QuestionPack } from '../types';

export function sanitizeName(input: string | undefined | null, fallback: string): string {
  const trimmed = String(input ?? '').trim();
  return trimmed.length ? trimmed : fallback;
}

export function validatePackSchema(pack: unknown): string[] {
  const errors: string[] = [];
  if (!pack || typeof pack !== 'object') {
    errors.push('Pack must be an object');
    return errors;
  }
  const p = pack as Record<string, unknown>;
  if (typeof p['id'] !== 'string' || !p['id']) errors.push('Pack must have a string id');
  if (typeof p['name'] !== 'string' || !p['name']) errors.push('Pack must have a string name');
  if (typeof p['topic'] !== 'string' || !p['topic']) errors.push('Pack must have a string topic');
  if (!Array.isArray(p['categories'])) {
    errors.push('Pack must have a categories array');
    return errors;
  }
  (p['categories'] as unknown[]).forEach((cat, ci) => {
    if (!cat || typeof cat !== 'object') {
      errors.push(`Category ${ci} must be an object`);
      return;
    }
    const c = cat as Record<string, unknown>;
    if (typeof c['name'] !== 'string') errors.push(`Category ${ci} must have a string name`);
    if (!Array.isArray(c['questions'])) {
      errors.push(`Category ${ci} must have a questions array`);
      return;
    }
    (c['questions'] as unknown[]).forEach((q, qi) => {
      if (!q || typeof q !== 'object') {
        errors.push(`Category ${ci} question ${qi} must be an object`);
        return;
      }
      const question = q as Record<string, unknown>;
      if (typeof question['id'] !== 'string') errors.push(`Category ${ci} question ${qi} missing id`);
      if (typeof question['targetWord'] !== 'string') errors.push(`Category ${ci} question ${qi} missing targetWord`);
      if (typeof question['level'] !== 'number') errors.push(`Category ${ci} question ${qi} missing level`);
    });
  });
  return errors;
}

export function exportPackAsJson(pack: QuestionPack): void {
  const json = JSON.stringify(pack, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pack.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
