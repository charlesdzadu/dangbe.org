import { z } from 'zod';

export const COHORT_STATUSES = ['PLANNED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'] as const;
export const ENROLLMENT_STATUSES = ['ACTIVE', 'PAUSED', 'COMPLETED', 'DROPPED'] as const;

export const cohortSchema = z
  .object({
    id: z.uuid().optional(),
    name: z.string({ error: 'required' }).trim().min(3, { error: 'tooShort' }).max(80, { error: 'tooLong' }),
    pathwayType: z.enum(['SHORT', 'MEDIUM', 'LONG'], { error: 'required' }),
    pathwayTemplateId: z.uuid({ error: 'required' }),
    startDate: z.iso.date({ error: 'invalid' }),
    endDate: z.iso.date({ error: 'invalid' }),
    status: z.enum(COHORT_STATUSES).default('PLANNED'),
    description: z.string().trim().max(1000, { error: 'tooLong' }).optional(),
  })
  .refine((d) => d.endDate >= d.startDate, { error: 'range', path: ['endDate'] });

export const assignMentorSchema = z.object({
  enrollmentId: z.uuid({ error: 'invalid' }),
  mentorId: z.uuid({ error: 'invalid' }).optional(),
});

export const enrollmentStatusSchema = z.object({
  enrollmentId: z.uuid({ error: 'invalid' }),
  status: z.enum(ENROLLMENT_STATUSES, { error: 'required' }),
});
