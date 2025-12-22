import { firestore } from '../../config/firebase.js';

const col = firestore.collection('auditLogs');

export const auditRepository = {
  async create(entry) {
    const ref = col.doc();
    await ref.set(entry);
    return { id: ref.id, ...entry };
  },

  async getById(id) {
    const doc = await col.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
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
