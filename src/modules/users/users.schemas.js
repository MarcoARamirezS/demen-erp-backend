import { z } from 'zod';

export const userCreateSchema = z.object({
  nombre: z.string().min(1),
  apaterno: z.string().min(1),
  amaterno: z.string().optional().default(''),
  direccion: z.string().optional().default(''),
  telefono: z.string().optional().default(''),
  ciudad: z.string().optional().default(''),
  estado: z.string().optional().default(''),
  usuario: z.string().min(3).max(60),
  password: z.string().min(10).max(200),
  activo: z.boolean().optional().default(true),
  roleIds: z.array(z.string().min(10)).optional().default([]),
  permissionCodes: z.array(z.string().min(3)).optional().default([]),
});

export const userUpdateSchema = z.object({
  nombre: z.string().min(1).optional(),
  apaterno: z.string().min(1).optional(),
  amaterno: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  ciudad: z.string().optional(),
  estado: z.string().optional(),
  usuario: z.string().min(3).max(60).optional(),
  password: z.string().min(10).max(200).optional(),
  activo: z.boolean().optional(),
  roleIds: z.array(z.string().min(10)).optional(),
  permissionCodes: z.array(z.string().min(3)).optional(),
});

export const userIdParamsSchema = z.object({
  id: z.string().min(10),
});

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
  cursor: z.string().optional(),
});
