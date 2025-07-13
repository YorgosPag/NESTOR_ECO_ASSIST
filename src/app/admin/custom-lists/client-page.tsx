// src/app/admin/custom-lists/client-page.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import type { CustomList, CustomListItem } from "@/types";
import { ListCard } from "./list-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListChecks } from "lucide-react";
import { CreateListDialog } from "./create-list-dialog";

interface CustomListsManagerProps {
    lists: CustomList[];
    items: CustomListItem[];
}

export function CustomListsManager({ lists, items }: CustomListsManagerProps) {

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                        <ListChecks className="h-6 w-6" />
                        Διαχείριση Λιστών Επιλογών
                    </h1>
                    <p className="text-muted-foreground">Διαχειριστείτε τις τιμές που εμφανίζονται στα dropdowns της εφαρμογής.</p>
                </div>
                 <CreateListDialog>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Νέα Λίστα
                    </Button>
                </CreateListDialog>
            </div>
            {lists.length > 0 ? (
                <Accordion type="multiple" className="w-full space-y-4">
                    {lists.map((list, index) => {
                        const listItems = items.filter(item => item.listId === list.id);
                        return (
                            <ListCard 
                                key={list.id} 
                                list={list} 
                                items={listItems} 
                                canMoveUp={index > 0}
                                canMoveDown={index < lists.length - 1}
                            />
                        );
                    })}
                </Accordion>
            ) : (
                <div className="text-center text-muted-foreground py-12 border border-dashed rounded-lg">
                    Δεν υπάρχουν προσαρμοσμένες λίστες.
                </div>
            )}
        </div>
    );
}
