import type { Metadata } from 'next';
import Link from 'next/link';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.title, robots: { index: false } };

export default async function CurriculumHub() {
  const t = app.curriculum;
  const [competencies, courses, templates] = await Promise.all([
    prisma.competency.count({ where: { isActive: true } }),
    prisma.courseResource.count({ where: { isActive: true } }),
    prisma.pathwayTemplate.count({ where: { isActive: true } }),
  ]);
  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{t.title}</h1>
          <p className="muted">{t.lede}</p>
        </div>
      </header>
      <div className="tiles">
        <Link href="/espace/parcours/competences" className="tile">
          <b className="tile__value">{competencies}</b>
          <span className="tile__label">
            {t.competencies} {t.active}
          </span>
        </Link>
        <Link href="/espace/parcours/cours" className="tile">
          <b className="tile__value">{courses}</b>
          <span className="tile__label">
            {t.courses} {t.activeCourses}
          </span>
        </Link>
        <Link href="/espace/parcours/modeles" className="tile">
          <b className="tile__value">{templates}</b>
          <span className="tile__label">{t.templates}</span>
        </Link>
      </div>
    </div>
  );
}
