import { z } from 'zod';

const email = z.string({ error: 'required' }).trim().toLowerCase().max(160, { error: 'tooLong' }).pipe(z.email({ error: 'email' }));

export const inviteSchema = z.object({
  email,
  firstName: z.string({ error: 'required' }).trim().min(2, { error: 'tooShort' }).max(60, { error: 'tooLong' }),
  lastName: z.string({ error: 'required' }).trim().min(2, { error: 'tooShort' }).max(60, { error: 'tooLong' }),
  role: z.enum(['ADMIN', 'MENTOR'], { error: 'required' }),
});

export const userStatusSchema = z.object({
  userId: z.uuid({ error: 'invalid' }),
  status: z.enum(['ACTIVE', 'DISABLED'], { error: 'required' }),
});

export const userIdSchema = z.object({ userId: z.uuid({ error: 'invalid' }) });
