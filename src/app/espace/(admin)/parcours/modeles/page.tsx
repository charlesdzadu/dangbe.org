import type { Metadata } from 'next';
import Link from 'next/link';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.templates, robots: { index: false } };

export default async function TemplatesPage() {
  const t = app.curriculum;
  const rows = await prisma.pathwayTemplate.findMany({ orderBy: [{ type: 'asc' }, { name: 'asc' }], include: { _count: { select: { items: true, cohorts: true } } } });
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours">{t.title}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{t.templates}</span>
      </nav>
      <header className="page__head">
        <h1>{t.templates}</h1>
        <div className="page__actions">
          <Link href="/espace/parcours/modeles/nouveau" className="btn btn-ink btn-sm">
            {t.newTemplate}
          </Link>
        </div>
      </header>
      <div className="list">
        {rows.map((m) => (
          <Link key={m.id} href={`/espace/parcours/modeles/${m.id}`} className="list__item">
            <div className="list__main">
              <span className="list__title">{m.name}</span>
              <span className="list__sub">
                {app.labels.pathway[m.type]} · {m.targetWeeks} sem. · {m._count.items} {t.items} · {m._count.cohorts} {app.cohorts.title.toLowerCase()}
              </span>
            </div>
            <div className="list__aside">
              {m.isDefault ? <span className="badge badge--success">{t.default}</span> : null}
              {!m.isActive ? <span className="badge badge--muted">{t.archived}</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
