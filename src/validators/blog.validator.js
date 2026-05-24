import { z } from 'zod';

const author = z.object({
  name: z.string().trim().optional().default(''),
  avatar: z.string().trim().optional().default(''),
});

const seo = z
  .object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })
  .optional();

const baseBlogShape = {
  title: z.string().trim().min(1, 'Title is required').max(200),
  excerpt: z.string().trim().min(1, 'Excerpt is required').max(320),
  content: z.string().trim().min(1, 'Content is required'),
  thumbnail: z.string().trim().optional().default(''),
  thumbnailPublicId: z.string().optional().default(''),
  // Coerce empty / missing category to the schema default — the form
  // input is a free-text field which can legitimately come through blank.
  category: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length ? v : 'General')),
  tags: z.array(z.string().trim().toLowerCase()).optional().default([]),
  author: author.optional(),
  readTime: z.coerce.number().int().min(1).optional().default(5),
  isPublished: z.coerce.boolean().optional().default(true),
  isFeatured: z.coerce.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional(),
  seo,
};

export const createBlogSchema = z.object(baseBlogShape).strip();

export const updateBlogSchema = z
  .object(
    Object.fromEntries(
      Object.entries(baseBlogShape).map(([k, v]) => [k, v.optional()])
    )
  )
  .strip();
