import Link from 'next/link';
import { getDict, ROUTES, type Locale } from '@/i18n';
import { SKILL_ICONS, type SkillKey } from '@/lib/competencies';
import { PHOTOS } from '@/lib/photos';
import { absoluteUrl, breadcrumbLd, faqPageLd, graph, programLd, webPageLd } from '@/lib/seo';
import { ArrowRight, X } from '@/components/icons';
import { JsonLd } from '@/components/json-ld';
import { Reveal } from '@/components/reveal';
import { Crumbs, FaqBlock, HeroPhoto, HubHero, NumberedCards, SecHead, StartSlab, Ticks } from '@/components/blocks/shared';

const FILLS = ['fill-sand', 'fill-grey', 'fill-brume', 'fill-grey', 'fill-brume', 'fill-sand'];

export function ProgramPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.program;
  const url = absoluteUrl(ROUTES.program[locale]);

  return (
    <main id="main" lang={locale} className="home">
      <JsonLd
        data={graph(
          webPageLd({ url, name: t.metaTitle, description: t.metaDescription, locale }),
          programLd(locale, url),
          faqPageLd(t.faq.items, url),
          breadcrumbLd([{ name: dict.nav.home, path: ROUTES.home[locale] }, { name: t.crumb, path: ROUTES.program[locale] }], url),
        )}
      />

      <HubHero
        crumbs={<Crumbs items={[{ label: dict.nav.home, href: ROUTES.home[locale] }, { label: t.crumb }]} />}
        title={t.hero.h1}
        lede={t.hero.lede}
        actions={
          <>
            <Link href={ROUTES.apply[locale]} className="btn btn-ink">
              {t.hero.ctaApply}
              <ArrowRight size={18} className="arrow" />
            </Link>
            <Link href={`${ROUTES.home[locale]}#comment`} className="btn btn-outline">
              {t.hero.ctaHow}
            </Link>
          </>
        }
        aside={<HeroPhoto src={PHOTOS.programGraduation} />}
      />

      {/* ============ the six skills, as outcomes ============ */}
      <section className="sec" id="competences">
        <div className="container">
          <SecHead title={t.skills.title} lede={t.skills.lede} />
          <Reveal delay={0.05}>
            <div className="six">
              {t.skills.items.map((skill, i) => {
                const key = skill.key as SkillKey;
                const Icon = SKILL_ICONS[key];
                return (
                  <article key={skill.key} className={`card2 ${FILLS[i % FILLS.length]}`}>
                    <span className="card2__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{dict.shared.skills[key]}</h3>
                    <Ticks items={skill.ticks} />
                    <p className="card2__sources">
                      <span>{t.skills.sourcesLabel}</span>
                      <span className="chips">
                        {skill.sources.map((s) => (
                          <span key={s} className="chip chip--sm">
                            {s}
                          </span>
                        ))}
                      </span>
                    </p>
                  </article>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ three pathways, one table ============ */}
      <section className="sec" id="parcours">
        <div className="container">
          <SecHead title={t.pathways.title} lede={t.pathways.lede} />
          <Reveal delay={0.05}>
            <div className="card2 fill-grey">
              <div className="table-wrap">
                <table className="table2">
                  <thead>
                    <tr>
                      {t.pathways.headers.map((h, i) => (
                        <th key={i} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.pathways.rows.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        {row.values.map((v, i) => (
                          <td key={i}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="sec-note">{t.pathways.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ============ follow-up and mentoring ============ */}
      <section className="sec" id="suivi">
        <div className="container">
          <SecHead title={t.tracking.title} lede={t.tracking.lede} />
          <Reveal delay={0.05}>
            <div className="media3">
              <article className="card2 fill-sand">
                <span className="card2__num">01</span>
                <h3>{t.tracking.steps[0]?.title}</h3>
                <p>{t.tracking.steps[0]?.body}</p>
              </article>
              <article className="card2 fill-brume">
                <span className="card2__num">02</span>
                <h3>{t.tracking.steps[1]?.title}</h3>
                <p>{t.tracking.steps[1]?.body}</p>
              </article>
              <article className="card2 card2--photo card2--photo-text">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTOS.programMentoring} alt="" loading="lazy" decoding="async" crossOrigin="anonymous" />
                <span className="card2__num">03</span>
                <h3>{t.tracking.steps[2]?.title}</h3>
                <p>{t.tracking.steps[2]?.body}</p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ what the certificate is and is not ============ */}
      <section className="sec" id="certification">
        <div className="container">
          <SecHead title={t.certificate.title} center />
          <Reveal delay={0.05}>
            <div className="two">
              <article className="card2 card2--lg card2--ink">
                <h3>{t.certificate.is.title}</h3>
                <Ticks items={t.certificate.is.items} />
              </article>
              <article className="card2 card2--lg fill-sand">
                <h3>{t.certificate.isNot.title}</h3>
                <ul className="vlist">
                  {t.certificate.isNot.items.map((item) => (
                    <li key={item}>
                      <X />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqBlock title={t.faq.title} items={t.faq.items} id="faq" />

      <StartSlab
        title={t.cta.title}
        body={t.cta.body}
        primary={{ label: t.cta.primary, href: ROUTES.apply[locale] }}
        secondary={{ label: t.cta.secondary, href: ROUTES.home[locale] }}
        polaroids={PHOTOS.polaroids}
      />
    </main>
  );
}

export { NumberedCards };
