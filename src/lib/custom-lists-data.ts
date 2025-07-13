import type { CustomList, CustomListItem } from "@/types";

let customLists: CustomList[] = [
    { id: 'list-1', name: 'Τίτλοι Παρεμβάσεων', key: 'INTERVENTION_TITLES', order: 0 },
    { id: 'list-2', name: 'Ρόλοι Επαφών', key: 'CONTACT_ROLES', order: 1 },
    { id: 'list-3', name: 'Κατηγορίες Παρεμβάσεων', key: 'INTERVENTION_CATEGORIES', order: 2 },
    { id: 'list-4', name: 'Κατηγορίες Δαπάνης', key: 'EXPENSE_CATEGORIES', order: 3 },
];
let customListItems: CustomListItem[] = [
    // Intervention Titles
    { id: 'item-1', listId: 'list-1', name: 'Μελέτη Περιβαλλοντικών Επιπτώσεων', key: 'MPE' },
    { id: 'item-2', listId: 'list-1', name: 'Τοπογραφική Αποτύπωση', key: 'TOPO' },
    { id: 'item-3', listId: 'list-1', name: 'Διαβούλευση με την Κοινότητα', key: 'CONSULT' },
    { id: 'item-4', listId: 'list-1', name: 'Έλεγχos Ποιότητας Υδάτων', key: 'WATER' },
    { id: 'item-5', listId: 'list-1', name: 'Ανάλυση Εδάφους', key: 'SOIL' },
    { id: 'item-6', listId: 'list-1', name: 'Παρακολούθηση Ποιότητας Αέρα', key: 'AIR' },

    // Contact Roles
    { id: 'item-7', listId: 'list-2', name: 'Πελάτης', key: 'CLIENT' },
    { id: 'item-8', listId: 'list-2', name: 'Ομάδα', key: 'TEAM' },
    { id: 'item-9', listId: 'list-2', name: 'Ενδιαφερόμενος', key: 'STAKEHOLDER' },
    { id: 'item-10', listId: 'list-2', name: 'Διαχειριστής', key: 'ADMIN' },
    { id: 'item-11', listId: 'list-2', name: 'Συνεργάτης', key: 'PARTNER' },
    { id: 'item-12', listId: 'list-2', name: 'Προμηθευτής', key: 'VENDOR' },

    // Intervention Categories
    { id: 'item-13', listId: 'list-3', name: 'Μελέτες', key: 'STUDIES' },
    { id: 'item-14', listId: 'list-3', name: 'Αποτυπώσεις', key: 'SURVEYS' },
    { id: 'item-15', listId: 'list-3', name: 'Κοινότητα', key: 'COMMUNITY' },
    { id: 'item-16', listId: 'list-3', name: 'Παρακολούθηση', key: 'MONITORING' },
    
    // Expense Categories
    { id: 'item-17', listId: 'list-4', name: 'Ενέργεια', key: 'ENERGY' },
    { id: 'item-18', listId: 'list-4', name: 'Ύδρευση', key: 'WATER_SUPPLY' },
    { id: 'item-19', listId: 'list-4', name: 'Αποχέτευση', key: 'SEWAGE' },
];

export async function getCustomLists(db?: any) {
    // Sort by order before returning
    const sortedLists = customLists.sort((a, b) => a.order - b.order);
    return Promise.resolve(JSON.parse(JSON.stringify(sortedLists)));
}

export async function addCustomList(db: any, listData: Omit<CustomList, 'id' | 'order'>) {
    const maxOrder = customLists.reduce((max, list) => list.order > max ? list.order : max, -1);
    const newList: CustomList = { 
        id: `list-${Date.now()}`, 
        ...listData,
        order: maxOrder + 1,
    };
    customLists.push(newList);
    return Promise.resolve(true);
}

export async function updateCustomList(db: any, updatedList: CustomList) {
    const index = customLists.findIndex(l => l.id === updatedList.id);
    if (index !== -1) {
        customLists[index] = { ...customLists[index], ...updatedList };
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function deleteCustomList(db: any, listId: string) {
    const index = customLists.findIndex(l => l.id === listId);
    if (index !== -1) {
        customLists.splice(index, 1);
        // Also delete associated items
        customListItems = customListItems.filter(item => item.listId !== listId);
        // Re-order remaining lists
        customLists.sort((a, b) => a.order - b.order).forEach((list, i) => list.order = i);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export function moveCustomList(db: any, listId: string, direction: 'up' | 'down') {
    const sortedLists = customLists.sort((a, b) => a.order - b.order);
    const fromIndex = sortedLists.findIndex(l => l.id === listId);

    if (fromIndex === -1) {
        throw new Error("List to move not found");
    }

    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= sortedLists.length) {
        return; // Cannot move
    }
    
    // Swap order values
    const listToMove = sortedLists[fromIndex];
    const otherList = sortedLists[toIndex];
    
    [listToMove.order, otherList.order] = [otherList.order, listToMove.order];

    return Promise.resolve(true);
}


export async function getAllCustomListItems(db?: any) {
    return Promise.resolve(JSON.parse(JSON.stringify(customListItems)));
}

export async function addCustomListItem(db: any, itemData: Omit<CustomListItem, 'id'>) {
    const newItem: CustomListItem = { id: `item-${Date.now()}`, ...itemData };
    customListItems.push(newItem);
    return Promise.resolve(true);
}

export async function updateCustomListItem(db: any, updatedItem: CustomListItem) {
    const index = customListItems.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
        customListItems[index] = { ...customListItems[index], ...updatedItem };
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}

export async function deleteCustomListItem(db: any, itemId: string) {
    const index = customListItems.findIndex(i => i.id === itemId);
    if (index !== -1) {
        customListItems.splice(index, 1);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
