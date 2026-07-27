import { z } from 'zod';

export const adSchema = z.object({
  type: z.enum(['sponsored', 'banner']),
  ctaUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  targetVertical: z.string().nullable().optional()
});
