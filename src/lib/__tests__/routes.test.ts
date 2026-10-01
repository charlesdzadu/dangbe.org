import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROUTES, localizedPath, redirectMap } from '../../i18n';

const APP = join(__dirname, '..', '..', 'app');
const SITE = join(APP, '(site)');

/* A public page exists in both locales, or the switcher sends someone to a 404. */
describe('ROUTES', () => {
  for (const [key, pair] of Object.entries(ROUTES)) {
    if (key === 'login') continue;
    it(`${key} has a page in both locales`, () => {
      const fr = pair.fr === '/' ? SITE : join(SITE, pair.fr);
      const en = join(SITE, pair.en);
      expect(existsSync(join(fr, 'page.tsx')), `${pair.fr}`).toBe(true);
      expect(existsSync(join(en, 'page.tsx')), `${pair.en}`).toBe(true);
    });
  }

  it('switches locale on a known path and falls back to home', () => {
    expect(localizedPath('/programme', 'en')).toBe('/en/program');
    expect(localizedPath('/en/about', 'fr')).toBe('/a-propos');
    expect(localizedPath('/nope', 'en')).toBe('/en');
    expect(redirectMap()['/']).toBe('/en');
    expect(redirectMap()['/connexion']).toBeUndefined();
  });
});
