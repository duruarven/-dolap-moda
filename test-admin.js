import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

try {
  initializeApp();
  const db = getFirestore();
  await db.collection('test').doc('test').set({ ok: true });
  console.log("Success");
} catch (e) {
  console.error(e);
}
