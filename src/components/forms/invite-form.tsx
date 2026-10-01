'use client';

import { useActionState } from 'react';
import { inviteTeamMember } from '@/actions/users';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, Select, SubmitButton, fieldErrorFor } from './fields';

export function InviteForm() {
  const t = app.users.form;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(inviteTeamMember, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, { ...app.errors, exists: t.exists });
  return (
    <form action={formAction} className="form" noValidate>
      <div className="form__row">
        <Field name="firstName" label={t.firstName} error={err('firstName')} autoComplete="off" />
        <Field name="lastName" label={t.lastName} error={err('lastName')} autoComplete="off" />
      </div>
      <Field name="email" type="email" label={t.email} error={err('email')} autoComplete="off" />
      <Select name="role" label={t.role} error={err('role')} options={[['MENTOR', app.labels.role.MENTOR], ['ADMIN', app.labels.role.ADMIN]]} placeholder={null} />
      <div className="form__actions">
        <SubmitButton label={t.submit} className="btn btn-ink" />
      </div>
    </form>
  );
}
