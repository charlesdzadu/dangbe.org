'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, SubmitButton, fieldErrorFor } from './fields';

export function LoginForm({ next }: { next: string }) {
  const t = app.auth.login;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(login, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  const formError = state && !state.ok ? state.formError : undefined;
  const formMessage = formError === 'disabled' ? t.disabled : formError === 'invited' ? t.invited : formError ? t.invalid : undefined;

  return (
    <form action={formAction} className="form" noValidate>
      <input type="hidden" name="next" value={next} />
      <Field name="email" type="email" label={t.email} error={err('email')} autoComplete="email" inputMode="email" />
      <Field name="password" type="password" label={t.password} error={err('password')} autoComplete="current-password" />
      {formMessage ? (
        <p className="form__error" role="alert">
          {formMessage}
        </p>
      ) : null}
      <div className="form__actions">
        <SubmitButton label={t.submit} className="btn btn-ink btn-block" />
      </div>
    </form>
  );
}
