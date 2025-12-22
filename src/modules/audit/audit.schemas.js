import { z } from 'zod';

export const auditIdParamsSchema = z.object({
  id: z.string().min(10),
});

export const auditListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  cursor: z.string().optional(),
});
