import type { CustomList, CustomListItem } from "@/types";

const customLists: CustomList[] = [
    { id: 'list-1', name: 'Τίτλοι Παρεμβάσεων' },
];
const customListItems: CustomListItem[] = [
    { id: 'item-1', listId: 'list-1', value: 'Environmental Impact Assessment' },
    { id: 'item-2', listId: 'list-1', value: 'Site Survey' },
    { id: 'item-3', listId: 'list-1', value: 'Community Consultation' },
    { id: 'item-4', listId: 'list-1', value: 'Water Quality Testing' },
    { id: 'item-5', listId: 'list-1', value: 'Soil Analysis' },
    { id: 'item-6', listId: 'list-1', value: 'Air Quality Monitoring' },
];

export async function getCustomLists(db?: any) {
    return Promise.resolve(customLists);
}

export async function getAllCustomListItems(db?: any) {
    return Promise.resolve(customListItems);
}
