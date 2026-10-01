'use client';

import { useActionState } from 'react';
import { saveCohort } from '@/actions/cohort';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { COHORT_STATUSES } from '@/lib/validation/cohort';
import { Field, Select, SubmitButton, fieldErrorFor } from './fields';

type Initial = {
  id: string;
  name: string;
  pathwayType: 'SHORT' | 'MEDIUM' | 'LONG';
  pathwayTemplateId: string;
  startDate: string;
  endDate: string;
  status: (typeof COHORT_STATUSES)[number];
  description: string;
};

export function CohortForm({ templates, initial }: { templates: { id: string; name: string; type: string }[]; initial?: Initial }) {
  const t = app.cohorts.form;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(saveCohort, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, { ...app.errors, typeMismatch: t.typeMismatch, range: app.errors.range });
  return (
    <form action={formAction} className="form" noValidate>
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <Field name="name" label={t.name} error={err('name')} defaultValue={initial?.name} />
      <div className="form__row">
        <Select
          name="pathwayType"
          label={t.type}
          error={err('pathwayType')}
          defaultValue={initial?.pathwayType}
          options={(['SHORT', 'MEDIUM', 'LONG'] as const).map((v) => [v, app.labels.pathway[v]])}
        />
        <Select
          name="pathwayTemplateId"
          label={t.templateId}
          help={t.templateHelp}
          error={err('pathwayTemplateId')}
          defaultValue={initial?.pathwayTemplateId}
          options={templates.map((tpl) => [tpl.id, `${tpl.name} (${app.labels.pathway[tpl.type as 'SHORT' | 'MEDIUM' | 'LONG']})`])}
        />
      </div>
      <div className="form__row">
        <Field name="startDate" type="date" label={t.start} error={err('startDate')} defaultValue={initial?.startDate} />
        <Field name="endDate" type="date" label={t.end} error={err('endDate')} defaultValue={initial?.endDate} />
      </div>
      <Select
        name="status"
        label={t.status}
        error={err('status')}
        defaultValue={initial?.status ?? 'PLANNED'}
        placeholder={null}
        options={COHORT_STATUSES.map((s) => [s, app.labels.cohortStatus[s]])}
      />
      <Field name="description" as="textarea" label={t.description} rows={3} maxLength={1000} error={err('description')} defaultValue={initial?.description} />
      <div className="form__actions">
        <SubmitButton label={app.common.save} className="btn btn-ink" arrow={false} />
      </div>
    </form>
  );
}
