import { usersRepository } from './users.repository.js';
import { auditService } from '../audit/audit.service.js';
import { hashPassword } from '../../config/crypto.js';

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export const usersService = {
  async create(input, actorUserId, meta) {
    const existing = await usersRepository.findByUsername(input.usuario);
    if (existing) {
      const err = new Error('Username already exists');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(input.password);

    const created = await usersRepository.create({
      nombre: input.nombre,
      apaterno: input.apaterno,
      amaterno: input.amaterno || '',
      direccion: input.direccion || '',
      telefono: input.telefono || '',
      ciudad: input.ciudad || '',
      estado: input.estado || '',
      usuario: input.usuario,
      passwordHash,
      activo: input.activo ?? true,
      roleIds: input.roleIds || [],
      permissionCodes: input.permissionCodes || [],
    });

    await auditService.log({
      actorUserId,
      action: 'user_create',
      resource: 'users',
      resourceId: created.id,
      meta,
    });

    return sanitizeUser(created);
  },

  async update(id, patch, actorUserId, meta) {
    if (patch.usuario) {
      const existing = await usersRepository.findByUsername(patch.usuario);
      if (existing && existing.id !== id) {
        const err = new Error('Username already exists');
        err.statusCode = 409;
        throw err;
      }
    }

    const toUpdate = { ...patch };

    if (patch.password) {
      toUpdate.passwordHash = await hashPassword(patch.password);
      delete toUpdate.password;
    }

    const updated = await usersRepository.update(id, toUpdate);

    await auditService.log({
      actorUserId,
      action: 'user_update',
      resource: 'users',
      resourceId: id,
      meta,
    });

    return sanitizeUser(updated);
  },

  async get(id) {
    const user = await usersRepository.findById(id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return sanitizeUser(user);
  },

  async remove(id, actorUserId, meta) {
    await usersRepository.remove(id);

    await auditService.log({
      actorUserId,
      action: 'user_delete',
      resource: 'users',
      resourceId: id,
      meta,
    });
  },

  async list(query) {
    const { items, nextCursor } = await usersRepository.list(query);
    return { items: items.map(sanitizeUser), nextCursor };
  },
};
