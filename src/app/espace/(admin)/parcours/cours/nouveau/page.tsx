import type { Metadata } from 'next';
import Link from 'next/link';
import { CourseForm } from '@/components/forms/curriculum-forms';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.newCourse, robots: { index: false } };

export default async function NewCoursePage() {
  const t = app.curriculum;
  const competencies = await prisma.competency.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, nameFr: true } });
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours/cours">{t.courses}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{t.newCourse}</span>
      </nav>
      <header className="page__head">
        <h1>{t.newCourse}</h1>
      </header>
      <section className="panel">
        <CourseForm competencies={competencies} />
      </section>
    </div>
  );
}
