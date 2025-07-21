import { FIREBASE_CONFIG } from 'hostApp/vars';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(FIREBASE_CONFIG);

const db = getFirestore(app);

export { db };