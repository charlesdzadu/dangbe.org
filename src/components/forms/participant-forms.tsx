'use client';

import { useActionState } from 'react';
import { addMentorNote, createEvaluation } from '@/actions/evaluation';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Check, Field, Select, SubmitButton, fieldErrorFor } from './fields';

export function NoteForm({ enrollmentId }: { enrollmentId: string }) {
  const t = app.participant;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(addMentorNote, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, app.errors);
  return (
    <form action={formAction} className="form" noValidate key={state?.ok ? 'done' : 'edit'}>
      <input type="hidden" name="enrollmentId" value={enrollmentId} />
      <Field name="body" as="textarea" label={t.noteBody} rows={3} maxLength={2000} error={err('body')} />
      <Check name="visibleToParticipant" label={t.noteVisible} />
      {state?.ok ? <p className="form__success">{t.noteSaved}</p> : null}
      <div className="form__actions">
        <SubmitButton label={t.addNote} className="btn btn-ink btn-sm" arrow={false} />
      </div>
    </form>
  );
}

export function EvaluationForm({ enrollmentId, competencies }: { enrollmentId: string; competencies: { id: string; nameFr: string }[] }) {
  const t = app.participant;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(createEvaluation, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, { ...app.errors, range: app.errors.required });
  return (
    <form action={formAction} className="form" noValidate key={state?.ok ? 'done' : 'edit'}>
      <input type="hidden" name="enrollmentId" value={enrollmentId} />
      <Select name="competencyId" label={t.competency} error={err('competencyId')} options={competencies.map((c) => [c.id, c.nameFr])} />
      <div className="field" data-invalid={err('score') ? 'true' : undefined}>
        <span className="field__label">{t.score}</span>
        <div className="score" role="radiogroup" aria-label={t.score}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n}>
              <input type="radio" id={`score-${n}`} name="score" value={n} />
              <label htmlFor={`score-${n}`}>{n}</label>
            </span>
          ))}
        </div>
        {err('score') ? <p className="field__error">{err('score')}</p> : null}
      </div>
      <Field name="notes" as="textarea" label={t.evalNotes} rows={3} maxLength={2000} error={err('notes')} />
      {state?.ok ? <p className="form__success">{t.evalSaved}</p> : null}
      <div className="form__actions">
        <SubmitButton label={t.addEvaluation} className="btn btn-ink btn-sm" arrow={false} />
      </div>
    </form>
  );
}
