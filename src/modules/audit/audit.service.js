import admin from 'firebase-admin';
import { auditRepository } from './audit.repository.js';

export const auditService = {
  async log({ actorUserId = null, action, resource, resourceId = null, meta = {} }) {
    return auditRepository.create({
      actorUserId,
      action,
      resource,
      resourceId,
      meta,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  },

  async get(id) {
    const item = await auditRepository.getById(id);
    if (!item) {
      const err = new Error('Audit log not found');
      err.statusCode = 404;
      throw err;
    }
    return item;
  },

  async list(query) {
    return auditRepository.list(query);
  },
};
