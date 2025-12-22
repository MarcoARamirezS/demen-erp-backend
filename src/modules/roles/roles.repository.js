import admin from 'firebase-admin';
import { firestore } from '../../config/firebase.js';

const col = firestore.collection('roles');

export const rolesRepository = {
  async findManyByIds(ids = []) {
    if (!ids.length) return [];
    const chunks = [];
    for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));

    const roles = [];
    for (const chunk of chunks) {
      const snap = await col.where('__name__', 'in', chunk).get();
      snap.forEach((d) => roles.push({ id: d.id, ...d.data() }));
    }
    return roles;
  },

  async create(data) {
    const ref = col.doc();
    const now = admin.firestore.FieldValue.serverTimestamp();
    await ref.set({ ...data, createdAt: now, updatedAt: now });
    return { id: ref.id, ...data };
  },

  async update(id, patch) {
    const ref = col.doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      const err = new Error('Role not found');
      err.statusCode = 404;
      throw err;
    }
    await ref.update({ ...patch, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    const after = await ref.get();
    return { id: after.id, ...after.data() };
  },

  async getById(id) {
    const doc = await col.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async remove(id) {
    const ref = col.doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      const err = new Error('Role not found');
      err.statusCode = 404;
      throw err;
    }
    await ref.delete();
  },

  async list({ limit, cursor }) {
    let q = col.orderBy('createdAt', 'desc').limit(limit);
    if (cursor) {
      const cursorDoc = await col.doc(cursor).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }
    const snap = await q.get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const nextCursor = items.length ? items[items.length - 1].id : null;
    return { items, nextCursor };
  },
};
