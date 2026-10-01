import type { Metadata } from 'next';
import Link from 'next/link';
import { SetPasswordForm } from '@/components/forms/password-forms';
import { app } from '@/i18n/app/fr';
import { peekAuthToken } from '@/lib/auth/tokens';

export const metadata: Metadata = { title: app.auth.reset.title, robots: { index: false, follow: false } };

export default async function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const t = app.auth.reset;
  const live = await peekAuthToken('PASSWORD_RESET', token);
  return (
    <>
      <h1 className="auth__title">{t.title}</h1>
      {live ? (
        <>
          <p className="auth__sub">{t.subtitle}</p>
          <SetPasswordForm mode="reset" token={token} />
        </>
      ) : (
        <>
          <p className="form__error">{t.invalidToken}</p>
          <p className="auth__links">
            <Link href="/mot-de-passe-oublie">{t.askNew}</Link>
          </p>
        </>
      )}
    </>
  );
}
