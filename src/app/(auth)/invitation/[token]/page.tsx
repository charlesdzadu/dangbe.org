import type { Metadata } from 'next';
import Link from 'next/link';
import { SetPasswordForm } from '@/components/forms/password-forms';
import { app } from '@/i18n/app/fr';
import { peekAuthToken } from '@/lib/auth/tokens';

export const metadata: Metadata = { title: app.auth.invitation.title, robots: { index: false, follow: false } };

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const t = app.auth.invitation;
  const live = await peekAuthToken('INVITE', token);
  return (
    <>
      <h1 className="auth__title">
        {t.title}
        {live ? `, ${live.user.firstName}` : ''}
      </h1>
      {live ? (
        <>
          <p className="auth__sub">{t.subtitle}</p>
          <SetPasswordForm mode="invitation" token={token} />
        </>
      ) : (
        <>
          <p className="form__error">{t.invalidToken}</p>
          <p className="auth__links">
            <Link href="/connexion">{app.auth.forgot.back}</Link>
          </p>
        </>
      )}
    </>
  );
}
