import { z } from 'zod';

export const roleCreateSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(300).optional().default(''),
  permissionCodes: z.array(z.string().min(3)).optional().default([]),
  active: z.boolean().optional().default(true),
});

export const roleUpdateSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().max(300).optional(),
  permissionCodes: z.array(z.string().min(3)).optional(),
  active: z.boolean().optional(),
});

export const roleIdParamsSchema = z.object({
  id: z.string().min(10),
});

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  cursor: z.string().optional(),
});
