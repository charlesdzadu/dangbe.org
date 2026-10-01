'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { upsertCourseProgress } from '@/actions/progress';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Field, SubmitButton, fieldErrorFor } from './fields';

type Status = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
const STATUSES: Status[] = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];

/**
 * One course, one line: the status, and the proof link once it is COMPLETED.
 *
 * The select is uncontrolled on purpose. React 19 resets a <form action>
 * after the action runs, which drops a controlled <select> back to its first
 * option while React still holds the chosen value; keeping the chosen option
 * as the DOM default (`defaultSelected`) makes that reset land on it, and
 * the server's fresh `status` prop re-syncs it after the refresh.
 */
export function ProgressForm({ id, status, proofUrl }: { id: string; status: Status; proofUrl: string | null }) {
  const t = app.myPath;
  const [current, setCurrent] = useState<Status>(status);
  const selectRef = useRef<HTMLSelectElement>(null);
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(upsertCourseProgress, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  const formError = state && !state.ok && state.formError ? (app.participant.errors as Record<string, string>)[state.formError] ?? app.common.unknownError : undefined;

  const markDefault = (value: Status) => {
    const el = selectRef.current;
    if (!el) return;
    el.value = value;
    for (const option of Array.from(el.options)) option.defaultSelected = option.value === value;
  };

  useEffect(() => {
    setCurrent(status);
    markDefault(status);
  }, [status]);

  return (
    <form action={formAction} className="form" noValidate>
      <input type="hidden" name="courseProgressId" value={id} />
      <div className="form__inline">
        <div className="field">
          <label htmlFor={`st-${id}`} className="field__label">
            {t.status}
          </label>
          <select
            id={`st-${id}`}
            name="status"
            ref={selectRef}
            className="field__input field__select"
            defaultValue={status}
            onChange={(e) => {
              const value = e.target.value as Status;
              setCurrent(value);
              markDefault(value);
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {app.labels.progressStatus[s]}
              </option>
            ))}
          </select>
        </div>
        {current === 'COMPLETED' ? (
          <Field name="proofUrl" type="url" label={t.proofUrl} help={t.proofHelp} error={err('proofUrl')} defaultValue={proofUrl ?? ''} inputMode="url" placeholder="https://" />
        ) : null}
        <div className="form__actions">
          <SubmitButton label={t.save} className="btn btn-ink btn-sm" arrow={false} />
        </div>
      </div>
      {state?.ok ? <p className="form__success">{t.saved}</p> : null}
      {formError ? (
        <p className="form__error" role="alert">
          {formError}
        </p>
      ) : null}
    </form>
  );
}
