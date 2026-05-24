import { z } from 'zod';

const PROJECT_CATEGORIES = ['Web App', 'Mobile App', 'UI/UX', 'API', 'Open Source', 'Other'];

const projectImage = z.object({
  url: z.string().min(1, 'Image URL is required'),
  publicId: z.string().optional().default(''),
  alt: z.string().optional().default(''),
});

const baseProjectShape = {
  title: z.string().trim().min(1, 'Title is required').max(160),
  shortDescription: z.string().trim().min(1, 'Short description is required').max(280),
  description: z.string().trim().min(1, 'Description is required'),
  category: z.enum(PROJECT_CATEGORIES).default('Web App'),
  technologies: z.array(z.string().trim()).optional().default([]),
  thumbnail: z.string().trim().min(1, 'Thumbnail is required'),
  thumbnailPublicId: z.string().optional().default(''),
  gallery: z.array(projectImage).optional().default([]),
  githubUrl: z.string().trim().optional().default(''),
  liveUrl: z.string().trim().optional().default(''),
  videoUrl: z.string().trim().optional().default(''),
  role: z.string().trim().optional().default(''),
  client: z.string().trim().optional().default(''),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  isFeatured: z.coerce.boolean().optional().default(false),
  isPublished: z.coerce.boolean().optional().default(true),
  order: z.coerce.number().int().optional().default(0),
};

export const createProjectSchema = z
  .object(baseProjectShape)
  .strip(); // drop unknown keys so _id / slug / __v leaking in never hurts

export const updateProjectSchema = z
  .object(
    Object.fromEntries(
      Object.entries(baseProjectShape).map(([k, v]) => [k, v.optional()])
    )
  )
  .strip();
