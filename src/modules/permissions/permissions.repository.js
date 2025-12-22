import admin from 'firebase-admin';
import { firestore } from '../../config/firebase.js';

const col = firestore.collection('permissions');

export const permissionsRepository = {
  async create(code, data) {
    const ref = col.doc(code);
    const snap = await ref.get();
    if (snap.exists) {
      const err = new Error('Permission already exists');
      err.statusCode = 409;
      throw err;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    await ref.set({ ...data, createdAt: now, updatedAt: now });

    return { id: code, ...data };
  },

  async update(code, patch) {
    const ref = col.doc(code);
    const snap = await ref.get();
    if (!snap.exists) {
      const err = new Error('Permission not found');
      err.statusCode = 404;
      throw err;
    }

    await ref.update({ ...patch, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    const after = await ref.get();
    return { id: after.id, ...after.data() };
  },

  async getByCode(code) {
    const doc = await col.doc(code).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async remove(code) {
    const ref = col.doc(code);
    const snap = await ref.get();
    if (!snap.exists) {
      const err = new Error('Permission not found');
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
