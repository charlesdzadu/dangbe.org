'use client';

import { useActionState } from 'react';
import { saveCompetency, saveCourse, saveTemplate } from '@/actions/curriculum';
import { app } from '@/i18n/app/fr';
import type { ActionResult } from '@/lib/action-result';
import { Check, Field, Select, SubmitButton, fieldErrorFor } from './fields';

const errs = { ...app.errors, range: app.errors.range };

export function CompetencyForm({
  initial,
}: {
  initial?: { id: string; nameFr: string; nameEn: string; descriptionFr: string; descriptionEn: string; sortOrder: number; isActive: boolean };
}) {
  const t = app.curriculum.competency;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(saveCompetency, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, errs);
  return (
    <form action={formAction} className="form" noValidate>
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <div className="form__row">
        <Field name="nameFr" label={t.nameFr} error={err('nameFr')} defaultValue={initial?.nameFr} />
        <Field name="nameEn" label={t.nameEn} error={err('nameEn')} defaultValue={initial?.nameEn} />
      </div>
      <Field name="descriptionFr" as="textarea" rows={2} label={t.descriptionFr} error={err('descriptionFr')} defaultValue={initial?.descriptionFr} />
      <Field name="descriptionEn" as="textarea" rows={2} label={t.descriptionEn} error={err('descriptionEn')} defaultValue={initial?.descriptionEn} />
      <div className="form__row">
        <Field name="sortOrder" type="number" label={t.sortOrder} error={err('sortOrder')} defaultValue={initial?.sortOrder ?? 0} min={0} max={999} />
        <Check name="isActive" label={t.isActive} defaultChecked={initial?.isActive ?? true} />
      </div>
      <div className="form__actions">
        <SubmitButton label={app.common.save} className="btn btn-ink" arrow={false} />
      </div>
    </form>
  );
}

export function CourseForm({
  competencies,
  initial,
}: {
  competencies: { id: string; nameFr: string }[];
  initial?: {
    id: string;
    title: string;
    provider: string;
    url: string;
    language: 'fr' | 'en';
    estimatedHours: number;
    isFree: boolean;
    hasCertificate: boolean;
    certificateIsFree: boolean;
    description: string;
    isActive: boolean;
    competencyIds: string[];
  };
}) {
  const t = app.curriculum.course;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(saveCourse, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, errs);
  return (
    <form action={formAction} className="form" noValidate>
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <Field name="title" label={t.title} error={err('title')} defaultValue={initial?.title} />
      <div className="form__row">
        <Field name="provider" label={t.provider} error={err('provider')} defaultValue={initial?.provider} />
        <Field name="url" type="url" label={t.url} error={err('url')} defaultValue={initial?.url} inputMode="url" />
      </div>
      <div className="form__row">
        <Select name="language" label={t.language} error={err('language')} defaultValue={initial?.language ?? 'fr'} placeholder={null} options={[['fr', app.labels.locale.fr], ['en', app.labels.locale.en]]} />
        <Field name="estimatedHours" type="number" label={t.estimatedHours} error={err('estimatedHours')} defaultValue={initial?.estimatedHours ?? 10} min={1} max={500} />
      </div>
      <div className="form__row">
        <Check name="isFree" label={t.isFree} defaultChecked={initial?.isFree ?? true} />
        <Check name="hasCertificate" label={t.hasCertificate} defaultChecked={initial?.hasCertificate ?? false} />
        <Check name="certificateIsFree" label={t.certificateIsFree} defaultChecked={initial?.certificateIsFree ?? false} />
        <Check name="isActive" label={t.isActive} defaultChecked={initial?.isActive ?? true} />
      </div>
      <div className="field">
        <span className="field__label">{t.competencies}</span>
        {competencies.map((c) => (
          <label key={c.id} className="field__check">
            <input type="checkbox" name="competencyIds[]" value={c.id} defaultChecked={initial?.competencyIds.includes(c.id)} />
            <span>{c.nameFr}</span>
          </label>
        ))}
      </div>
      <Field name="description" as="textarea" rows={3} label={t.description} error={err('description')} defaultValue={initial?.description} />
      <div className="form__actions">
        <SubmitButton label={app.common.save} className="btn btn-ink" arrow={false} />
      </div>
    </form>
  );
}

export function TemplateForm({
  initial,
}: {
  initial?: { id: string; name: string; type: 'SHORT' | 'MEDIUM' | 'LONG'; targetWeeks: number; descriptionFr: string; isDefault: boolean; isActive: boolean };
}) {
  const t = app.curriculum.template;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(saveTemplate, undefined);
  const err = fieldErrorFor(state && !state.ok ? state.fieldErrors : undefined, errs);
  return (
    <form action={formAction} className="form" noValidate>
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <Field name="name" label={t.name} error={err('name')} defaultValue={initial?.name} />
      <div className="form__row">
        <Select name="type" label={t.type} error={err('type')} defaultValue={initial?.type ?? 'SHORT'} placeholder={null} options={(['SHORT', 'MEDIUM', 'LONG'] as const).map((v) => [v, app.labels.pathway[v]])} />
        <Field name="targetWeeks" type="number" label={t.targetWeeks} error={err('targetWeeks')} defaultValue={initial?.targetWeeks ?? 12} min={1} max={104} />
      </div>
      <Field name="descriptionFr" as="textarea" rows={2} label={t.descriptionFr} error={err('descriptionFr')} defaultValue={initial?.descriptionFr} />
      <div className="form__row">
        <Check name="isDefault" label={t.isDefault} defaultChecked={initial?.isDefault ?? false} />
        <Check name="isActive" label={t.isActive} defaultChecked={initial?.isActive ?? true} />
      </div>
      <div className="form__actions">
        <SubmitButton label={app.common.save} className="btn btn-ink" arrow={false} />
      </div>
    </form>
  );
}
