'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES, getDict, localeFromPath } from '@/i18n';
import { surveyHref } from '@/lib/links';
import { BrandLockup } from '@/components/brand-lockup';
import { LangSwitch } from '@/components/lang-switch';
import { Menu, X } from '@/components/icons';

/**
 * The bar: a floating white card over every page's first slab. Three links,
 * the language switch, a ghost "sign in" and ONE primary — « Postuler »
 * everywhere except the employers page, where the survey takes the seat.
 *
 * Below 860 px the burger opens a flat sheet with the same destinations.
 * Escape, a route change and the burger close it; the page behind it does
 * not scroll while it is open.
 */
export function Nav() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const dict = getDict(locale);
  const t = dict.nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const active = (href: string) => pathname === href;

  const links = [
    { href: ROUTES.program[locale], label: t.program },
    { href: ROUTES.employers[locale], label: t.employers },
    { href: ROUTES.about[locale], label: t.about },
  ];

  const onEmployers = pathname === ROUTES.employers.fr || pathname === ROUTES.employers.en;
  const survey = surveyHref(locale);

  return (
    <>
      <a className="skip-link" href="#main">
        {dict.common.skipToContent}
      </a>

      <header className="nav nav--card" data-scrolled={scrolled || open}>
        <div className="container nav-inner">
          <div className="nav-brand">
            <Link href={ROUTES.home[locale]} className="nav-logo" aria-label={t.home}>
              <BrandLockup size={52} />
            </Link>
          </div>

          <nav className="nav-links" aria-label={t.main}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link" data-active={active(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <LangSwitch className="nav-lang" />
            <Link href={ROUTES.login[locale]} className="nav-login btn btn-ghost btn-sm">
              {t.login}
            </Link>
            {onEmployers ? (
              <a href={survey} className="nav-cta btn btn-sm btn-brand">
                {t.survey}
              </a>
            ) : (
              <Link href={ROUTES.apply[locale]} className="nav-cta btn btn-sm btn-ink">
                {t.apply}
              </Link>
            )}
            <button
              type="button"
              className="nav-icon-btn nav-burger"
              aria-label={open ? t.closeMenu : t.openMenu}
              aria-expanded={open}
              aria-controls="nav-mobile"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <nav className="nav-mobile" id="nav-mobile" aria-label={t.mobile}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-active={active(link.href)}>
              {link.label}
            </Link>
          ))}
          <hr />
          <Link href={ROUTES.apply[locale]} className="btn btn-ink btn-block">
            {t.apply}
          </Link>
          <a href={survey} className="btn btn-outline btn-block">
            {t.surveyLong}
          </a>
          <Link href={ROUTES.login[locale]} className="btn btn-ghost btn-block">
            {t.login}
          </Link>
        </nav>
      )}
    </>
  );
}
