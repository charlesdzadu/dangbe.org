'use client';

import { useActionState } from 'react';
import { changePassword, updateProfile } from '@/actions/auth';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, Select, SubmitButton, fieldErrorFor } from './fields';

export function ProfileForm({ initial }: { initial: { firstName: string; lastName: string; phone: string; locale: 'fr' | 'en' } }) {
  const t = app.settings;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(updateProfile, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  return (
    <form action={formAction} className="form" noValidate>
      <div className="form__row">
        <Field name="firstName" label={t.firstName} error={err('firstName')} defaultValue={initial.firstName} autoComplete="given-name" />
        <Field name="lastName" label={t.lastName} error={err('lastName')} defaultValue={initial.lastName} autoComplete="family-name" />
      </div>
      <Field name="phone" type="tel" label={t.phone} error={err('phone')} defaultValue={initial.phone} autoComplete="tel" />
      <Select name="locale" label={t.locale} defaultValue={initial.locale} placeholder={null} options={[['fr', app.labels.locale.fr], ['en', app.labels.locale.en]]} />
      {state?.ok ? <p className="form__success">{app.common.saved}</p> : null}
      <div className="form__actions">
        <SubmitButton label={app.common.save} className="btn btn-ink" arrow={false} />
      </div>
    </form>
  );
}

export function PasswordForm() {
  const t = app.settings;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(changePassword, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  return (
    <form action={formAction} className="form" noValidate>
      <Field name="currentPassword" type="password" label={t.current} error={err('currentPassword')} autoComplete="current-password" />
      <Field name="password" type="password" label={t.new} error={err('password')} autoComplete="new-password" />
      <Field name="confirm" type="password" label={t.confirm} error={err('confirm')} autoComplete="new-password" />
      {state?.ok ? <p className="form__success">{t.passwordSaved}</p> : null}
      <div className="form__actions">
        <SubmitButton label={app.common.save} className="btn btn-ink" arrow={false} />
      </div>
    </form>
  );
}
