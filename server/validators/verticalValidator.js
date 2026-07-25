import { z } from 'zod';

export const verticalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  featuredOrder: z.number().optional()
});
