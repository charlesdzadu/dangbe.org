import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/links';

/* Everything public is open, including to the AI crawlers, named explicitly:
 * a graduate or an employer asks an assistant about DANGBE before typing it
 * into a search box, and a blocked crawler cannot cite what it never read.
 * The authenticated space is not for crawling. */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'DuckAssistBot',
];

const PRIVATE = ['/connexion', '/espace', '/api/', '/invitation/', '/reinitialiser/', '/mot-de-passe-oublie'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: PRIVATE })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
