import { z } from 'zod';

const email = z.string({ error: 'required' }).trim().toLowerCase().max(160, { error: 'tooLong' }).pipe(z.email({ error: 'email' }));
const password = z.string({ error: 'required' }).min(10, { error: 'tooShort' }).max(200, { error: 'tooLong' });

export const loginSchema = z.object({
  email,
  password: z.string({ error: 'required' }).min(1, { error: 'required' }),
  next: z.string().optional(),
});

export const forgotSchema = z.object({ email });

export const setPasswordSchema = z
  .object({
    token: z.string({ error: 'required' }).min(10, { error: 'invalid' }),
    password,
    confirm: z.string({ error: 'required' }),
  })
  .refine((d) => d.password === d.confirm, { error: 'mismatch', path: ['confirm'] });

export const profileSchema = z.object({
  firstName: z.string({ error: 'required' }).trim().min(2, { error: 'tooShort' }).max(60, { error: 'tooLong' }),
  lastName: z.string({ error: 'required' }).trim().min(2, { error: 'tooShort' }).max(60, { error: 'tooLong' }),
  phone: z.string().trim().max(20, { error: 'tooLong' }).optional(),
  locale: z.enum(['fr', 'en']).default('fr'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string({ error: 'required' }).min(1, { error: 'required' }),
    password,
    confirm: z.string({ error: 'required' }),
  })
  .refine((d) => d.password === d.confirm, { error: 'mismatch', path: ['confirm'] });
