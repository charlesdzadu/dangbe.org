import type { Metadata } from 'next';
import Link from 'next/link';
import { CohortForm } from '@/components/forms/cohort-form';
import { app } from '@/i18n/app/fr';
import { requireRole } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.cohorts.new, robots: { index: false } };

export default async function NewCohortPage() {
  await requireRole('ADMIN');
  const templates = await prisma.pathwayTemplate.findMany({ where: { isActive: true }, orderBy: [{ type: 'asc' }, { name: 'asc' }], select: { id: true, name: true, type: true } });
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/cohortes">{app.cohorts.title}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{app.cohorts.new}</span>
      </nav>
      <header className="page__head">
        <h1>{app.cohorts.new}</h1>
      </header>
      <section className="panel">
        <CohortForm templates={templates} />
      </section>
    </div>
  );
}
