'use client';

import { useActionState } from 'react';
import { reviewApplication } from '@/actions/application';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, SubmitButton, fieldErrorFor } from './fields';

type Initial = { motivationScore: number; accessScore: number; feedbackScore: number; comment: string };

function Score({ name, label, error, defaultValue }: { name: string; label: string; error?: string; defaultValue?: number }) {
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <span className="field__label">{label}</span>
      <div className="score" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>
            <input type="radio" id={`${name}-${n}`} name={name} value={n} defaultChecked={defaultValue === n} />
            <label htmlFor={`${name}-${n}`}>{n}</label>
          </span>
        ))}
      </div>
      {error ? <p className="field__error">{error}</p> : null}
    </div>
  );
}

export function ReviewForm({ applicationId, initial }: { applicationId: string; initial?: Initial }) {
  const t = app.applications.review;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(reviewApplication, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, { ...app.errors, range: app.errors.required });
  return (
    <form action={formAction} className="form" noValidate>
      <input type="hidden" name="applicationId" value={applicationId} />
      <p className="panel__title">{t.title}</p>
      <p className="muted">{t.scale}</p>
      <Score name="motivationScore" label={t.motivation} error={err('motivationScore')} defaultValue={initial?.motivationScore} />
      <Score name="accessScore" label={t.access} error={err('accessScore')} defaultValue={initial?.accessScore} />
      <Score name="feedbackScore" label={t.feedback} error={err('feedbackScore')} defaultValue={initial?.feedbackScore} />
      <Field name="comment" as="textarea" label={t.comment} rows={3} maxLength={1000} defaultValue={initial?.comment} error={err('comment')} />
      {state?.ok ? <p className="form__success">{t.saved}</p> : null}
      <div className="form__actions">
        <SubmitButton label={t.submit} className="btn btn-ink" arrow={false} />
      </div>
    </form>
  );
}
