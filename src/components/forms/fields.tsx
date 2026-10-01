'use client';

import { useFormStatus } from 'react-dom';
import { ArrowRight } from '@/components/icons';

type FieldProps = {
  name: string;
  label: string;
  help?: string;
  error?: string;
  as?: 'input' | 'textarea';
  type?: string;
  rows?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: 'numeric' | 'text' | 'email' | 'tel' | 'url';
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  readOnly?: boolean;
};

export function Field({ name, label, help, error, as = 'input', type = 'text', ...rest }: FieldProps) {
  const id = `f-${name}`;
  const describedBy = [help ? `${id}-help` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
  const common = {
    id,
    name,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    className: 'field__input',
    ...rest,
  };
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      {as === 'textarea' ? <textarea {...common} /> : <input type={type} {...common} />}
      {help ? (
        <p id={`${id}-help`} className="field__help">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-err`} className="field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Select({
  name,
  label,
  help,
  error,
  options,
  defaultValue,
  placeholder = '—',
}: {
  name: string;
  label: string;
  help?: string;
  error?: string;
  options: readonly (readonly [string, string])[];
  defaultValue?: string;
  placeholder?: string | null;
}) {
  const id = `f-${name}`;
  return (
    <div className="field" data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <select id={id} name={name} className="field__input field__select" defaultValue={defaultValue ?? ''} aria-invalid={error ? true : undefined}>
        {placeholder !== null && options[0]?.[0] !== '' ? <option value="">{placeholder}</option> : null}
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {help ? <p className="field__help">{help}</p> : null}
      {error ? <p className="field__error">{error}</p> : null}
    </div>
  );
}

export function Check({
  name,
  label,
  error,
  defaultChecked,
}: {
  name: string;
  label: React.ReactNode;
  error?: string;
  defaultChecked?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div className="field field--check" data-invalid={error ? 'true' : undefined}>
      <label htmlFor={id} className="field__check">
        <input id={id} type="checkbox" name={name} defaultChecked={defaultChecked} aria-invalid={error ? true : undefined} />
        <span>{label}</span>
      </label>
      {error ? <p className="field__error">{error}</p> : null}
    </div>
  );
}

/** The one primary button of a form; disabled while the action runs. */
export function SubmitButton({
  label,
  pending,
  className = 'btn btn-ink',
  arrow = true,
}: {
  label: string;
  pending?: string;
  className?: string;
  arrow?: boolean;
}) {
  const status = useFormStatus();
  return (
    <button type="submit" className={className} disabled={status.pending} aria-disabled={status.pending}>
      {status.pending && pending ? pending : label}
      {arrow ? <ArrowRight size={18} className="arrow" /> : null}
    </button>
  );
}

/** Translates a field's first error key through a dictionary of messages. */
export function fieldErrorFor(
  errors: Record<string, string[]> | undefined,
  messages: Record<string, string>,
): (name: string) => string | undefined {
  return (name) => {
    const key = errors?.[name]?.[0];
    if (!key) return undefined;
    return messages[key] ?? messages.invalid ?? key;
  };
}
