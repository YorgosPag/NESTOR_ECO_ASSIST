import type { CustomList, CustomListItem } from "@/types";

const customLists: CustomList[] = [];
const customListItems: CustomListItem[] = [];

export async function getCustomLists(db?: any) {
    return Promise.resolve(customLists);
}

export async function getAllCustomListItems(db?: any) {
    return Promise.resolve(customListItems);
}
