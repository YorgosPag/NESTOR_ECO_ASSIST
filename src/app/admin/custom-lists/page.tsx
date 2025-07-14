import { CustomListsManager } from "./client-page";
import { getCustomLists, getAllCustomListItems } from "@/lib/custom-lists-data";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export default async function CustomListsPage() {
    const db = getAdminDb();
    const [customLists, customListItems] = await Promise.all([
        getCustomLists(db),
        getAllCustomListItems(db)
    ]);

    // Ensure items are sorted alphabetically by name to prevent hydration errors on the client
    const sortedItems = customListItems.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <CustomListsManager
                lists={customLists}
                items={sortedItems}
            />
        </main>
    );
}
