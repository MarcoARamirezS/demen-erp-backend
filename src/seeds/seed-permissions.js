import 'dotenv/config';
import { firestore } from '../config/firebase.js';
import { PERMISSIONS_SEED } from './permissions.seed.js';

const collection = firestore.collection('permissions');

for (const perm of PERMISSIONS_SEED) {
  const ref = collection.doc(perm.code);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      ...perm,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Created permission ${perm.code}`);
  } else {
    await ref.update({
      ...perm,
      updatedAt: new Date(),
    });
    console.log(`♻️ Updated permission ${perm.code}`);
  }
}

process.exit(0);
