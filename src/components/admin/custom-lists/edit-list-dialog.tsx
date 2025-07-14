// src/components/admin/custom-lists/edit-list-dialog.tsx
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
import type { CustomList } from '@/types';
import { EditListForm } from './edit-list-form';

interface EditListDialogProps {
    list: CustomList;
    children: React.ReactNode;
}

export function EditListDialog({ list, children }: EditListDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Επεξεργασία Λίστας</DialogTitle>
          <DialogDescription>Ενημερώστε τα στοιχεία της λίστας.</DialogDescription>
        </DialogHeader>
        <EditListForm list={list} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
