// src/components/admin/create-intervention-dialog.tsx
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
import type { CustomList, CustomListItem } from '@/types';
import { CreateInterventionForm } from './create-intervention-form';

interface CreateInterventionDialogProps {
    children: React.ReactNode;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function CreateInterventionDialog({ children, customLists, customListItems }: CreateInterventionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Δημιουργία Νέας Παρέμβασης</DialogTitle>
          <DialogDescription>Συμπληρώστε τα στοιχεία της νέας master παρέμβασης.</DialogDescription>
        </DialogHeader>
        <CreateInterventionForm setOpen={setOpen} customLists={customLists} customListItems={customListItems} />
      </DialogContent>
    </Dialog>
  );
}
