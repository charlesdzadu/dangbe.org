'use client';

import { usePathname } from 'next/navigation';
import { localeFromPath, localizedPath, type Locale } from '@/i18n';

function remember(locale: Locale) {
  try {
    localStorage.setItem('dg-lang', locale);
  } catch {
    /* private mode */
  }
}

/**
 * FR/EN pills. A click stores the choice so auto-detection never overrides
 * it. The target is the SAME page in the other locale.
 */
export function LangSwitch({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);

  return (
    <span className={`lang-switch ${className}`}>
      <a href={localizedPath(pathname, 'fr')} data-active={locale === 'fr'} onClick={() => remember('fr')} lang="fr">
        FR
      </a>
      <a href={localizedPath(pathname, 'en')} data-active={locale === 'en'} onClick={() => remember('en')} lang="en">
        EN
      </a>
    </span>
  );
}
