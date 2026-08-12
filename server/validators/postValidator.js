import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  vertical: z.string().min(1, 'Vertical (ObjectId) is required'),
  excerpt: z.string().optional(),
  bannerImage: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  body: z.object({
    blocks: z.array(z.any())
  }),
  status: z.enum(['draft', 'published']).optional(),
  editorsPick: z.boolean().optional(),
  adSlot1: z.string().nullable().optional(),
  adSlot2: z.string().nullable().optional(),
});
