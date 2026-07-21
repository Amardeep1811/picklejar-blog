import { z } from 'zod';

export const createPetitionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title is too long'),
  category: z.string().min(1, 'Category is required'),
  signatureCount: z.number().nonnegative().default(0),
  goalCount: z.number().positive('Goal count must be positive'),
  active: z.boolean().default(true),
});

export const updatePetitionSchema = createPetitionSchema.partial();
