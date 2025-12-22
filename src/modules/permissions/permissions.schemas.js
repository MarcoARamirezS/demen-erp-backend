import { z } from 'zod';

const codeRegex = /^[a-z0-9]+:[a-z0-9]+$/; // resource:action, min estándar

export const permissionCreateSchema = z.object({
  code: z.string().regex(codeRegex),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional().default(''),
  active: z.boolean().optional().default(true),
});

export const permissionUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional(),
  active: z.boolean().optional(),
});

export const permissionIdParamsSchema = z.object({
  code: z.string().regex(codeRegex),
});

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  cursor: z.string().optional(), // docId del último elemento
});
