// src/app/actions/offers.ts
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminDb } from '@/lib/firebase-admin';
import { addOffer } from '@/lib/offers-data';
import type { Offer } from '@/types';

// Zod schema for validating a single offer item
const OfferItemSchema = z.object({
  id: z.string(), // Client-side temporary ID
  name: z.string().min(1, "Η περιγραφή του αντικειμένου είναι υποχρεωτική."),
  unit: z.string().min(1, "Η μονάδα μέτρησης είναι υποχρεωτική."),
  quantity: z.coerce.number().min(0, "Η ποσότητα πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  unitPrice: z.coerce.number().positive("Η τιμή μονάδας πρέπει να είναι θετικός αριθμός."),
});

// Zod schema for validating the entire offer form
const CreateOfferSchema = z.object({
  supplierId: z.string().min(1, "Πρέπει να επιλέξετε προμηθευτή."),
  type: z.enum(['general', 'perProject']),
  projectId: z.string().optional(),
  description: z.string().min(3, "Η περιγραφή πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
  fileUrl: z.string().url().optional(),
  items: z.preprocess((val) => {
    // Preprocess to handle the stringified items array from the form
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            return [];
        }
    }
    return val;
  }, z.array(OfferItemSchema).min(1, "Πρέπει να υπάρχει τουλάχιστον μία γραμμή προσφοράς.")),
});

export async function createOfferAction(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  // Conditionally remove projectId if type is 'general'
  if (rawData.type === 'general') {
    delete rawData.projectId;
  }

  const validatedFields = CreateOfferSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία με σφάλμα.',
    };
  }

  try {
    const db = getAdminDb();
    
    const { items, ...offerData } = validatedFields.data;
    const offerToSave: Omit<Offer, 'id' | 'createdAt'> = {
        ...offerData,
        supplierType: 'vendor', // Placeholder
        items: items.map(({ id, ...rest }) => rest), // Remove client-side temp id
    };
    
    await addOffer(db, offerToSave);
  } catch (error: any) {
    console.error("🔥 ERROR in createOfferAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }
  
  revalidatePath('/offers');
  // In a real app, you would redirect to the newly created offer or the offers list.
  return { success: true, message: 'Η προσφορά δημιουργήθηκε με επιτυχία.' };
}
