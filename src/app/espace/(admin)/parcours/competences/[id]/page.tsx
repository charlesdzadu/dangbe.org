import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompetencyForm } from '@/components/forms/curriculum-forms';
import { app } from '@/i18n/app/fr';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.curriculum.competencies, robots: { index: false } };

export default async function EditCompetencyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.competency.findUnique({ where: { id } });
  if (!c) notFound();
  const t = app.curriculum;
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours/competences">{t.competencies}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{c.nameFr}</span>
      </nav>
      <header className="page__head">
        <h1>{c.nameFr}</h1>
      </header>
      <section className="panel">
        <CompetencyForm initial={{ id: c.id, nameFr: c.nameFr, nameEn: c.nameEn, descriptionFr: c.descriptionFr ?? '', descriptionEn: c.descriptionEn ?? '', sortOrder: c.sortOrder, isActive: c.isActive }} />
      </section>
    </div>
  );
}
