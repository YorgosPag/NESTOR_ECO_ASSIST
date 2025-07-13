import type { CustomList, CustomListItem } from "@/types";

const customLists: CustomList[] = [
    { id: 'list-1', name: 'Τίτλοι Παρεμβάσεων', key: 'INTERVENTION_TITLES' },
];
const customListItems: CustomListItem[] = [
    { id: 'item-1', listId: 'list-1', name: 'Environmental Impact Assessment' },
    { id: 'item-2', listId: 'list-1', name: 'Site Survey' },
    { id: 'item-3', listId: 'list-1', name: 'Community Consultation' },
    { id: 'item-4', listId: 'list-1', name: 'Water Quality Testing' },
    { id: 'item-5', listId: 'list-1', name: 'Soil Analysis' },
    { id: 'item-6', listId: 'list-1', name: 'Air Quality Monitoring' },
];

export async function getCustomLists(db?: any) {
    return Promise.resolve(customLists);
}

export async function getAllCustomListItems(db?: any) {
    return Promise.resolve(customListItems);
}
