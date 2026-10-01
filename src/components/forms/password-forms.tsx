'use client';

import { useActionState } from 'react';
import { acceptInvitation, requestPasswordReset, resetPassword } from '@/actions/auth';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, SubmitButton, fieldErrorFor } from './fields';

export function ForgotForm() {
  const t = app.auth.forgot;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(requestPasswordReset, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  if (state?.ok) return <p className="form__success">{t.sent}</p>;
  return (
    <form action={formAction} className="form" noValidate>
      <Field name="email" type="email" label={app.auth.login.email} error={err('email')} autoComplete="email" inputMode="email" />
      <div className="form__actions">
        <SubmitButton label={t.submit} className="btn btn-ink btn-block" />
      </div>
    </form>
  );
}

export function SetPasswordForm({ mode, token }: { mode: 'reset' | 'invitation'; token: string }) {
  const t = app.auth.reset;
  const action = mode === 'reset' ? resetPassword : acceptInvitation;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  const formError = state && !state.ok && state.formError === 'invalidToken' ? (mode === 'reset' ? t.invalidToken : app.auth.invitation.invalidToken) : undefined;
  return (
    <form action={formAction} className="form" noValidate>
      <input type="hidden" name="token" value={token} />
      <Field name="password" type="password" label={t.password} error={err('password')} autoComplete="new-password" />
      <Field name="confirm" type="password" label={t.confirm} error={err('confirm')} autoComplete="new-password" />
      {formError ? (
        <p className="form__error" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="form__actions">
        <SubmitButton label={mode === 'reset' ? t.submit : app.auth.invitation.submit} className="btn btn-ink btn-block" />
      </div>
    </form>
  );
}
