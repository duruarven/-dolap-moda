import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

try {
  await setDoc(doc(db, 'verification_codes', 'test'), { ok: true });
  console.log("Success");
  process.exit(0);
} catch(e) {
  console.error("Error", e.message);
  process.exit(1);
}
