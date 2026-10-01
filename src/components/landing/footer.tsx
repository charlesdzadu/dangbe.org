'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDict, localeFromPath } from '@/i18n';
import { footerColumns, type FooterLink } from '@/lib/footer-links';
import { CONTACT_EMAIL, LINKEDIN_URL } from '@/lib/links';
import { BrandLockup } from '@/components/brand-lockup';
import { LinkedIn } from '@/components/icons';
import { LangSwitch } from '@/components/lang-switch';

function FooterAnchor({ link }: { link: FooterLink }) {
  return link.external ? <a href={link.href}>{link.label}</a> : <Link href={link.href}>{link.label}</Link>;
}

/**
 * A wide Sable slab: the brand column, three link columns, the plain
 * statement of independence, the outlined wordmark, the bottom line.
 */
export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = getDict(locale).footer;
  const columns = footerColumns(locale);

  return (
    <footer className="footer">
      <div className="container container--wide">
        <div className="footer-top">
          <div className="footer-col footer-brand">
            <BrandLockup size={44} />
            <p className="footer-tagline">{t.tagline}</p>
            {LINKEDIN_URL ? (
              <div className="footer-socials">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="footer-social"
                >
                  <LinkedIn size={18} />
                </a>
              </div>
            ) : null}
            <LangSwitch />
          </div>

          <nav className="footer-cols" aria-label={t.sitemap}>
            {columns.map((col) => (
              <div className="footer-col" key={col.heading}>
                <h3>{col.heading}</h3>
                {col.links.map((link) => (
                  <FooterAnchor key={link.href} link={link} />
                ))}
              </div>
            ))}
          </nav>
        </div>

        <p className="footer-disclaimer">{t.disclaimer}</p>

        <div className="footer-word" aria-hidden="true">
          dangbe<span>.</span>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} DANGBE · {t.madeIn}
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </div>
    </footer>
  );
}
