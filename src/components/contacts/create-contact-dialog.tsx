// src/components/contacts/create-contact-dialog.tsx
"use client";

import { useState } from 'react';
import type { CustomList, CustomListItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm } from './contact-form';

interface CreateContactDialogProps {
    children: React.ReactNode;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function CreateContactDialog({ children, customLists, customListItems }: CreateContactDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Δημιουργία Νέας Επαφής</DialogTitle>
          <DialogDescription>
            Συμπληρώστε τα στοιχεία της νέας επαφής παρακάτω.
          </DialogDescription>
        </DialogHeader>
        <ContactForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
