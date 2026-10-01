import type { Metadata } from 'next';
import Link from 'next/link';
import { CompetencyForm } from '@/components/forms/curriculum-forms';
import { app } from '@/i18n/app/fr';

export const metadata: Metadata = { title: app.curriculum.newCompetency, robots: { index: false } };

export default function NewCompetencyPage() {
  const t = app.curriculum;
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours/competences">{t.competencies}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{t.newCompetency}</span>
      </nav>
      <header className="page__head">
        <h1>{t.newCompetency}</h1>
      </header>
      <section className="panel">
        <CompetencyForm />
      </section>
    </div>
  );
}
