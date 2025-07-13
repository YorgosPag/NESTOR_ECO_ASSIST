"use client";

import type { CustomList, CustomListItem } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { CreateItemDialog } from "./custom-lists/create-item-dialog";

interface CustomListsManagerProps {
    customLists: CustomList[];
    allItems: CustomListItem[];
}

export function CustomListsManager({ customLists, allItems }: CustomListsManagerProps) {

    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Διαχείριση Λιστών</CardTitle>
                        <CardDescription>
                            Επεξεργαστείτε τις τιμές για τις δυναμικές λίστες της εφαρμογής.
                        </CardDescription>
                    </div>
                    <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Νέα Λίστα
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                 <Accordion type="multiple" className="w-full space-y-4">
                    {customLists.map(list => {
                        const items = allItems.filter(item => item.listId === list.id);
                        return (
                            <AccordionItem value={list.id} key={list.id} className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-6 py-4 bg-muted/50 hover:no-underline">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <List className="h-5 w-5 text-muted-foreground" />
                                            <span className="font-semibold text-lg">{list.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 pr-4">
                                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-6">
                                    <div className="flex justify-end mb-4">
                                        <Button variant="outline" size="sm">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Προσθήκη Στοιχείου
                                        </Button>
                                    </div>
                                    <ul className="space-y-2">
                                        {items.map(item => (
                                            <li key={item.id} className="flex items-center justify-between rounded-md border p-3">
                                                <span>{item.name}</span>
                                                 <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </li>
                                        ))}
                                        {items.length === 0 && <p className="text-muted-foreground text-center text-sm py-4">Αυτή η λίστα είναι κενή.</p>}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </CardContent>
        </Card>
    );
}
