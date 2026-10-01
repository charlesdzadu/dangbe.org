'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { submitApplication } from '@/actions/application';
import { getDict, ROUTES, type Locale } from '@/i18n';
import type { ActionResult } from '@/lib/action-result';
import {
  DEGREE_LEVELS,
  DEVICE_ACCESS,
  INTERNET_ACCESS,
  LANGUAGE_LEVELS,
  PATHWAYS,
} from '@/lib/validation/application';
import { Check, Field, Select, SubmitButton, fieldErrorFor } from './fields';

type Errors = Record<string, string[]> | undefined;

/**
 * The public form. Progressive enhancement: it is a plain <form action>
 * bound to the server action, so it submits without JavaScript; with it,
 * useActionState keeps the values and shows the field errors in place.
 */
export function ApplicationForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).apply.form;
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(submitApplication, undefined);
  const [startedAt] = useState(() => Date.now());
  const errors: Errors = state && !state.ok ? state.fieldErrors : undefined;
  const err = fieldErrorFor(errors, t.errors);

  return (
    <form action={formAction} className="form" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="form__hp" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="form__section">
        <legend>{t.sections.identity}</legend>
        <div className="form__row">
          <Field name="firstName" label={t.fields.firstName} error={err('firstName')} autoComplete="given-name" />
          <Field name="lastName" label={t.fields.lastName} error={err('lastName')} autoComplete="family-name" />
        </div>
        <div className="form__row">
          <Field name="email" type="email" label={t.fields.email} help={t.fields.emailHelp} error={err('email')} autoComplete="email" />
          <Field name="phone" type="tel" label={t.fields.phone} error={err('phone')} autoComplete="tel" placeholder="+228 90 00 00 00" />
        </div>
        <Field name="city" label={t.fields.city} error={err('city')} autoComplete="address-level2" />
      </fieldset>

      <fieldset className="form__section">
        <legend>{t.sections.background}</legend>
        <div className="form__row">
          <Select name="degreeLevel" label={t.fields.degreeLevel} error={err('degreeLevel')} options={DEGREE_LEVELS.map((v) => [v, t.options.degreeLevel[v]])} />
          <Field name="graduationYear" type="number" label={t.fields.graduationYear} error={err('graduationYear')} inputMode="numeric" min={2005} max={new Date().getFullYear() + 1} />
        </div>
        <div className="form__row">
          <Field name="fieldOfStudy" label={t.fields.fieldOfStudy} error={err('fieldOfStudy')} />
          <Field name="institution" label={t.fields.institution} error={err('institution')} />
        </div>
      </fieldset>

      <fieldset className="form__section">
        <legend>{t.sections.fit}</legend>
        <div className="form__row">
          <Select name="deviceAccess" label={t.fields.deviceAccess} error={err('deviceAccess')} options={DEVICE_ACCESS.map((v) => [v, t.options.deviceAccess[v]])} />
          <Select name="internetAccess" label={t.fields.internetAccess} error={err('internetAccess')} options={INTERNET_ACCESS.map((v) => [v, t.options.internetAccess[v]])} />
        </div>
        <div className="form__row">
          <Field name="hoursPerWeek" type="number" label={t.fields.hoursPerWeek} error={err('hoursPerWeek')} inputMode="numeric" min={2} max={40} />
          <Select
            name="pathwayPreference"
            label={t.fields.pathwayPreference}
            help={t.fields.pathwayHelp}
            error={err('pathwayPreference')}
            options={[['', t.options.pathway.none], ...PATHWAYS.map((v) => [v, t.options.pathway[v]] as [string, string])]}
          />
        </div>
        <div className="form__row">
          <Select name="frenchLevel" label={t.fields.frenchLevel} error={err('frenchLevel')} options={LANGUAGE_LEVELS.map((v) => [v, t.options.languageLevel[v]])} />
          <Select name="englishLevel" label={t.fields.englishLevel} error={err('englishLevel')} options={LANGUAGE_LEVELS.map((v) => [v, t.options.languageLevel[v]])} />
        </div>
      </fieldset>

      <fieldset className="form__section">
        <legend>{t.sections.motivation}</legend>
        <Field name="motivation" as="textarea" label={t.fields.motivation} help={t.fields.motivationHelp} error={err('motivation')} rows={8} maxLength={2000} />
        <Field name="howHeard" label={t.fields.howHeard} help={t.fields.howHeardHelp} error={err('howHeard')} />
        <Check name="feedbackWilling" label={t.fields.feedbackWilling} error={err('feedbackWilling')} />
        <Check
          name="consent"
          label={
            <>
              {t.fields.consent}{' '}
              <Link href={ROUTES.privacy[locale]} target="_blank">
                {t.fields.consentLink}
              </Link>
            </>
          }
          error={err('consent')}
        />
      </fieldset>

      {state && !state.ok ? (
        <p className="form__error" role="alert">
          {t.formError}
        </p>
      ) : null}

      <div className="form__actions">
        <SubmitButton label={t.submit} pending={t.sending} className="btn btn-ink btn-lg" />
      </div>
    </form>
  );
}
