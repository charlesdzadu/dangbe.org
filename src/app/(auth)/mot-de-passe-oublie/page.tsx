import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotForm } from '@/components/forms/password-forms';
import { app } from '@/i18n/app/fr';

export const metadata: Metadata = { title: app.auth.forgot.title, robots: { index: false, follow: false } };

export default function ForgotPage() {
  const t = app.auth.forgot;
  return (
    <>
      <h1 className="auth__title">{t.title}</h1>
      <p className="auth__sub">{t.subtitle}</p>
      <ForgotForm />
      <p className="auth__links">
        <Link href="/connexion">{t.back}</Link>
      </p>
    </>
  );
}
