// src/components/admin/custom-lists/edit-item-dialog.tsx
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
import type { CustomListItem } from '@/types';
import { EditItemForm } from './edit-item-form';

interface EditItemDialogProps {
    item: CustomListItem;
    children: React.ReactNode;
}

export function EditItemDialog({ item, children }: EditItemDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Επεξεργασία Στοιχείου</DialogTitle>
          <DialogDescription>Ενημερώστε το όνομα του στοιχείου.</DialogDescription>
        </DialogHeader>
        <EditItemForm item={item} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
