import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { config } from "dotenv";

config();

let app: App;

if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });
    console.log("✅ Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("❌ Firebase admin initialization error:", error.message);
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
} else {
  app = getApps()[0];
}

// Σταθερή ρύθμιση Firestore Emulator host αν δεν υπάρχει ENV
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || "localhost:8085";
console.log("⚠️ Connecting Firestore to emulator at", process.env.FIRESTORE_EMULATOR_HOST);

const db = getFirestore(app);

export function getAdminDb(): Firestore {
  return db;
}
