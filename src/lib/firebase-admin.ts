
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { config } from 'dotenv';

config();

let app: App;
let db: Firestore;

function getServiceAccount() {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountJson) {
        try {
            return JSON.parse(serviceAccountJson);
        } catch (error: any) {
            console.error(`Error parsing service account JSON: ${error.message}`);
            return null;
        }
    }
    console.warn("GOOGLE_SERVICE_ACCOUNT_JSON environment variable not found. Attempting Application Default Credentials.");
    return null;
}

if (getApps().length === 0) {
    const serviceAccount = getServiceAccount();
    try {
        app = initializeApp({
            credential: serviceAccount ? cert(serviceAccount) : undefined,
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error: any) {
         console.error('Firebase admin initialization error', error);
         // We do not throw here to avoid crashing the server on boot, 
         // but getAdminDb will throw if db is not initialized.
    }
} else {
    app = getApp();
    console.log("Firebase Admin SDK already initialized.");
}

db = getFirestore(app);

export function getAdminDb(): Firestore {
    if (!db) {
        // This case would happen if initialization failed.
        throw new Error("Firestore database is not available. Initialization may have failed.");
    }
    return db;
}
