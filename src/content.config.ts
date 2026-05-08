import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['active', 'archived', 'paused']).default('active'),
    started: z.string(), // YYYY or YYYY-MM
    updated: z.string().optional(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    stack: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { projects };
