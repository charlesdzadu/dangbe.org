import type { fr } from '../fr';

export const shared: typeof fr.shared = {
  skills: {
    digital: 'Digital literacy',
    critical: 'Critical thinking',
    problem: 'Problem-solving',
    logic: 'Logical reasoning',
    team: 'Teamwork',
    adapt: 'Adaptability',
  },
  pathways: {
    short: { name: 'Short pathway', duration: 'about 3 months' },
    medium: { name: 'Medium pathway', duration: '6 months' },
    long: { name: 'Long pathway', duration: 'at your own pace' },
  },
  langs: ['French', 'English'],
  free: 'Free',
  online: 'Online',
};
