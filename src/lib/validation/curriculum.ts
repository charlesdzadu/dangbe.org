import { z } from 'zod';

const name = z.string({ error: 'required' }).trim().min(2, { error: 'tooShort' }).max(120, { error: 'tooLong' });

export const competencySchema = z.object({
  id: z.uuid().optional(),
  nameFr: name,
  nameEn: name,
  descriptionFr: z.string().trim().max(500, { error: 'tooLong' }).optional(),
  descriptionEn: z.string().trim().max(500, { error: 'tooLong' }).optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isActive: z.boolean().default(false),
});

export const courseSchema = z.object({
  id: z.uuid().optional(),
  title: z.string({ error: 'required' }).trim().min(2, { error: 'tooShort' }).max(200, { error: 'tooLong' }),
  provider: z.string({ error: 'required' }).trim().min(2, { error: 'tooShort' }).max(120, { error: 'tooLong' }),
  url: z.string({ error: 'required' }).trim().regex(/^https:\/\/\S+$/i, { error: 'url' }).max(500, { error: 'tooLong' }),
  language: z.enum(['fr', 'en'], { error: 'required' }),
  estimatedHours: z.coerce.number({ error: 'required' }).int({ error: 'range' }).min(1, { error: 'range' }).max(500, { error: 'range' }),
  isFree: z.boolean().default(false),
  hasCertificate: z.boolean().default(false),
  certificateIsFree: z.boolean().default(false),
  description: z.string().trim().max(1000, { error: 'tooLong' }).optional(),
  isActive: z.boolean().default(false),
  competencyIds: z.array(z.uuid()).default([]),
});

export const templateSchema = z.object({
  id: z.uuid().optional(),
  name: name,
  type: z.enum(['SHORT', 'MEDIUM', 'LONG'], { error: 'required' }),
  targetWeeks: z.coerce.number({ error: 'required' }).int({ error: 'range' }).min(1, { error: 'range' }).max(104, { error: 'range' }),
  descriptionFr: z.string().trim().max(1000, { error: 'tooLong' }).optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(false),
});

export const templateItemSchema = z.object({
  templateId: z.uuid({ error: 'invalid' }),
  competencyId: z.uuid({ error: 'required' }),
  courseId: z.uuid({ error: 'required' }),
  isRequired: z.boolean().default(false),
});

export const templateItemRefSchema = z.object({
  itemId: z.uuid({ error: 'invalid' }),
  direction: z.enum(['up', 'down']).optional(),
});
