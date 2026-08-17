import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

try {
  await setDoc(doc(db, 'verificationCodes', 'test'), { ok: true });
  console.log("Success");
} catch(e) {
  console.error("Error", e.message);
}
