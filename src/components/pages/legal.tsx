import { getDict, ROUTES, type Locale } from '@/i18n';
import { absoluteUrl, breadcrumbLd, graph, webPageLd } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { Crumbs, HubHero } from '@/components/blocks/shared';

export type LegalDocKey = 'privacy' | 'notice';

const ROUTE_KEY = { privacy: 'privacy', notice: 'legal' } as const;

/** A legal document: the slab, then one column of prose. */
export function LegalPage({ locale, doc }: { locale: Locale; doc: LegalDocKey }) {
  const dict = getDict(locale);
  const t = dict.legal[doc];
  const routeKey = ROUTE_KEY[doc];
  const url = absoluteUrl(ROUTES[routeKey][locale]);

  return (
    <main id="main" lang={locale} className="home">
      <JsonLd
        data={graph(
          webPageLd({ url, name: t.metaTitle, description: t.intro, locale }),
          breadcrumbLd([{ name: dict.nav.home, path: ROUTES.home[locale] }, { name: t.title, path: ROUTES[routeKey][locale] }], url),
        )}
      />
      <HubHero
        crumbs={<Crumbs items={[{ label: dict.nav.home, href: ROUTES.home[locale] }, { label: t.title }]} />}
        title={t.title}
        lede={t.updated}
      />
      <section className="sec">
        <div className="container">
          <div className="legal legal--body">
            <p className="legal-intro">{t.intro}</p>
            {t.sections.map((section) => (
              <section key={section.h}>
                <h2>{section.h}</h2>
                {section.p.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {'ul' in section && section.ul ? (
                  <ul>
                    {section.ul.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
