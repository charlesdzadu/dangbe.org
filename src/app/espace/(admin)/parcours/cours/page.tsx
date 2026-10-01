import type { Metadata } from 'next';
import Link from 'next/link';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.courses, robots: { index: false } };

export default async function CoursesPage() {
  const t = app.curriculum;
  const rows = await prisma.courseResource.findMany({
    orderBy: [{ isActive: 'desc' }, { provider: 'asc' }, { title: 'asc' }],
    include: { competencies: { include: { competency: { select: { nameFr: true } } } } },
  });
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours">{t.title}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{t.courses}</span>
      </nav>
      <header className="page__head">
        <h1>{t.courses}</h1>
        <div className="page__actions">
          <Link href="/espace/parcours/cours/nouveau" className="btn btn-ink btn-sm">
            {t.newCourse}
          </Link>
        </div>
      </header>
      <div className="list">
        {rows.map((c) => (
          <Link key={c.id} href={`/espace/parcours/cours/${c.id}`} className="list__item">
            <div className="list__main">
              <span className="list__title">{c.title}</span>
              <span className="list__sub">
                {c.provider} · {app.participant.languageOf[c.language]} · {c.estimatedHours} {t.hours} · {c.competencies.map((cc) => cc.competency.nameFr).join(', ') || '—'}
              </span>
            </div>
            <div className="list__aside">
              {c.hasCertificate ? <span className="badge badge--muted">{c.certificateIsFree ? app.participant.certFree : app.participant.certPaid}</span> : null}
              {!c.isActive ? <span className="badge badge--muted">{t.archived}</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
