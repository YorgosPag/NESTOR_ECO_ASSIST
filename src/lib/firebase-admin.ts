
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { config } from 'dotenv';

config();

let app: App;
let db: Firestore;

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (getApps().length === 0) {
    try {
        app = initializeApp({
            credential: cert(serviceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error: any) {
         console.error('Firebase admin initialization error', error.message);
    }
} else {
    app = getApps()[0];
}

db = getFirestore(app);

export function getAdminDb(): Firestore {
    if (!db) {
        throw new Error("Firestore database is not available. Initialization may have failed.");
    }
    return db;
}
