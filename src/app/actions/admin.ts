"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminDb } from "@/lib/firebase-admin";
import type { Firestore } from 'firebase-admin/firestore';
import { addMasterIntervention, updateMasterIntervention, deleteMasterIntervention } from "@/lib/interventions-data";
import { addTrigger, updateTrigger, deleteTrigger } from "@/lib/triggers-data";
import { addInterventionCategory as addInterventionCategoryData, updateInterventionCategory as updateInterventionCategoryData, deleteInterventionCategory as deleteInterventionCategoryData } from '@/lib/intervention-category-data';
import { createCustomList, deleteCustomList, createCustomListItem, updateCustomListItem, deleteCustomListItem as deleteCustomListItemData, updateCustomList } from '@/lib/custom-lists-data';
import { getAllProjects } from '@/lib/projects-data';
import type { MasterIntervention, Project, Trigger } from '@/types';


// Master Interventions Actions
const MasterInterventionSchema = z.object({
    code: z.string().min(1, "Ο κωδικός είναι υποχρεωτικός."),
    info: z.string().optional(),
    energySpecsOptions: z.string().optional(),
    expenseCategory: z.string().min(1, "Επιλέξτε μια έγκυρη κατηγορία δαπάνης."),
    interventionCategory: z.string().min(1, "Επιλέξτε μια έγκυρη κατηγορία παρέμβασης."),
    interventionSubcategory: z.string().optional(),
    unit: z.string().min(1, "Η μονάδα μέτρησης είναι υποχρεωτική."),
    maxUnitPrice: z.coerce.number().positive("Το κόστος/μονάδα πρέπει να είναι θετικός αριθμός."),
    maxAmount: z.coerce.number().positive("Το μέγιστο ποσό πρέπει να είναι θετικός αριθμός."),
});


export async function createMasterInterventionAction(prevState: any, formData: FormData) {
    const validatedFields = MasterInterventionSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const data = validatedFields.data;
        const db = getAdminDb();
        await addMasterIntervention(db, data as Omit<MasterIntervention, 'id'>);
    } catch (error: any) {
        console.error("🔥 ERROR in createMasterInterventionAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin');
    return { success: true, message: 'Η master παρέμβαση δημιουργήθηκε με επιτυχία.' };
}

const UpdateMasterInterventionSchema = MasterInterventionSchema.extend({
  id: z.string().min(1),
});

export async function updateMasterInterventionAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateMasterInterventionSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const { id, ...data } = validatedFields.data;
        const db = getAdminDb();
        await updateMasterIntervention(db, id, data);
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

// Trigger Actions
const TriggerSchema = z.object({
    name: z.string().min(3, "Το όνομα του trigger πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
    code: z.string().min(1, "Επιλέξτε έναν κωδικό."),
    interventionCategory: z.string().min(1, "Επιλέξτε μια έγκυρη κατηγορία παρέμβασης."),
    description: z.string().optional(),
});

export async function createTriggerAction(prevState: any, formData: FormData) {
    const validatedFields = TriggerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const db = getAdminDb();
        await addTrigger(db, validatedFields.data as Omit<Trigger, 'id'>);
    } catch (error: any) {
        console.error("🔥 ERROR in createTriggerAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin/triggers');
    return { success: true, message: 'Το trigger δημιουργήθηκε με επιτυχία.' };
}

const UpdateTriggerSchema = TriggerSchema.extend({
  id: z.string().min(1),
});

export async function updateTriggerAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateTriggerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const { id, ...data } = validatedFields.data;
        const db = getAdminDb();
        await updateTrigger(db, id, data as Omit<Trigger, 'id'>);
    } catch (error: any) {
        console.error("🔥 ERROR in updateTriggerAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin/triggers');
    return { success: true, message: 'Το trigger ενημερώθηκε με επιτυχία.' };
}

const DeleteTriggerSchema = z.object({
  id: z.string().min(1),
});

export async function deleteTriggerAction(prevState: any, formData: FormData) {
    const validatedFields = DeleteTriggerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρο ID.' };
    }

    try {
        const db = getAdminDb();
        await deleteTrigger(db, validatedFields.data.id);
    } catch (error: any) {
        console.error("🔥 ERROR in deleteTriggerAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/admin/triggers');
    return { success: true, message: 'Το trigger διαγράφηκε με επιτυχία.' };
}

// Intervention Category Actions
const InterventionCategorySchema = z.object({
    name: z.string().min(3, "Το όνομα της κατηγορίας πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
});

export async function createInterventionCategoryAction(prevState: any, formData: FormData) {
    const validatedFields = InterventionCategorySchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const db = getAdminDb();
        await addInterventionCategoryData(db, validatedFields.data);
    } catch (error: any) {
        console.error("🔥 ERROR in createInterventionCategoryAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin/triggers');
    return { success: true, message: 'Η κατηγορία δημιουργήθηκε με επιτυχία.' };
}

const UpdateInterventionCategorySchema = InterventionCategorySchema.extend({
  id: z.string().min(1),
});

export async function updateInterventionCategoryAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateInterventionCategorySchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const { id, ...data } = validatedFields.data;
        const db = getAdminDb();
        await updateInterventionCategoryData(db, id, data);
    } catch (error: any) {
        console.error("🔥 ERROR in updateInterventionCategoryAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin/triggers');
    return { success: true, message: 'Η κατηγορία ενημερώθηκε με επιτυχία.' };
}

const DeleteInterventionCategorySchema = z.object({
  id: z.string().min(1),
});

export async function deleteInterventionCategoryAction(prevState: any, formData: FormData) {
    const validatedFields = DeleteInterventionCategorySchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρο ID.' };
    }

    try {
        const db = getAdminDb();
        await deleteInterventionCategoryData(db, validatedFields.data.id);
    } catch (error: any) {
        console.error("🔥 ERROR in deleteInterventionCategoryAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/admin/triggers');
    return { success: true, message: 'Η κατηγορία διαγράφηκε με επιτυχία.' };
}

// Custom List Actions
const CustomListSchema = z.object({
    name: z.string().min(2, "Το όνομα της λίστας πρέπει να έχει τουλάχιστον 2 χαρακτήρες."),
});

// Mapping of user-facing names to stable system keys.
const SYSTEM_LIST_KEYS: { [name: string]: string } = {
    'Κωδικός': 'CODE',
    'Κατηγορία Παρέμβασης': 'INTERVENTION_CATEGORY',
    'Κατηγορία Δαπάνης': 'EXPENSE_CATEGORY',
    'Υπο-Κατηγορία Παρέμβασης': 'SUB_INTERVENTION_CATEGORY',
    'info': 'INFO',
    'Ενεργειακά Χαρακτηριστικά': 'ENERGY_SPECS',
    'τίτλοι παρεμβάσεων': 'INTERVENTION_TITLES',
    'Ρόλοι Επαφών': 'CONTACT_ROLES',
    'Μονάδες Μέτρησης': 'UNIT_OF_MEASUREMENT',
};

export async function createCustomListAction(prevState: any, formData: FormData) {
    const validatedFields = CustomListSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const { name } = validatedFields.data;
        const db = getAdminDb();
        const key = SYSTEM_LIST_KEYS[name]; // Check if the name matches a system list
        await createCustomList(db, name, key);
    } catch (error: any) {
        console.error("🔥 ERROR in createCustomListAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin/custom-lists');
    return { success: true, message: 'Η λίστα δημιουργήθηκε με επιτυχία.' };
}

const UpdateCustomListSchema = CustomListSchema.extend({
  id: z.string().min(1),
});

export async function updateCustomListAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateCustomListSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const { id, name } = validatedFields.data;
        const db = getAdminDb();
        await updateCustomList(db, id, name);
    } catch (error: any) {
        console.error("🔥 ERROR in updateCustomListAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin/custom-lists');
    return { success: true, message: 'Η λίστα ενημερώθηκε με επιτυχία.' };
}

async function findListItemUsage(db: any, listId: string): Promise<string[]> {
    // This is a mock implementation. A real implementation would query Firestore.
    const usage: string[] = [];
    
    // This is a placeholder function. In a real scenario with Firestore,
    // you would perform queries against your projects to check for usage.
    // For now, we will simulate no usage to allow deletion.
    
    return Promise.resolve(usage);
}

const DeleteCustomListSchema = z.object({
  id: z.string().min(1),
});

export async function deleteCustomListAction(prevState: any, formData: FormData) {
    const validatedFields = DeleteCustomListSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρο ID.', errors: null };
    }

    try {
        const db = getAdminDb();
        const listId = validatedFields.data.id;

        const usage = await findListItemUsage(db, listId);
        if (usage.length > 0) {
            // In a real app, you would fetch the list name. We'll use a generic name here.
            const listName = 'Αυτή η λίστα';
            return {
                success: false,
                message: `${listName} δεν μπορεί να διαγραφεί γιατί χρησιμοποιείται.`,
                errors: { usage: usage }
            };
        }

        await deleteCustomList(db, listId);
    } catch (error: any) {
        console.error("🔥 ERROR in deleteCustomListAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}`, errors: null };
    }

    revalidatePath('/admin/custom-lists');
    return { success: true, message: 'Η λίστα διαγράφηκε με επιτυχία.', errors: null };
}


// Custom List Item Actions
const CustomListItemSchema = z.object({
    name: z.string().min(1, "Το πεδίο ονομάτων δεν μπορεί να είναι κενό."),
    listId: z.string().min(1, "Το ID της λίστας είναι υποχρεωτικό."),
});

export async function createCustomListItemAction(prevState: any, formData: FormData) {
    const validatedFields = CustomListItemSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    const { listId, name: namesString } = validatedFields.data;
    const names = namesString.split(';').map(n => n.trim()).filter(Boolean);
    const uniqueNames = [...new Set(names.map(n => n.toLowerCase()))]
        .map(lowerCaseName => names.find(n => n.toLowerCase() === lowerCaseName)!);

    if (uniqueNames.length === 0) {
        return {
            success: false,
            errors: { name: ['Παρακαλώ εισάγετε τουλάχιστον ένα έγκυρο όνομα.'] },
            message: 'Δεν βρέθηκαν ονόματα για προσθήκη.',
        };
    }
    
    try {
        const db = getAdminDb();
        
        // This is a simplified version. A real app would query the DB.
        const { newNamesToAdd, duplicateNames } = await createCustomListItem(db, listId, uniqueNames);
        
        let message = '';
        if (newNamesToAdd.length > 0) {
            message += `Προστέθηκαν ${newNamesToAdd.length} νέα αντικείμενα. `;
        }
        if (duplicateNames.length > 0) {
            message += `${duplicateNames.length} αντικείμενα (${duplicateNames.join(', ')}) υπήρχαν ήδη και αγνοήθηκαν.`;
        }
        if (!message) {
            message = 'Δεν προστέθηκαν νέα αντικείμενα, καθώς υπήρχαν ήδη.';
        }

        revalidatePath('/admin/custom-lists');
        return { success: true, message: message.trim(), errors: {} };

    } catch (error: any) {
        console.error("🔥 ERROR in createCustomListItemAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
}

const UpdateCustomListItemSchema = CustomListItemSchema.extend({
  id: z.string().min(1),
});

export async function updateCustomListItemAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateCustomListItemSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }
    
    try {
        const { id, name, listId } = validatedFields.data;
        const db = getAdminDb();

        const isDuplicate = await updateCustomListItem(db, id, name, listId);
        
        if (isDuplicate) {
             return {
                success: false,
                errors: { name: ['Ένα άλλο αντικείμενο με αυτό το όνομα υπάρχει ήδη σε αυτή τη λίστα.'] },
                message: 'Σφάλμα. Το όνομα χρησιμοποιείται ήδη.',
            };
        }
    } catch (error: any) {
        console.error("🔥 ERROR in updateCustomListItemAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }
    
    revalidatePath('/admin/custom-lists');
    return { success: true, message: 'Το αντικείμενο ενημερώθηκε με επιτυχία.' };
}

const DeleteCustomListItemSchema = z.object({
  id: z.string().min(1),
});

export async function deleteCustomListItemAction(prevState: any, formData: FormData) {
    const validatedFields = DeleteCustomListItemSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρο ID.' };
    }

    try {
        const db = getAdminDb();
        await deleteCustomListItemData(db, validatedFields.data.id);
    } catch (error: any) {
        console.error("🔥 ERROR in deleteCustomListItemAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/admin/custom-lists');
    return { success: true, message: 'Το αντικείμενο διαγράφηκε με επιτυχία.' };
}
