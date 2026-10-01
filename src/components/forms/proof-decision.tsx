'use client';

import { useActionState } from 'react';
import { validateProof } from '@/actions/progress';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, fieldErrorFor } from './fields';

/** Two buttons and a note: validate, or reject with a word for the participant. */
export function ProofDecision({ id }: { id: string }) {
  const t = app.participant;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(validateProof, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  if (state?.ok) return <p className="form__success">{t.decided}</p>;
  return (
    <form action={formAction} className="form" noValidate>
      <input type="hidden" name="courseProgressId" value={id} />
      <Field name="note" label={t.rejectNote} error={err('note')} maxLength={1000} />
      <div className="form__actions">
        <button type="submit" name="decision" value="VALIDATED" className="btn btn-ink btn-sm">
          {t.validate}
        </button>
        <button type="submit" name="decision" value="REJECTED" className="btn btn-outline btn-sm">
          {t.reject}
        </button>
      </div>
    </form>
  );
}
