import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.string().default('地标建筑'),
    description: z.string().default(''),
    source: z.string().optional().default(''),
  }),
});

export const collections = { blog };
