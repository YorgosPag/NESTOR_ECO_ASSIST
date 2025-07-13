// src/app/actions/custom-lists.ts
"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getAdminDb } from "@/lib/firebase-admin";
import {
    addCustomList as addCustomListData,
    updateCustomList as updateCustomListData,
    deleteCustomList as deleteCustomListData,
    moveCustomList as moveCustomListData,
    addCustomListItem as addCustomListItemData,
    updateCustomListItem as updateCustomListItemData,
    deleteCustomListItem as deleteCustomListItemData,
} from "@/lib/custom-lists-data";
import type { CustomList, CustomListItem } from '@/types';

// List Actions
const ListSchema = z.object({
  name: z.string().min(3, "Το όνομα της λίστας πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
  key: z.string().optional(),
});

export async function createListAction(prevState: any, formData: FormData) {
  const validatedFields = ListSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Σφάλμα επικύρωσης.' };
  }
  try {
    const db = getAdminDb();
    await addCustomListData(db, validatedFields.data as Omit<CustomList, 'id' | 'order'>);
  } catch (e: any) {
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${e.message}` };
  }
  revalidatePath('/admin/custom-lists');
  return { success: true, message: 'Η λίστα δημιουργήθηκε με επιτυχία.' };
}

export async function updateListAction(prevState: any, formData: FormData) {
  const schema = ListSchema.extend({ id: z.string().min(1), order: z.string() });
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Σφάλμα επικύρωσης.' };
  }
  try {
    const db = getAdminDb();
    const listData = { ...validatedFields.data, order: parseInt(validatedFields.data.order, 10) };
    await updateCustomListData(db, listData as CustomList);
  } catch (e: any) {
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${e.message}` };
  }
  revalidatePath('/admin/custom-lists');
  return { success: true, message: 'Η λίστα ενημερώθηκε με επιτυχία.' };
}

export async function deleteListAction(prevState: any, formData: FormData) {
  const schema = z.object({ id: z.string().min(1) });
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, message: 'Μη έγκυρο ID λίστας.' };
  }
  try {
    const db = getAdminDb();
    await deleteCustomListData(db, validatedFields.data.id);
  } catch (e: any) {
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${e.message}` };
  }
  revalidatePath('/admin/custom-lists');
  return { success: true, message: 'Η λίστα διαγράφηκε με επιτυχία.' };
}

const MoveListSchema = z.object({
  id: z.string().min(1),
  direction: z.enum(['up', 'down']),
});

export async function moveListAction(formData: FormData) {
  const validatedFields = MoveListSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, message: 'Μη έγκυρα δεδομένα για μετακίνηση.' };
  }

  try {
    const db = getAdminDb();
    await moveCustomListData(db, validatedFields.data.id, validatedFields.data.direction);
  } catch(e: any) {
     return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${e.message}` };
  }

  revalidatePath('/admin/custom-lists');
  return { success: true };
}


// Item Actions
const ItemSchema = z.object({
  name: z.string().min(1, "Το όνομα του στοιχείου είναι υποχρεωτικό."),
  key: z.string().optional(),
  listId: z.string().min(1),
});

export async function createItemAction(prevState: any, formData: FormData) {
  const validatedFields = ItemSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Σφάλμα επικύρωσης.' };
  }
  try {
    const db = getAdminDb();
    await addCustomListItemData(db, validatedFields.data as Omit<CustomListItem, 'id'>);
  } catch (e: any) {
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${e.message}` };
  }
  revalidatePath('/admin/custom-lists');
  return { success: true, message: 'Το στοιχείο προστέθηκε με επιτυχία.' };
}

export async function updateItemAction(prevState: any, formData: FormData) {
  const schema = ItemSchema.extend({ id: z.string().min(1) });
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: 'Σφάλμα επικύρωσης.' };
  }
  try {
    const db = getAdminDb();
    await updateCustomListItemData(db, validatedFields.data as CustomListItem);
  } catch (e: any) {
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${e.message}` };
  }
  revalidatePath('/admin/custom-lists');
  return { success: true, message: 'Το στοιχείο ενημερώθηκε με επιτυχία.' };
}

export async function deleteItemAction(prevState: any, formData: FormData) {
  const schema = z.object({ id: z.string().min(1) });
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, message: 'Μη έγκυρο ID στοιχείου.' };
  }
  try {
    const db = getAdminDb();
    await deleteCustomListItemData(db, validatedFields.data.id);
  } catch (e: any) {
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${e.message}` };
  }
  revalidatePath('/admin/custom-lists');
  return { success: true, message: 'Το στοιχείο διαγράφηκε με επιτυχία.' };
}
