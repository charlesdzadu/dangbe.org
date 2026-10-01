import type { Metadata } from 'next';
import Link from 'next/link';
import { TemplateForm } from '@/components/forms/curriculum-forms';
import { app } from '@/i18n/app/fr';

export const metadata: Metadata = { title: app.curriculum.newTemplate, robots: { index: false } };

export default function NewTemplatePage() {
  const t = app.curriculum;
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/parcours/modeles">{t.templates}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{t.newTemplate}</span>
      </nav>
      <header className="page__head">
        <h1>{t.newTemplate}</h1>
      </header>
      <section className="panel">
        <TemplateForm />
      </section>
    </div>
  );
}
