import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CohortForm } from '@/components/forms/cohort-form';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';
import { toDateInput } from '@/lib/utils/dates';

export const metadata: Metadata = { title: app.common.edit, robots: { index: false } };

export default async function EditCohortPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('ADMIN');
  const { id } = await params;
  const [cohort, templates] = await Promise.all([
    prisma.cohort.findUnique({ where: { id } }),
    prisma.pathwayTemplate.findMany({ where: { isActive: true }, orderBy: [{ type: 'asc' }, { name: 'asc' }], select: { id: true, name: true, type: true } }),
  ]);
  if (!cohort) notFound();
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/cohortes">{app.cohorts.title}</Link>
        <span aria-hidden="true"> · </span>
        <Link href={`/espace/cohortes/${cohort.id}`}>{cohort.name}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{app.common.edit}</span>
      </nav>
      <header className="page__head">
        <h1>{cohort.name}</h1>
      </header>
      <section className="panel">
        <CohortForm
          templates={templates}
          initial={{
            id: cohort.id,
            name: cohort.name,
            pathwayType: cohort.pathwayType,
            pathwayTemplateId: cohort.pathwayTemplateId,
            startDate: toDateInput(cohort.startDate),
            endDate: toDateInput(cohort.endDate),
            status: cohort.status,
            description: cohort.description ?? '',
          }}
        />
      </section>
    </div>
  );
}
