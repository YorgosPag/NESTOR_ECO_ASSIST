
import * as admin from 'firebase-admin';
import { config } from 'dotenv';

config();

// Check if the service account JSON is provided in the environment
const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

/**
 * Initializes the Firebase Admin SDK if it hasn't been already.
 * This function uses a singleton pattern to ensure that initialization only happens once.
 * @returns {admin.app.App} The initialized Firebase app instance.
 */
function initializeApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  let credential;

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      credential = admin.credential.cert(serviceAccount);
      console.log("Initializing Firebase Admin SDK with Service Account from environment variable.");
    } catch (error: any) {
      throw new Error(`Error parsing service account JSON: ${error.message}`);
    }
  } else {
    // Fallback for environments where Application Default Credentials are set up (e.g., Google Cloud Run)
    console.log("Initializing Firebase Admin SDK with Application Default Credentials.");
    credential = admin.credential.applicationDefault();
  }
  
  try {
      return admin.initializeApp({ credential });
  } catch (error: any) {
      throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

/**
 * Gets the Firestore database instance.
 * It ensures that the Firebase app is initialized before returning the database instance.
 * @returns {admin.firestore.Firestore} The Firestore database instance.
 */
export function getAdminDb() {
  const app = initializeApp();
  return app.firestore();
}
