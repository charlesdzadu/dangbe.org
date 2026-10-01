import { z } from 'zod';

const score = z.coerce.number({ error: 'required' }).int({ error: 'range' }).min(1, { error: 'range' }).max(5, { error: 'range' });

export const reviewSchema = z.object({
  applicationId: z.uuid({ error: 'invalid' }),
  motivationScore: score,
  accessScore: score,
  feedbackScore: score,
  comment: z.string().trim().max(1000, { error: 'tooLong' }).optional(),
});

export const decisionSchema = z.discriminatedUnion('decision', [
  z.object({
    decision: z.literal('ACCEPTED'),
    applicationId: z.uuid({ error: 'invalid' }),
    cohortId: z.uuid({ error: 'required' }),
    mentorId: z.uuid({ error: 'invalid' }).optional(),
    notes: z.string().trim().max(2000, { error: 'tooLong' }).optional(),
  }),
  z.object({
    decision: z.enum(['REJECTED', 'WAITLISTED']),
    applicationId: z.uuid({ error: 'invalid' }),
    notes: z.string().trim().max(2000, { error: 'tooLong' }).optional(),
  }),
]);
