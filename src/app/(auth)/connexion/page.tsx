import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/forms/login-form';
import { app } from '@/i18n/app/fr';
import { getCurrentUser } from '@/lib/auth/session';
import { safeNext } from '@/lib/auth/guards';

export const metadata: Metadata = { title: app.auth.login.title, robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reset?: string }> }) {
  const { next, reset } = await searchParams;
  if (await getCurrentUser()) redirect(safeNext(next));
  const t = app.auth.login;
  return (
    <>
      <h1 className="auth__title">{t.title}</h1>
      <p className="auth__sub">{t.subtitle}</p>
      {reset ? <p className="form__success">{t.reset}</p> : null}
      <LoginForm next={safeNext(next)} />
      <p className="auth__links">
        <Link href="/mot-de-passe-oublie">{t.forgot}</Link>
        <Link href="/">{t.backToSite}</Link>
      </p>
    </>
  );
}
