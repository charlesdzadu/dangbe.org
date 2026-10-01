import { z } from 'zod';

/** What every server action returns to a form. Field errors are message KEYS the form translates. */
export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; formError?: string; fieldErrors?: Record<string, string[]> };

/**
 * FormData → plain object → zod. Empty strings become undefined (so optional
 * fields stay optional), checkboxes ('on') become true, and repeated keys
 * ending in `[]` become arrays.
 */
export function formToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [rawKey, value] of formData.entries()) {
    if (typeof value !== 'string') continue;
    const isList = rawKey.endsWith('[]');
    const key = isList ? rawKey.slice(0, -2) : rawKey;
    const v: unknown = value === '' ? undefined : value === 'on' ? true : value;
    if (isList) {
      const list = (out[key] as unknown[] | undefined) ?? [];
      if (v !== undefined) list.push(v);
      out[key] = list;
    } else {
      out[key] = v;
    }
  }
  return out;
}

export function parseForm<S extends z.ZodType>(
  schema: S,
  formData: FormData,
): { ok: true; data: z.output<S> } | { ok: false; fieldErrors: Record<string, string[]> } {
  const result = schema.safeParse(formToObject(formData));
  if (result.success) return { ok: true, data: result.data };
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.map(String).join('.') || '_';
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { ok: false, fieldErrors };
}
