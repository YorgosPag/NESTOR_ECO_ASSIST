import type { Contact } from '@/types';
import type { Firestore } from 'firebase-admin/firestore';

function serializeTimestamps(data: any) {
    if (!data) return data;
    const serializedData: { [key: string]: any } = {};
    for (const key in data) {
        const value = data[key];
        if (value && typeof value.toDate === 'function') {
            serializedData[key] = value.toDate().toISOString();
        } else {
            serializedData[key] = value;
        }
    }
    return serializedData;
}

export const getContacts = async (db: Firestore): Promise<Contact[]> => {
    const contactsCollection = db.collection('contacts');
    const snapshot = await contactsCollection.orderBy('lastName').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...serializeTimestamps(doc.data())
    } as Contact));
}

export const getContactById = async (db: Firestore, id: string): Promise<Contact | undefined> => {
    const doc = await db.collection('contacts').doc(id).get();
    if (!doc.exists) {
        return undefined;
    }
    const data = doc.data();
    return { 
        id: doc.id, 
        ...serializeTimestamps(data) 
    } as Contact;
}

export const addContact = async (db: Firestore, contact: Omit<Contact, 'id'>): Promise<Contact> => {
    const docRef = await db.collection('contacts').add(contact);
    const newContact = await getContactById(db, docRef.id);
    if (!newContact) {
        throw new Error("Failed to create and retrieve contact.");
    }
    return newContact;
}

export const updateContact = async (db: Firestore, id: string, updates: Partial<Omit<Contact, 'id'>>): Promise<boolean> => {
    try {
        await db.collection('contacts').doc(id).update(updates);
        return true;
    } catch (error) {
        console.error("Error updating contact:", error);
        return false;
    }
}

export const deleteContact = async (db: Firestore, id: string): Promise<boolean> => {
    try {
        await db.collection('contacts').doc(id).delete();
        return true;
    } catch (error) {
        console.error("Error deleting contact:", error);
        return false;
    }
}
