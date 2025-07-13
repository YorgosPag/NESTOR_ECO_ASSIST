// src/app/admin/custom-lists/list-card.tsx
"use client";

import { useTransition } from 'react';
import type { CustomList, CustomListItem } from "@/types";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, Trash2, Pencil, List, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateItemDialog } from "./create-item-dialog";
import { EditListDialog } from "./edit-list-dialog";
import { DeleteListDialog } from "./delete-list-dialog";
import { EditItemDialog } from "./edit-item-dialog";
import { DeleteItemDialog } from "./delete-item-dialog";
import { moveCustomListAction } from "@/app/actions/admin";

interface ListCardProps {
    list: CustomList;
    items: CustomListItem[];
    canMoveUp: boolean;
    canMoveDown: boolean;
}

const MoveButton = ({ direction, disabled, onClick }: { direction: 'up' | 'down', disabled: boolean, onClick: () => void }) => {
    const [isPending, startTransition] = useTransition();

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 cursor-pointer" 
            disabled={disabled || isPending}
            onClick={() => startTransition(onClick)}
        >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                direction === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
            )}
        </Button>
    )
}

export function ListCard({ list, items, canMoveUp, canMoveDown }: ListCardProps) {
    const handleMove = (direction: 'up' | 'down') => {
        const formData = new FormData();
        formData.append('id', list.id);
        formData.append('direction', direction);
        moveCustomListAction(formData);
    }
    
    return (
        <AccordionItem value={list.id} className="border-none">
            <Card className="overflow-hidden">
                <AccordionTrigger className="p-4 bg-muted/50 hover:bg-muted transition-colors hover:no-underline [&[data-state=open]>svg:not(.lucide-grip-vertical)]:rotate-180">
                   <div className="flex items-center gap-4 flex-1">
                     <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <MoveButton direction="up" disabled={!canMoveUp} onClick={() => handleMove('up')} />
                        <MoveButton direction="down" disabled={!canMoveDown} onClick={() => handleMove('down')} />
                     </div>
                     <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold">{list.name}</h3>
                        <p className="text-sm text-muted-foreground">({items.length} στοιχεία)</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 pr-2" onClick={(e) => e.stopPropagation()}>
                       <EditListDialog list={list}>
                          <div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 cursor-pointer")}>
                            <Pencil className="h-4 w-4" />
                          </div>
                       </EditListDialog>
                       <DeleteListDialog list={list}>
                         <div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 text-destructive hover:text-destructive cursor-pointer")}>
                            <Trash2 className="h-4 w-4" />
                         </div>
                       </DeleteListDialog>
                   </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 pb-6 space-y-4">
                      {items.length > 0 ? (
                        <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Όνομα Στοιχείου</TableHead>
                                {list.key && <TableHead>Κλειδί (key)</TableHead>}
                                <TableHead className="text-right">Ενέργειες</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        {list.key && <TableCell><Badge variant="outline">{item.key}</Badge></TableCell>}
                                        <TableCell className="text-right">
                                            <EditItemDialog item={item}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </EditItemDialog>
                                            <DeleteItemDialog item={item}>
                                                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </DeleteItemDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                           <List className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2"/>
                           Αυτή η λίστα είναι κενή.
                        </div>
                      )}
                      <CreateItemDialog listId={list.id}>
                        <Button variant="outline" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Προσθήκη Στοιχείου
                        </Button>
                      </CreateItemDialog>
                  </div>
                </AccordionContent>
            </Card>
        </AccordionItem>
    );
}
