import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/, 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a special character'),
  role: z.enum(['admin', 'editor']).default('editor')
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['admin', 'editor']).optional()
});

export const adminChangePasswordSchema = z.object({
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/, 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a special character')
});
