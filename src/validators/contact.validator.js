import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(5000),
});

export const subscribeSchema = z.object({
  email: z.string().email(),
});
