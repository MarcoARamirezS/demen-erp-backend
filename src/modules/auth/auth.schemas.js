import { z } from 'zod';

export const loginSchema = z.object({
  usuario: z.string().min(3).max(60),
  password: z.string().min(6).max(200),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(20),
});

// Bootstrap admin (solo para primer usuario; se recomienda por script o endpoint protegido por secret)
export const bootstrapAdminSchema = z.object({
  nombre: z.string().min(1),
  apaterno: z.string().min(1),
  amaterno: z.string().optional().default(''),
  direccion: z.string().optional().default(''),
  telefono: z.string().optional().default(''),
  ciudad: z.string().optional().default(''),
  estado: z.string().optional().default(''),
  usuario: z.string().min(3).max(60),
  password: z.string().min(10).max(200),
});
