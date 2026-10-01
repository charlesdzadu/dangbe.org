import { getDict, ROUTES, type Locale } from '@/i18n';
import { CONTACT_URL, surveyHref } from '@/lib/links';
import { buildFacts, buildTimeline } from '@/lib/milestones';
import { PHOTOS } from '@/lib/photos';
import { absoluteUrl, breadcrumbLd, faqPageLd, graph, webPageLd } from '@/lib/seo';
import { ArrowRight, Mail, X } from '@/components/icons';
import { JsonLd } from '@/components/json-ld';
import { Reveal } from '@/components/reveal';
import { Crumbs, FactsGrid, FaqBlock, HeroPhoto, HubHero, NumberedCards, SecHead, StartSlab, Ticks } from '@/components/blocks/shared';
import { Timeline } from '@/components/blocks/timeline';

export function EmployersPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.employers;
  const url = absoluteUrl(ROUTES.employers[locale]);
  const survey = surveyHref(locale);

  return (
    <main id="main" lang={locale} className="home">
      <JsonLd
        data={graph(
          webPageLd({ url, name: t.metaTitle, description: t.metaDescription, locale }),
          faqPageLd(t.faq.items, url),
          breadcrumbLd([{ name: dict.nav.home, path: ROUTES.home[locale] }, { name: t.crumb, path: ROUTES.employers[locale] }], url),
        )}
      />

      <HubHero
        fill="fill-clay"
        crumbs={<Crumbs items={[{ label: dict.nav.home, href: ROUTES.home[locale] }, { label: t.crumb }]} />}
        title={t.hero.h1}
        lede={t.hero.lede}
        actions={
          <>
            <a href={survey} className="btn btn-brand">
              {t.hero.ctaSurvey}
              <ArrowRight size={18} className="arrow" />
            </a>
            <a href={CONTACT_URL} className="btn btn-outline">
              {t.hero.ctaContact}
            </a>
          </>
        }
        aside={<HeroPhoto src={PHOTOS.employersHero} />}
      />

      {/* ============ why hire ============ */}
      <section className="sec">
        <div className="container">
          <SecHead title={t.why.title} lede={t.why.lede} />
          <Reveal delay={0.05}>
            <div className="three">
              <article className="card2 card2--lg card2--photo card2--photo-text">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PHOTOS.employersMeeting} alt="" loading="lazy" decoding="async" />
                <h3>{t.why.cards[0]?.title}</h3>
                <p>{t.why.cards[0]?.body}</p>
              </article>
              <article className="card2 card2--lg fill-sand">
                <h3>{t.why.cards[1]?.title}</h3>
                <p>{t.why.cards[1]?.body}</p>
              </article>
              <article className="card2 card2--lg fill-clay">
                <h3>{t.why.cards[2]?.title}</h3>
                <p>{t.why.cards[2]?.body}</p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ what we verify ============ */}
      <section className="sec">
        <div className="container">
          <SecHead title={t.verify.title} lede={t.verify.lede} />
          <Reveal delay={0.05}>
            <div className="two two--wide">
              <article className="card2 card2--lg fill-grey">
                <Ticks items={t.verify.ticks} />
              </article>
              <article className="card2 card2--lg card2--ink">
                <blockquote className="pull-quote">
                  <p>«&nbsp;{t.verify.quote}&nbsp;»</p>
                  <footer>{t.verify.quoteBy}</footer>
                </blockquote>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ the survey ============ */}
      <section className="sec" id="enquete">
        <div className="container">
          <Reveal>
            <div className="cslab fill-clay grid-bg cslab--pad">
              <h2>{t.survey.title}</h2>
              <p className="lede">{t.survey.body}</p>
              <Ticks items={t.survey.ticks} />
              <div className="btn-row">
                <a href={survey} className="btn btn-brand">
                  {t.survey.cta}
                  <ArrowRight size={18} className="arrow" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ the certificate ============ */}
      <section className="sec" id="certification">
        <div className="container">
          <SecHead title={t.certificate.title} center />
          <Reveal delay={0.05}>
            <div className="two">
              <article className="card2 card2--lg fill-sand">
                <h3>{t.certificate.is.title}</h3>
                <Ticks items={t.certificate.is.items} />
              </article>
              <article className="card2 card2--lg fill-grey">
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

      {/* ============ where we stand ============ */}
      <section className="sec" id="etapes">
        <div className="container">
          <SecHead title={t.progress.title} lede={t.progress.lede} />
          <Reveal delay={0.05}>
            <div className="cslab fill-sand grid-bg cslab--pad">
              <FactsGrid items={buildFacts(locale)} />
              <Timeline items={buildTimeline(locale)} statusLabels={dict.home.milestones.status} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ get involved ============ */}
      <section className="sec" id="impliquer">
        <div className="container">
          <SecHead title={t.involve.title} lede={t.involve.lede} />
          <Reveal delay={0.05}>
            <NumberedCards items={t.involve.items} cols={3} fills={['fill-sand', 'fill-brume', 'fill-clay']} />
            <div className="btn-row">
              <a href={CONTACT_URL} className="btn btn-outline">
                <Mail size={18} />
                {t.involve.cta}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqBlock title={t.faq.title} items={t.faq.items} id="faq" />

      <StartSlab
        title={t.cta.title}
        body={t.cta.body}
        primary={{ label: t.cta.primary, href: survey }}
        primaryVariant="btn-brand"
        secondary={{ label: t.cta.secondary, href: CONTACT_URL }}
      />
    </main>
  );
}
