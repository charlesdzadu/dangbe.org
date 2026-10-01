'use client';

import { useActionState, useState } from 'react';
import { decideApplication } from '@/actions/application';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, Select, SubmitButton, fieldErrorFor } from './fields';

type Decision = 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';

export function DecisionForm({
  applicationId,
  cohorts,
  mentors,
}: {
  applicationId: string;
  cohorts: { id: string; name: string; pathwayType: string }[];
  mentors: { id: string; firstName: string; lastName: string; role: string }[];
}) {
  const t = app.applications.decision;
  const [decision, setDecision] = useState<Decision>('ACCEPTED');
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(decideApplication, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  const formError = state && !state.ok && state.formError ? (t.errors as Record<string, string>)[state.formError] ?? app.common.unknownError : undefined;

  if (state?.ok) return <p className="form__success">{t.done}</p>;

  return (
    <form action={formAction} className="form" noValidate>
      <input type="hidden" name="applicationId" value={applicationId} />
      <div className="field">
        <span className="field__label">{t.title}</span>
        {(['ACCEPTED', 'WAITLISTED', 'REJECTED'] as const).map((d) => (
          <label key={d} className="field__check">
            <input type="radio" name="decision" value={d} checked={decision === d} onChange={() => setDecision(d)} />
            <span>{d === 'ACCEPTED' ? t.accept : d === 'WAITLISTED' ? t.waitlist : t.reject}</span>
          </label>
        ))}
      </div>
      {decision === 'ACCEPTED' ? (
        <>
          <Select
            name="cohortId"
            label={t.cohort}
            error={err('cohortId')}
            options={cohorts.map((c) => [c.id, `${c.name} (${app.labels.pathway[c.pathwayType as 'SHORT' | 'MEDIUM' | 'LONG']})`])}
          />
          <Select
            name="mentorId"
            label={t.mentor}
            error={err('mentorId')}
            options={mentors.map((m) => [m.id, `${m.firstName} ${m.lastName}`])}
            placeholder={app.common.none}
          />
        </>
      ) : null}
      <Field name="notes" as="textarea" label={t.notes} rows={3} maxLength={2000} error={err('notes')} />
      {formError ? (
        <p className="form__error" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="form__actions">
        <SubmitButton label={decision === 'ACCEPTED' ? t.submitAccept : t.submitOther} className={decision === 'ACCEPTED' ? 'btn btn-brand' : 'btn btn-ink'} />
      </div>
    </form>
  );
}
