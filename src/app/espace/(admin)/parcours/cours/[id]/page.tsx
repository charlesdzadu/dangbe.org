import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CourseForm } from '@/components/forms/curriculum-forms';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.courses, robots: { index: false } };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [c, competencies] = await Promise.all([
    prisma.courseResource.findUnique({ where: { id }, include: { competencies: { select: { competencyId: true } } } }),
    prisma.competency.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, select: { id: true, nameFr: true } }),
  ]);
  if (!c) notFound();
  const t = app.curriculum;
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours/cours">{t.courses}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{c.title}</span>
      </nav>
      <header className="page__head">
        <h1>{c.title}</h1>
      </header>
      <section className="panel">
        <CourseForm
          competencies={competencies}
          initial={{
            id: c.id,
            title: c.title,
            provider: c.provider,
            url: c.url,
            language: c.language,
            estimatedHours: c.estimatedHours,
            isFree: c.isFree,
            hasCertificate: c.hasCertificate,
            certificateIsFree: c.certificateIsFree,
            description: c.description ?? '',
            isActive: c.isActive,
            competencyIds: c.competencies.map((cc) => cc.competencyId),
          }}
        />
      </section>
    </div>
  );
}
