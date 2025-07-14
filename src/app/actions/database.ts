"use server";

import { revalidatePath } from 'next/cache';
import { getAdminDb } from "@/lib/firebase-admin";
import { 
    seedContacts, 
    seedMasterInterventions,
    seedCustomLists,
    seedProjects
} from '@/lib/data';

async function clearCollection(db: FirebaseFirestore.Firestore, collectionPath: string) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(500);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db: FirebaseFirestore.Firestore, query: FirebaseFirestore.Query, resolve: (value: unknown) => void) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve(true);
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}


export async function seedDatabase() {
    try {
        const db = getAdminDb();

        console.log("🔥 Clearing all collections...");
        await Promise.all([
            clearCollection(db, 'projects'),
            clearCollection(db, 'contacts'),
            clearCollection(db, 'masterInterventions'),
            clearCollection(db, 'customLists'),
            clearCollection(db, 'customListItems'),
            clearCollection(db, 'offers'),
        ]);
        console.log("✅ All collections cleared.");

        console.log("🌱 Seeding database...");
        await seedContacts(db);
        await seedMasterInterventions(db);
        const { customListIdMap } = await seedCustomLists(db);
        await seedProjects(db, customListIdMap);
        console.log("✅ Database seeded successfully!");

        revalidatePath('/'); // Revalidate all paths
        return { success: true, message: 'Η βάση δεδομένων αρχικοποιήθηκε με επιτυχία!' };
    } catch (error: any) {
        console.error("🔥 Database seeding failed:", error);
        return { success: false, message: `Σφάλμα κατά την αρχικοποίηση της βάσης: ${error.message}` };
    }
}
