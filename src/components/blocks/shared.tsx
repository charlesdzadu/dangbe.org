import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, Check, Plus } from '@/components/icons';
import { Reveal } from '@/components/reveal';
import { Polaroids } from './polaroids';

/**
 * The blocks every page shares — the page language (styles/blocks.css):
 * one colour slab to open a page, filled cards without rules, a heading with
 * its lede beside it, and never a small label above a big heading.
 */

export type Href = { label: ReactNode; href: string };

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

/** `<Link>` inside the site, `<a>` outside it. */
export function Anchor({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return isExternal(href) ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Crumbs({ items }: { items: readonly { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {i > 0 ? <span aria-hidden="true"> · </span> : null}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** The opening slab: breadcrumb, h1, lede, buttons — and, split, a card beside them. */
export function HubHero({
  crumbs,
  title,
  lede,
  actions,
  aside,
  fill = 'fill-sand',
}: {
  crumbs?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  fill?: 'fill-sand' | 'fill-brume' | 'fill-clay';
}) {
  const cls = ['wslab', fill, 'grid-bg', 'hub-hero', aside ? 'hub-hero--split' : ''].filter(Boolean).join(' ');
  return (
    <section className={cls}>
      <div className="hub-hero__copy">
        {crumbs}
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {actions ? <div className="btn-row">{actions}</div> : null}
      </div>
      {aside ? <div className="hub-hero__aside">{aside}</div> : null}
    </section>
  );
}

/** A photograph as a card beside the hero copy. */
export function HeroPhoto({ src }: { src: string }) {
  return (
    <figure className="card2 card2--photo hub-hero__photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="eager" decoding="async" crossOrigin="anonymous" />
    </figure>
  );
}

/** The wide photo slab with one line on it. */
export function PhotoSlab({
  src,
  title,
  body,
  cta,
}: {
  src: string;
  title: ReactNode;
  body?: ReactNode;
  cta?: Href;
}) {
  return (
    <section className="wslab quote-slab">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" decoding="async" crossOrigin="anonymous" />
      <Reveal>
        <p className="quote-slab__text">{title}</p>
        {body ? <p className="quote-slab__sub">{body}</p> : null}
        {cta ? (
          <div className="btn-row">
            <Anchor href={cta.href} className="btn btn-brand">
              {cta.label}
              <ArrowRight size={18} className="arrow" />
            </Anchor>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}

/** Figures in a row, each with its unit under it. Renders nothing without figures. */
export function FactsGrid({ items }: { items: readonly { value: string; label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="facts" style={{ '--cols': Math.min(items.length, 4) } as CSSProperties}>
      {items.map((item) => (
        <div className="fact" key={`${item.label}-${item.value}`}>
          <b>{item.value}</b>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SecHead({
  title,
  lede,
  center = false,
  id,
}: {
  title: ReactNode;
  lede?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  const cls = ['sec-head', center ? 'sec-head--center' : '', lede ? '' : 'sec-head--solo']
    .filter(Boolean)
    .join(' ');
  return (
    <Reveal>
      <header className={cls} id={id}>
        <h2>{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </header>
    </Reveal>
  );
}

/** The check list inside a card. */
export function Ticks({ items }: { items: readonly string[] }) {
  return (
    <ul className="ticks">
      {items.map((item) => (
        <li key={item}>
          <Check />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const FILLS = ['fill-sand', 'fill-clay', 'fill-grey', 'fill-brume'];

/** Short numbered cards, two or three a row. */
export function NumberedCards({
  items,
  cols = 3,
  fills = FILLS,
}: {
  items: readonly { title?: string; body: string }[];
  cols?: 2 | 3;
  fills?: readonly string[];
}) {
  return (
    <div className={cols === 2 ? 'steps2' : 'steps3'}>
      {items.map((item, i) => (
        <article key={item.title ?? item.body} className={`card2 ${fills[i % fills.length]}`}>
          <span className="card2__num">{String(i + 1).padStart(2, '0')}</span>
          {item.title ? <h3>{item.title}</h3> : null}
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

/** The FAQ layout: heading left, numbered list right. */
export function FaqBlock({
  title,
  aside,
  action,
  items,
  id = 'faq',
}: {
  title: ReactNode;
  aside?: ReactNode;
  action?: ReactNode;
  items: readonly { q: string; a: ReactNode }[];
  id?: string;
}) {
  return (
    <section className="sec" id={id}>
      <div className="container faq2">
        <div className="faq2__head">
          <h2>{title}</h2>
          {aside ? <p className="lede">{aside}</p> : null}
          {action ? <div className="btn-row">{action}</div> : null}
        </div>
        <div className="faq2__list">
          {items.map((item, i) => (
            <details key={`${i}-${item.q}`}>
              <summary>
                <span className="faq2__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq2__q">{item.q}</span>
                <Plus size={20} className="faq2__plus" />
              </summary>
              <div className="faq2__a">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A wrap of chips, linked or not. */
export function ChipLinks({ items }: { items: readonly { key: string; label: ReactNode; href?: string }[] }) {
  return (
    <div className="chips">
      {items.map((item) =>
        item.href ? (
          <Anchor key={item.key} href={item.href} className="chip">
            {item.label}
          </Anchor>
        ) : (
          <span key={item.key} className="chip">
            {item.label}
          </span>
        ),
      )}
    </div>
  );
}

/** The closing slab every page ends on. */
export function StartSlab({
  title,
  body,
  primary,
  secondary,
  cross,
  polaroids,
  primaryVariant = 'btn-ink',
}: {
  title: ReactNode;
  body?: ReactNode;
  primary: Href;
  secondary?: Href;
  cross?: ReactNode;
  polaroids?: readonly string[];
  primaryVariant?: 'btn-ink' | 'btn-brand';
}) {
  return (
    <section className="wslab fill-sand grid-bg cta2">
      {polaroids ? <Polaroids srcs={polaroids} /> : null}
      <div>
        <h2>{title}</h2>
        {body ? <p className="lede">{body}</p> : null}
        <div className="btn-row">
          <Anchor href={primary.href} className={`btn ${primaryVariant}`}>
            {primary.label}
            <ArrowRight size={18} className="arrow" />
          </Anchor>
          {secondary ? (
            <Anchor href={secondary.href} className="btn btn-outline">
              {secondary.label}
            </Anchor>
          ) : null}
        </div>
        {cross ? <p className="cta2__cross">{cross}</p> : null}
      </div>
    </section>
  );
}
