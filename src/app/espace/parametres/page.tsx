import type { Metadata } from 'next';
import { PasswordForm, ProfileForm } from '@/components/forms/settings-forms';
import { app } from '@/i18n/app/fr';
import { requireUser } from '@/lib/auth/guards';
import { prisma } from '@/lib/db/prisma';

export const metadata: Metadata = { title: app.settings.title, robots: { index: false } };

export default async function SettingsPage() {
  const user = await requireUser();
  const row = await prisma.user.findUniqueOrThrow({ where: { id: user.id }, select: { firstName: true, lastName: true, phone: true, locale: true, email: true } });
  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>{app.settings.title}</h1>
          <p className="muted">{row.email}</p>
        </div>
      </header>
      <div className="grid-2up">
        <section className="panel">
          <h2>{app.settings.profile}</h2>
          <ProfileForm initial={{ firstName: row.firstName, lastName: row.lastName, phone: row.phone ?? '', locale: row.locale }} />
        </section>
        <section className="panel">
          <h2>{app.settings.password}</h2>
          <PasswordForm />
        </section>
      </div>
    </div>
  );
}
