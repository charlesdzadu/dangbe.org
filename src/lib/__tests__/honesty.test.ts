import { describe, expect, it } from 'vitest';
import { en } from '../../i18n/en';
import { fr } from '../../i18n/fr';

/* A figure on the milestones comes from lib/milestones or it does not exist:
 * no typed count may sit next to the words that would present it as one. */
const COUNT_WORDS = /\d+\s*(réponses|candidatures|diplômés|certifiés|responses|applications|graduates|certified)/i;

describe('milestone copy carries no typed figures', () => {
  for (const [name, dict] of [
    ['fr', fr],
    ['en', en],
  ] as const) {
    it(name, () => {
      const text = JSON.stringify(dict.home.milestones);
      expect(text).not.toMatch(COUNT_WORDS);
    });
  }
});
