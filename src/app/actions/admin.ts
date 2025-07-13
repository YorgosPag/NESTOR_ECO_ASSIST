
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminDb } from "@/lib/firebase-admin";
import { addMasterIntervention, updateMasterIntervention, deleteMasterIntervention } from "@/lib/interventions-data";
import type { MasterIntervention } from '@/types';

const MasterInterventionSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Το όνομα πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
    description: z.string().optional(),
    category: z.string().min(1, "Η κατηγορία είναι υποχρεωτική."),
});

export async function createMasterInterventionAction(prevState: any, formData: FormData) {
    const validatedFields = MasterInterventionSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }
    
    try {
        const db = getAdminDb();
        await addMasterIntervention(db, validatedFields.data as Omit<MasterIntervention, 'id'>);
    } catch (error: any) {
        console.error("🔥 ERROR in createMasterInterventionAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin');
    return { success: true, message: 'Η master παρέμβαση δημιουργήθηκε με επιτυχία.' };
}

export async function updateMasterInterventionAction(prevState: any, formData: FormData) {
    const validatedFields = MasterInterventionSchema.extend({
        id: z.string().min(1),
    }).safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }
    
    try {
        const { id, ...data } = validatedFields.data;
        const db = getAdminDb();
        await updateMasterIntervention(db, { id, ...data } as MasterIntervention);
    } catch (error: any) {
        console.error("🔥 ERROR in updateMasterInterventionAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin');
    return { success: true, message: 'Η master παρέμβαση ενημερώθηκε με επιτυχία.' };
}

const DeleteMasterInterventionSchema = z.object({
  id: z.string().min(1),
});

export async function deleteMasterInterventionAction(prevState: any, formData: FormData) {
    const validatedFields = DeleteMasterInterventionSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρο ID.' };
    }

    try {
        const db = getAdminDb();
        await deleteMasterIntervention(db, validatedFields.data.id);
    } catch (error: any) {
        console.error("🔥 ERROR in deleteMasterInterventionAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/admin');
    return { success: true, message: 'Η master παρέμβαση διαγράφηκε με επιτυχία.' };
}
