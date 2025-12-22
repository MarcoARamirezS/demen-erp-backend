import { rolesRepository } from './roles.repository.js';
import { auditService } from '../audit/audit.service.js';

export const rolesService = {
  async create(input, actorUserId, meta) {
    const role = await rolesRepository.create({
      name: input.name,
      description: input.description || '',
      permissionCodes: input.permissionCodes || [],
      active: input.active ?? true,
    });

    await auditService.log({
      actorUserId,
      action: 'role_create',
      resource: 'roles',
      resourceId: role.id,
      meta,
    });

    return role;
  },

  async update(id, patch, actorUserId, meta) {
    const updated = await rolesRepository.update(id, patch);

    await auditService.log({
      actorUserId,
      action: 'role_update',
      resource: 'roles',
      resourceId: id,
      meta,
    });

    return updated;
  },

  async get(id) {
    const role = await rolesRepository.getById(id);
    if (!role) {
      const err = new Error('Role not found');
      err.statusCode = 404;
      throw err;
    }
    return role;
  },

  async remove(id, actorUserId, meta) {
    await rolesRepository.remove(id);

    await auditService.log({
      actorUserId,
      action: 'role_delete',
      resource: 'roles',
      resourceId: id,
      meta,
    });
  },

  async list(query) {
    return rolesRepository.list(query);
  },
};
