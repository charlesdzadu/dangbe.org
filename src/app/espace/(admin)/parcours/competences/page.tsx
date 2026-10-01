import type { Metadata } from 'next';
import Link from 'next/link';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.competencies, robots: { index: false } };

export default async function CompetenciesPage() {
  const t = app.curriculum;
  const rows = await prisma.competency.findMany({ orderBy: { sortOrder: 'asc' }, include: { _count: { select: { courses: true } } } });
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours">{t.title}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{t.competencies}</span>
      </nav>
      <header className="page__head">
        <h1>{t.competencies}</h1>
        <div className="page__actions">
          <Link href="/espace/parcours/competences/nouvelle" className="btn btn-ink btn-sm">
            {t.newCompetency}
          </Link>
        </div>
      </header>
      <div className="list">
        {rows.map((c) => (
          <Link key={c.id} href={`/espace/parcours/competences/${c.id}`} className="list__item">
            <div className="list__main">
              <span className="list__title">
                {c.sortOrder + 1}. {c.nameFr}
              </span>
              <span className="list__sub">
                {c.nameEn} · {c._count.courses} {t.items}
              </span>
            </div>
            <div className="list__aside">{!c.isActive ? <span className="badge badge--muted">{t.archived}</span> : null}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
