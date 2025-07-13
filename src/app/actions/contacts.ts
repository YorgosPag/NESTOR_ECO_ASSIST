"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminDb } from "@/lib/firebase-admin";
import { 
    addContact, 
    updateContact,
    deleteContact
} from '@/lib/contacts-data';
import type { Contact } from '@/types';

const ContactSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, "Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες."),
  lastName: z.string().min(2, "Το επώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες."),
  email: z.string().email("Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.").optional().or(z.literal('')),
  mobilePhone: z.string().regex(/^\d{10}$/, "Το κινητό τηλέφωνο πρέπει να αποτελείται από ακριβώς 10 ψηφία.").optional().or(z.literal('')),
  role: z.string().min(1, "Παρακαλώ επιλέξτε έναν ρόλο."),
  specialty: z.string().optional(),
  company: z.string().optional(),
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
    await addContact(db, validatedFields.data as Omit<Contact, 'id'>);
  } catch (error: any) {
    console.error("🔥 ERROR in createContactAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }
  
  revalidatePath('/contacts');
  return { success: true, message: 'Η επαφή δημιουργήθηκε με επιτυχία.' };
}

export async function updateContactAction(prevState: any, formData: FormData) {
    const validatedFields = ContactSchema.extend({
        id: z.string().min(1),
    }).safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }

    const { id, ...contactData } = validatedFields.data;

    try {
        const db = getAdminDb();
        await updateContact(db, { id, ...contactData } as Contact);
    } catch (error: any) {
        console.error("🔥 ERROR in updateContactAction:", error);
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
        await deleteContact(db, validatedFields.data.id);
    } catch (error: any) {
        console.error("🔥 ERROR in deleteContactAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/contacts');
    return { success: true, message: 'Η επαφή διαγράφηκε με επιτυχία.' };
}
