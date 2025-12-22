import admin from 'firebase-admin';
import { firestore } from '../../config/firebase.js';

const col = firestore.collection('users');

export const usersRepository = {
  async findByUsername(usuario) {
    const snap = await col.where('usuario', '==', usuario).limit(1).get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  async findById(id) {
    const doc = await col.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async create(data) {
    const ref = col.doc();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const payload = { ...data, createdAt: now, updatedAt: now };
    await ref.set(payload);
    return { id: ref.id, ...payload };
  },

  async update(id, patch) {
    const ref = col.doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    await ref.update({ ...patch, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    const after = await ref.get();
    return { id: after.id, ...after.data() };
  },

  async remove(id) {
    const ref = col.doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      const err = new Error('User not found');
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

  async countAll() {
    const agg = await col.count().get();
    return agg.data().count || 0;
  },
};
