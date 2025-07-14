import * as admin from 'firebase-admin';

// Ensure the app is only initialized once
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error: any) {
        console.error("Firebase Admin SDK initialization error:", error.stack);
    }
}

let db: admin.firestore.Firestore;
try {
    db = admin.firestore();
} catch (error) {
    console.error("Failed to get Firestore instance:", error);
    // You might want to handle this case more gracefully
    // For now, we'll let it throw, which should be caught by the server environment
}


export function getAdminDb() {
  if (!db) {
    console.error("Firestore DB not initialized. Check your environment setup.");
    // This will likely cause the app to fail, which is intended if DB connection fails.
    throw new Error("Firestore database is not available.");
  }
  return db;
}
