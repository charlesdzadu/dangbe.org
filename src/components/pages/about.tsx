import { getDict, ROUTES, type Locale } from '@/i18n';
import { CONTACT_URL, LINKEDIN_URL, surveyHref } from '@/lib/links';
import { PHOTOS } from '@/lib/photos';
import { absoluteUrl, breadcrumbLd, graph, webPageLd } from '@/lib/seo';
import { TEAM, initials } from '@/lib/team';
import { LinkedIn, Mail } from '@/components/icons';
import { JsonLd } from '@/components/json-ld';
import { Reveal } from '@/components/reveal';
import { Crumbs, HubHero, PhotoSlab, SecHead, StartSlab, Ticks } from '@/components/blocks/shared';

const PILLAR_FILLS = ['fill-sand', 'fill-brume', 'fill-clay'];

/** The continuity motif: one line that keeps going, and the dot at its head. */
function Loop() {
  return (
    <svg viewBox="0 0 320 240" className="loop-mark" aria-hidden="true" focusable="false">
      <path
        d="M20 200 C 60 200, 60 60, 110 60 S 160 200, 210 200 S 260 60, 300 60"
        fill="none"
        stroke="var(--signal-ink)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="300" cy="60" r="9" fill="var(--signal)" />
    </svg>
  );
}

export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.about;
  const url = absoluteUrl(ROUTES.about[locale]);

  return (
    <main id="main" lang={locale} className="home">
      <JsonLd
        data={graph(
          webPageLd({ url, name: t.metaTitle, description: t.metaDescription, locale }),
          breadcrumbLd([{ name: dict.nav.home, path: ROUTES.home[locale] }, { name: t.crumb, path: ROUTES.about[locale] }], url),
        )}
      />

      <HubHero
        crumbs={<Crumbs items={[{ label: dict.nav.home, href: ROUTES.home[locale] }, { label: t.crumb }]} />}
        title={t.hero.h1}
        lede={t.hero.lede}
      />

      {/* ============ mission, vision, values ============ */}
      <section className="sec">
        <div className="container">
          <SecHead title={t.pillars.title} />
          <Reveal delay={0.05}>
            <div className="steps3">
              {t.pillars.items.map((item, i) => (
                <article key={item.title} className={`card2 ${PILLAR_FILLS[i % PILLAR_FILLS.length]}`}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ the name ============ */}
      <section className="sec">
        <div className="container">
          <Reveal>
            <div className="cslab fill-sand grid-bg cslab--pad cslab--split">
              <div>
                <h2>{t.name.title}</h2>
                <p className="lede">{t.name.body1}</p>
                <p className="lede">{t.name.body2}</p>
              </div>
              <div className="cslab__photo cslab__mark">
                <Loop />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ independence + the fellows ============ */}
      <section className="sec">
        <div className="container">
          <Reveal>
            <div className="two two--wide">
              <article className="card2 card2--lg card2--ink">
                <h3>{t.independence.title}</h3>
                <p>{t.independence.body}</p>
              </article>
              <article className="card2 card2--lg fill-grey">
                <h3>{t.fellows.title}</h3>
                <p>{t.fellows.body}</p>
                <Ticks items={t.fellows.ticks} />
                <p className="sec-note">{t.fellows.note}</p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ the team ============ */}
      <section className="sec" id="equipe">
        <div className="container">
          <SecHead title={t.team.title} lede={t.team.lede} />
          <Reveal delay={0.05}>
            {TEAM.length === 0 ? (
              <div className="card2 fill-sand">
                <p>{t.team.empty}</p>
              </div>
            ) : (
              <div className="people">
                {TEAM.map((member) => (
                  <figure key={member.id}>
                    {member.photo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={member.photo} alt="" loading="lazy" decoding="async" crossOrigin="anonymous" />
                    ) : (
                      <div className="people__initials" aria-hidden="true">
                        {initials(member.name)}
                      </div>
                    )}
                    <figcaption>
                      <strong>{member.name}</strong>
                      {member.role[locale]}
                      {member.based ? ` · ${t.team.basedIn} ${member.based}` : ''}
                      {member.mwfYear ? <br /> : null}
                      {member.mwfYear ? t.team.mwf.replace('{year}', String(member.mwfYear)) : null}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <PhotoSlab src={PHOTOS.lome} title={t.slab.title} body={t.slab.body} />

      {/* ============ contact ============ */}
      <section className="sec" id="contact">
        <div className="container">
          <Reveal>
            <div className="two two--wide">
              <article className="card2 card2--lg fill-sand">
                <h3>{t.contact.title}</h3>
                <p>{t.contact.body}</p>
                <div className="btn-row">
                  <a href={CONTACT_URL} className="btn btn-ink">
                    <Mail size={18} />
                    {t.contact.email}
                  </a>
                  {LINKEDIN_URL ? (
                    <a href={LINKEDIN_URL} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                      <LinkedIn size={18} />
                      {t.contact.linkedin}
                    </a>
                  ) : null}
                </div>
              </article>
              <figure className="card2 card2--photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTOS.aboutGroup} alt="" loading="lazy" decoding="async" crossOrigin="anonymous" />
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      <StartSlab
        title={t.cta.title}
        body={t.cta.body}
        primary={{ label: t.cta.primary, href: ROUTES.apply[locale] }}
        secondary={{ label: t.cta.secondary, href: surveyHref(locale) }}
      />
    </main>
  );
}
