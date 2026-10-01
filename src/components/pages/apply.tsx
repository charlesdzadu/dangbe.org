import Link from 'next/link';
import { getDict, ROUTES, type Locale } from '@/i18n';
import { CONTACT_URL } from '@/lib/links';
import { applicationsOpen } from '@/lib/milestones';
import { PHOTOS } from '@/lib/photos';
import { absoluteUrl, breadcrumbLd, faqPageLd, graph, webPageLd } from '@/lib/seo';
import { ArrowRight, Mail } from '@/components/icons';
import { JsonLd } from '@/components/json-ld';
import { Reveal } from '@/components/reveal';
import { Crumbs, FaqBlock, HeroPhoto, HubHero, NumberedCards, SecHead, Ticks } from '@/components/blocks/shared';
import { ApplicationForm } from '@/components/forms/application-form';

export function ApplyPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.apply;
  const url = absoluteUrl(ROUTES.apply[locale]);
  const open = applicationsOpen();

  return (
    <main id="main" lang={locale} className="home">
      <JsonLd
        data={graph(
          webPageLd({ url, name: t.metaTitle, description: t.metaDescription, locale }),
          faqPageLd(t.faq.items, url),
          breadcrumbLd([{ name: dict.nav.home, path: ROUTES.home[locale] }, { name: t.crumb, path: ROUTES.apply[locale] }], url),
        )}
      />

      <HubHero
        crumbs={<Crumbs items={[{ label: dict.nav.home, href: ROUTES.home[locale] }, { label: t.crumb }]} />}
        title={t.hero.h1}
        lede={open ? t.hero.lede : t.hero.closed}
        actions={
          open ? (
            <a href="#candidature" className="btn btn-ink">
              {t.form.submit}
              <ArrowRight size={18} className="arrow" />
            </a>
          ) : (
            <a href={CONTACT_URL} className="btn btn-ink">
              <Mail size={18} />
              {dict.common.contact}
            </a>
          )
        }
        aside={<HeroPhoto src={PHOTOS.applyStudy} />}
      />

      {/* ============ eligibility ============ */}
      <section className="sec">
        <div className="container">
          <SecHead title={t.eligibility.title} />
          <Reveal delay={0.05}>
            <div className="two two--wide">
              <article className="card2 card2--lg fill-sand">
                <h3>{t.eligibility.can.title}</h3>
                <Ticks items={t.eligibility.can.items} />
              </article>
              <article className="card2 card2--lg fill-grey">
                <h3>{t.eligibility.look.title}</h3>
                <Ticks items={t.eligibility.look.items} />
                <p className="sec-note">{t.eligibility.look.note}</p>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ the form ============ */}
      {open ? (
        <section className="sec" id="candidature">
          <div className="container">
            <SecHead title={t.form.title} lede={t.form.intro} />
            <div className="card2 fill-grey form-card">
              <ApplicationForm locale={locale} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ what happens next ============ */}
      <section className="sec">
        <div className="container">
          <SecHead title={t.next.title} />
          <Reveal delay={0.05}>
            <NumberedCards items={t.next.steps} cols={3} fills={['fill-sand', 'fill-brume', 'fill-clay']} />
          </Reveal>
        </div>
      </section>

      <FaqBlock
        title={t.faq.title}
        items={t.faq.items}
        id="faq"
        action={
          <Link href={ROUTES.privacy[locale]} className="btn btn-outline">
            {t.form.fields.consentLink}
          </Link>
        }
      />
    </main>
  );
}

export function ApplyThanksPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.apply.thanks;
  return (
    <main id="main" lang={locale} className="home">
      <HubHero
        title={t.title}
        lede={t.body}
        actions={
          <>
            <Link href={ROUTES.home[locale]} className="btn btn-ink">
              {t.ctaHome}
              <ArrowRight size={18} className="arrow" />
            </Link>
            <Link href={ROUTES.program[locale]} className="btn btn-outline">
              {t.ctaProgram}
            </Link>
          </>
        }
      />
    </main>
  );
}
