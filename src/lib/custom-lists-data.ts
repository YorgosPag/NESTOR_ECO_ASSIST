import type { CustomList, CustomListItem } from "@/types";

const customLists: CustomList[] = [
    { id: 'list-1', name: 'Τίτλοι Παρεμβάσεων', key: 'INTERVENTION_TITLES' },
    { id: 'list-2', name: 'Ρόλοι Επαφών', key: 'CONTACT_ROLES' },
    { id: 'list-3', name: 'Κατηγορίες Παρεμβάσεων', key: 'INTERVENTION_CATEGORIES' },
];
const customListItems: CustomListItem[] = [
    // Intervention Titles
    { id: 'item-1', listId: 'list-1', name: 'Μελέτη Περιβαλλοντικών Επιπτώσεων' },
    { id: 'item-2', listId: 'list-1', name: 'Τοπογραφική Αποτύπωση' },
    { id: 'item-3', listId: 'list-1', name: 'Διαβούλευση με την Κοινότητα' },
    { id: 'item-4', listId: 'list-1', name: 'Έλεγχος Ποιότητας Υδάτων' },
    { id: 'item-5', listId: 'list-1', name: 'Ανάλυση Εδάφους' },
    { id: 'item-6', listId: 'list-1', name: 'Παρακολούθηση Ποιότητας Αέρα' },

    // Contact Roles
    { id: 'item-7', listId: 'list-2', name: 'Πελάτης' },
    { id: 'item-8', listId: 'list-2', name: 'Ομάδα' },
    { id: 'item-9', listId: 'list-2', name: 'Ενδιαφερόμενος' },
    { id: 'item-10', listId: 'list-2', name: 'Διαχειριστής' },
    { id: 'item-11', listId: 'list-2', name: 'Συνεργάτης' },
    { id: 'item-12', listId: 'list-2', name: 'Προμηθευτής' },

    // Intervention Categories
    { id: 'item-13', listId: 'list-3', name: 'Μελέτες' },
    { id: 'item-14', listId: 'list-3', name: 'Αποτυπώσεις' },
    { id: 'item-15', listId: 'list-3', name: 'Κοινότητα' },
    { id: 'item-16', listId: 'list-3', name: 'Παρακολούθηση' },
];

export async function getCustomLists(db?: any) {
    return Promise.resolve(customLists);
}

export async function getAllCustomListItems(db?: any) {
    return Promise.resolve(customListItems);
}
