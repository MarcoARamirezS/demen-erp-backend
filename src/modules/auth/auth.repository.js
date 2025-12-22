import admin from 'firebase-admin';
import { firestore } from '../../config/firebase.js';

const col = firestore.collection('refreshTokens');

export const authRepository = {
  async createRefreshToken({ userId, tokenHash, expiresAt, userAgent = null, ip = null }) {
    const ref = col.doc();
    await ref.set({
      userId,
      tokenHash,
      expiresAt,
      userAgent,
      ip,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      revokedAt: null,
      replacedByTokenHash: null,
    });
    return { id: ref.id };
  },

  async findActiveByHash(tokenHash) {
    const snap = await col
      .where('tokenHash', '==', tokenHash)
      .where('revokedAt', '==', null)
      .limit(1)
      .get();

    if (snap.empty) return null;

    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  async revokeToken({ id, replacedByTokenHash = null }) {
    await col.doc(id).update({
      revokedAt: admin.firestore.FieldValue.serverTimestamp(),
      replacedByTokenHash,
    });
  },
};
