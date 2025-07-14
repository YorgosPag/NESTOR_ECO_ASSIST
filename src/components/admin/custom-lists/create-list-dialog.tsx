// src/components/admin/custom-lists/create-list-dialog.tsx
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
import { CreateListForm } from './create-list-form';

interface CreateListDialogProps {
    children: React.ReactNode;
}

export function CreateListDialog({ children }: CreateListDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Δημιουργία Νέας Λίστας</DialogTitle>
          <DialogDescription>
            Συμπληρώστε το όνομα της νέας λίστας.
          </DialogDescription>
        </DialogHeader>
        <CreateListForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
