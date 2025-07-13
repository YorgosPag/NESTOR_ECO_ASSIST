"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminDb } from "@/lib/firebase-admin";
import { 
    addContact as addContactData, 
    updateContact as updateContactData,
    deleteContact as deleteContactData
} from '@/lib/contacts-data';
import type { Contact } from '@/types';

const ContactSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(1, 'Το όνομα είναι υποχρεωτικό.'),
    lastName: z.string().min(1, 'Το επώνυμο είναι υποχρεωτικό.'),
    email: z.string().email('Μη έγκυρη διεύθυνση email.'),
    role: z.string().min(1, "Παρακαλώ επιλέξτε έναν έγκυρο ρόλο."),
    company: z.string().optional(),
    specialty: z.string().optional(),
    mobilePhone: z.string().optional(),
    landlinePhone: z.string().optional(),
    addressStreet: z.string().optional(),
    addressNumber: z.string().optional(),
    addressArea: z.string().optional(),
    addressPostalCode: z.string().optional(),
    addressCity: z.string().optional(),
    addressPrefecture: z.string().optional(),
    notes: z.string().optional(),
});

export async function createContactAction(prevState: any, formData: FormData) {
    const validatedFields = ContactSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }

    try {
        const db = getAdminDb();
        await addContactData(db, validatedFields.data as Omit<Contact, 'id'>);

    } catch (error: any) {
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/contacts');
    return { success: true, message: 'Η επαφή δημιουργήθηκε με επιτυχία.' };
}

export async function updateContactAction(prevState: any, formData: FormData) {
    const validatedFields = ContactSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }

    const { id, ...contactData } = validatedFields.data;
    if (!id) {
        return { success: false, message: 'Missing contact ID for update.' };
    }


    try {
        const db = getAdminDb();
        await updateContactData(db, { id, ...contactData } as Contact);
    } catch (error: any) {
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/contacts');
    return { success: true, message: 'Η επαφή ενημερώθηκε με επιτυχία.' };
}

const DeleteContactSchema = z.object({
  id: z.string().min(1),
});

export async function deleteContactAction(prevState: any, formData: FormData) {
    const validatedFields = DeleteContactSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρα δεδομένα.' };
    }

    try {
        const db = getAdminDb();
        await deleteContactData(db, validatedFields.data.id);
    } catch (error: any) {
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/contacts');
    return { success: true, message: 'Η επαφή διαγράφηκε με επιτυχία.' };
}
