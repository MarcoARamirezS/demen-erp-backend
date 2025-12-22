import { permissionsRepository } from './permissions.repository.js';
import { auditService } from '../audit/audit.service.js';

export const permissionsService = {
  async create(input, actorUserId, meta) {
    const created = await permissionsRepository.create(input.code, {
      code: input.code,
      name: input.name,
      description: input.description || '',
      active: input.active ?? true,
      isSystem: false,
    });

    await auditService.log({
      actorUserId,
      action: 'permission_create',
      resource: 'permissions',
      resourceId: input.code,
      meta,
    });

    return created;
  },

  async update(code, patch, actorUserId, meta) {
    const updated = await permissionsRepository.update(code, patch);

    await auditService.log({
      actorUserId,
      action: 'permission_update',
      resource: 'permissions',
      resourceId: code,
      meta,
    });

    return updated;
  },

  async get(code) {
    const p = await permissionsRepository.getByCode(code);
    if (!p) {
      const err = new Error('Permission not found');
      err.statusCode = 404;
      throw err;
    }
    return p;
  },

  async remove(code, actorUserId, meta) {
    const existing = await permissionsRepository.getByCode(code);
    if (!existing) {
      const err = new Error('Permission not found');
      err.statusCode = 404;
      throw err;
    }

    if (existing.isSystem) {
      const err = new Error('System permission cannot be deleted');
      err.statusCode = 403;
      throw err;
    }

    await permissionsRepository.remove(code);

    await auditService.log({
      actorUserId,
      action: 'permission_delete',
      resource: 'permissions',
      resourceId: code,
      meta,
    });
  },

  async list(query) {
    return permissionsRepository.list(query);
  },
};
