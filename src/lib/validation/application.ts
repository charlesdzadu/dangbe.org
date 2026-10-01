import { z } from 'zod';

export const DEGREE_LEVELS = ['BAC_PLUS_2', 'LICENCE', 'MASTER', 'DOCTORAT', 'AUTRE'] as const;
export const DEVICE_ACCESS = ['OWN_COMPUTER', 'SHARED_COMPUTER', 'SMARTPHONE_ONLY', 'NONE'] as const;
export const INTERNET_ACCESS = ['RELIABLE', 'MOBILE_DATA', 'OCCASIONAL'] as const;
export const PATHWAYS = ['SHORT', 'MEDIUM', 'LONG'] as const;
export const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE'] as const;

const CURRENT_YEAR = new Date().getUTCFullYear();

const text = (min: number, max: number) =>
  z
    .string({ error: 'required' })
    .trim()
    .min(min, { error: 'tooShort' })
    .max(max, { error: 'tooLong' });

/* Messages are KEYS (apply.form.errors.*), translated by the form. */
export const applicationSchema = z.object({
  locale: z.enum(['fr', 'en']).default('fr'),
  firstName: text(2, 60),
  lastName: text(2, 60),
  email: z
    .string({ error: 'required' })
    .trim()
    .toLowerCase()
    .max(160, { error: 'tooLong' })
    .pipe(z.email({ error: 'email' })),
  phone: z
    .string({ error: 'required' })
    .trim()
    .regex(/^\+?[0-9 ().-]{8,20}$/, { error: 'phone' }),
  city: text(2, 80),
  degreeLevel: z.enum(DEGREE_LEVELS, { error: 'required' }),
  fieldOfStudy: text(2, 120),
  institution: text(2, 160),
  graduationYear: z.coerce
    .number({ error: 'year' })
    .int({ error: 'year' })
    .min(2005, { error: 'year' })
    .max(CURRENT_YEAR + 1, { error: 'year' }),
  motivation: z
    .string({ error: 'required' })
    .trim()
    .min(200, { error: 'motivation' })
    .max(2000, { error: 'motivation' }),
  deviceAccess: z.enum(DEVICE_ACCESS, { error: 'required' }),
  internetAccess: z.enum(INTERNET_ACCESS, { error: 'required' }),
  hoursPerWeek: z.coerce.number({ error: 'hours' }).int({ error: 'hours' }).min(2, { error: 'hours' }).max(40, { error: 'hours' }),
  pathwayPreference: z.enum(PATHWAYS).optional(),
  frenchLevel: z.enum(LANGUAGE_LEVELS, { error: 'required' }),
  englishLevel: z.enum(LANGUAGE_LEVELS, { error: 'required' }),
  howHeard: z.string().trim().max(200, { error: 'tooLong' }).optional(),
  feedbackWilling: z.literal(true, { error: 'mustAccept' }),
  consent: z.literal(true, { error: 'mustAccept' }),
  /* Honeypot: a human never sees it, a bot fills it. */
  website: z.string().max(0).optional(),
  /* Time-on-form, stamped when the form rendered. */
  startedAt: z.coerce.number().optional(),
});

export type ApplicationInput = z.output<typeof applicationSchema>;
