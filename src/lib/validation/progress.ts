import { z } from 'zod';

export const PROGRESS_STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const;

const https = /^https:\/\/\S+$/i;

export const progressSchema = z
  .object({
    courseProgressId: z.uuid({ error: 'invalid' }),
    status: z.enum(PROGRESS_STATUSES, { error: 'required' }),
    proofUrl: z.string().trim().max(500, { error: 'tooLong' }).optional(),
  })
  .refine((d) => d.status !== 'COMPLETED' || (!!d.proofUrl && https.test(d.proofUrl)), { error: 'url', path: ['proofUrl'] });

export const validateProofSchema = z
  .object({
    courseProgressId: z.uuid({ error: 'invalid' }),
    decision: z.enum(['VALIDATED', 'REJECTED'], { error: 'required' }),
    note: z.string().trim().max(1000, { error: 'tooLong' }).optional(),
  })
  .refine((d) => d.decision !== 'REJECTED' || (!!d.note && d.note.length > 0), { error: 'required', path: ['note'] });

export const evaluationSchema = z.object({
  enrollmentId: z.uuid({ error: 'invalid' }),
  competencyId: z.uuid({ error: 'required' }),
  score: z.coerce.number({ error: 'required' }).int({ error: 'range' }).min(1, { error: 'range' }).max(5, { error: 'range' }),
  notes: z.string().trim().max(2000, { error: 'tooLong' }).optional(),
});

export const noteSchema = z.object({
  enrollmentId: z.uuid({ error: 'invalid' }),
  body: z.string({ error: 'required' }).trim().min(1, { error: 'required' }).max(2000, { error: 'tooLong' }),
  visibleToParticipant: z.boolean().default(false),
});
