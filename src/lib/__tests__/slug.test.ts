import { describe, expect, it } from 'vitest';
import { slugify } from '../utils/slug';

describe('slugify', () => {
  it('strips accents and punctuation', () => {
    expect(slugify('Pensée critique')).toBe('pensee-critique');
    expect(slugify('Résolution de problèmes')).toBe('resolution-de-problemes');
    expect(slugify('  Cohorte pilote 2026 !  ')).toBe('cohorte-pilote-2026');
  });
});
