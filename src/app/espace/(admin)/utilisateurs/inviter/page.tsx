import type { Metadata } from 'next';
import Link from 'next/link';
import { InviteForm } from '@/components/forms/invite-form';
import { app } from '@/i18n/app/fr';

export const metadata: Metadata = { title: app.users.invite, robots: { index: false } };

export default function InvitePage() {
  return (
    <div className="page">
      <nav className="crumbs crumbs--app" aria-label="Breadcrumb">
        <Link href="/espace/utilisateurs">{app.users.title}</Link>
        <span aria-hidden="true"> · </span>
        <span aria-current="page">{app.users.invite}</span>
      </nav>
      <header className="page__head">
        <h1>{app.users.invite}</h1>
      </header>
      <section className="panel">
        <InviteForm />
      </section>
    </div>
  );
}
