import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({
    version: z.string(),
    // YYYY-MM-DD, or YYYY-MM when the exact day is unknown
    date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'date must be YYYY-MM-DD or YYYY-MM'),
    type: z.enum(['binary', 'ota']),
    updateGroup: z.string().optional(),
    commit: z.string().optional(),
    title: z.string(),
  }),
});

export const collections = { changelog };
