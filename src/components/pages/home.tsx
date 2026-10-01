import type { CSSProperties } from 'react';
import Link from 'next/link';
import { getDict, ROUTES, type Locale } from '@/i18n';
import { SKILL_ICONS, type SkillKey } from '@/lib/competencies';
import { CONTACT_URL, surveyHref } from '@/lib/links';
import { applicationsOpen, buildFacts, buildTimeline } from '@/lib/milestones';
import { PHOTOS } from '@/lib/photos';
import { ArrowRight, Briefcase, Mail, Users } from '@/components/icons';
import { Reveal } from '@/components/reveal';
import { FactsGrid, FaqBlock, StartSlab, Ticks } from '@/components/blocks/shared';
import { Timeline } from '@/components/blocks/timeline';

const SKILL_FILLS = ['fill-sand', 'fill-grey', 'fill-brume'];
const PATH_FILLS = ['fill-sand', 'fill-clay', 'fill-brume'];

/**
 * The homepage, in the order it argues: hero → the two audiences → the six
 * skills → how it works → the three pathways → employers → the team → where
 * we stand → questions → start. Ten sections, generous air between them.
 *
 * Honesty rules: no figure is typed here (lib/milestones renders a fact only
 * when one exists); nobody in a photograph is presented as a participant;
 * the site never promises a job.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.home;
  const survey = surveyHref(locale);

  const facts = buildFacts(locale);
  const timeline = buildTimeline(locale);

  return (
    <main id="main" lang={locale} className="home">
      {/* ============ hero — two cards with a gutter ============ */}
      <section className="hero2">
        <div className="hero2__copy fill-sand grid-bg">
          <div>
            <h1 className="fade-up" style={{ '--d': '0.08s' } as CSSProperties}>
              {t.hero.h1}
            </h1>
            <p className="lede fade-up" style={{ '--d': '0.18s' } as CSSProperties}>
              {t.hero.lede}
            </p>
            <div className="btn-row fade-up" style={{ '--d': '0.26s' } as CSSProperties}>
              <Link href={ROUTES.apply[locale]} className="btn btn-ink">
                {t.hero.ctaApply}
                <ArrowRight size={18} className="arrow" />
              </Link>
              <Link href={ROUTES.program[locale]} className="btn btn-outline">
                {t.hero.ctaProgram}
              </Link>
            </div>
            <div className="hero2__trust fade-up" style={{ '--d': '0.34s' } as CSSProperties}>
              <div className="hero2__trust-row">
                {t.hero.trust.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hero2__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTOS.hero} alt="" loading="eager" decoding="async" crossOrigin="anonymous" fetchPriority="high" />
          <div className="hero2__card">
            <div className="hero2__card-head">
              <div>
                <p className="hero2__card-title">{t.hero.card.title}</p>
                <p className="hero2__card-sub">{applicationsOpen() ? t.hero.card.subOpen : t.hero.card.subSoon}</p>
              </div>
            </div>
            <ul className="hero2__rows">
              {t.hero.card.rows.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  <b>{row.value}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ two audiences ============ */}
      <section className="sec">
        <div className="container">
          <Reveal>
            <header className="sec-head">
              <h2>{t.who.title}</h2>
              <p className="lede">{t.who.lede}</p>
            </header>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="steps2">
              <article className="card2 card2--lg fill-sand">
                <span className="card2__icon" aria-hidden="true">
                  <Users />
                </span>
                <h3>{t.who.graduates.title}</h3>
                <Ticks items={t.who.graduates.ticks} />
                <div className="btn-row">
                  <Link href={ROUTES.apply[locale]} className="btn btn-ink btn-sm">
                    {t.who.graduates.cta}
                    <ArrowRight size={16} className="arrow" />
                  </Link>
                </div>
              </article>
              <article className="card2 card2--lg fill-clay">
                <span className="card2__icon" aria-hidden="true">
                  <Briefcase />
                </span>
                <h3>{t.who.employers.title}</h3>
                <Ticks items={t.who.employers.ticks} />
                <div className="btn-row">
                  <a href={survey} className="btn btn-brand btn-sm">
                    {t.who.employers.cta}
                    <ArrowRight size={16} className="arrow" />
                  </a>
                </div>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ six skills ============ */}
      <section className="sec" id="competences">
        <div className="container">
          <Reveal>
            <header className="sec-head">
              <h2>{t.skills.title}</h2>
              <p className="lede">{t.skills.lede}</p>
            </header>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="six">
              {t.skills.items.map((skill, i) => {
                const Icon = SKILL_ICONS[skill.key as SkillKey];
                return (
                  <article key={skill.key} className={`card2 ${SKILL_FILLS[(i + Math.floor(i / 3)) % SKILL_FILLS.length]}`}>
                    <span className="card2__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{skill.title}</h3>
                    <p>{skill.body}</p>
                  </article>
                );
              })}
            </div>
            <p className="sec-note">{t.skills.note}</p>
            <div className="btn-row">
              <Link href={ROUTES.program[locale]} className="btn btn-outline">
                {t.skills.cta}
                <ArrowRight size={18} className="arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ how it works — contained slab ============ */}
      <section className="sec" id="comment">
        <div className="container">
          <Reveal>
            <header className="sec-head sec-head--center">
              <h2>{t.how.title}</h2>
              <p className="lede">{t.how.lede}</p>
            </header>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="cslab fill-sand grid-bg cslab--pad">
              <div className="steps2">
                {t.how.steps.map((step, i) => (
                  <article key={step.title} className="card2 fill-white">
                    <span className="card2__num">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ three pathways ============ */}
      <section className="sec" id="parcours">
        <div className="container">
          <Reveal>
            <header className="sec-head">
              <h2>{t.paths.title}</h2>
              <p className="lede">{t.paths.lede}</p>
            </header>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="three">
              {t.paths.items.map((path, i) => (
                <article key={path.key} className={`card2 card2--lg ${PATH_FILLS[i % PATH_FILLS.length]}`}>
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                  <Ticks items={t.paths.ticks} />
                </article>
              ))}
            </div>
            <div className="chips chips-after">
              {dict.shared.langs.map((lang) => (
                <span key={lang} className="chip">
                  {lang}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ employers — dark contained slab ============ */}
      <section className="sec" id="employeurs">
        <div className="container">
          <Reveal>
            <div className="cslab fill-ink grid-bg cslab--pad cslab--split">
              <div>
                <h2>{t.employers.title}</h2>
                <p className="lede">{t.employers.lede}</p>
                <blockquote className="pull-quote">
                  <p>«&nbsp;{t.employers.quote}&nbsp;»</p>
                  <footer>{t.employers.quoteBy}</footer>
                </blockquote>
                <div className="btn-row">
                  <a href={survey} className="btn btn-brand">
                    {t.employers.ctaSurvey}
                    <ArrowRight size={18} className="arrow" />
                  </a>
                  <Link href={ROUTES.employers[locale]} className="btn btn-outline">
                    {t.employers.ctaWhy}
                  </Link>
                </div>
              </div>
              <div className="cslab__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTOS.employersHandshake} alt="" loading="lazy" decoding="async" crossOrigin="anonymous" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ the team ============ */}
      <section className="sec" id="equipe">
        <div className="container">
          <Reveal>
            <header className="sec-head">
              <h2>{t.team.title}</h2>
              <p className="lede">{t.team.lede}</p>
            </header>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="media3">
              <article className="card2 fill-sand">
                <h3>{t.team.who.title}</h3>
                <p>{t.team.who.body}</p>
              </article>
              <article className="card2 fill-grey">
                <h3>{t.team.not.title}</h3>
                <p>{t.team.not.body}</p>
              </article>
              <figure className="card2 card2--photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTOS.teamCowork} alt="" loading="lazy" decoding="async" crossOrigin="anonymous" />
              </figure>
            </div>
            <div className="btn-row">
              <Link href={`${ROUTES.about[locale]}#equipe`} className="btn btn-outline">
                {t.team.cta}
                <ArrowRight size={18} className="arrow" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ where we stand — the timeline ============ */}
      <section className="sec" id="etapes">
        <div className="container">
          <Reveal>
            <header className="sec-head">
              <h2>{t.milestones.title}</h2>
              <p className="lede">{t.milestones.lede}</p>
            </header>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="cslab fill-sand grid-bg cslab--pad">
              <FactsGrid items={facts} />
              <Timeline items={timeline} statusLabels={t.milestones.status} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ questions ============ */}
      <FaqBlock
        title={t.faq.title}
        aside={t.faq.aside}
        action={
          <a href={CONTACT_URL} className="btn btn-outline">
            <Mail size={18} />
            {t.faq.action}
          </a>
        }
        items={t.faq.items}
      />

      {/* ============ start ============ */}
      <StartSlab
        title={t.cta.title}
        body={t.cta.body}
        primary={{ label: t.cta.primary, href: ROUTES.apply[locale] }}
        secondary={{ label: t.cta.secondary, href: survey }}
        polaroids={PHOTOS.polaroids}
        cross={
          <>
            {t.cta.crossText} <Link href={`${ROUTES.employers[locale]}#certification`}>{t.cta.crossLink}</Link>
          </>
        }
      />
    </main>
  );
}

/** The nodes every locale's home page declares — shared by the FR and EN routes. */
export function homeStructuredData(locale: Locale) {
  const t = getDict(locale).home;
  return {
    faq: t.faq.items,
    steps: t.how.steps,
    howToName: t.how.title,
  };
}
