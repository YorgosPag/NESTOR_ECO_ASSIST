// src/app/admin/custom-lists/create-item-dialog.tsx
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateItemForm } from './create-item-form';

interface CreateItemDialogProps {
    listId: string;
    children: React.ReactNode;
}

export function CreateItemDialog({ listId, children }: CreateItemDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Προσθήκη Νέου Στοιχείου</DialogTitle>
          <DialogDescription>
            Συμπληρώστε το όνομα του νέου στοιχείου.
          </DialogDescription>
        </DialogHeader>
        <CreateItemForm listId={listId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
