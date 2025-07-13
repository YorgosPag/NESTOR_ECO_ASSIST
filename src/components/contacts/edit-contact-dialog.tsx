// src/components/contacts/edit-contact-dialog.tsx
"use client";

import { useState } from 'react';
import type { Contact, CustomList, CustomListItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm } from './contact-form';

interface EditContactDialogProps {
    contact: Contact;
    children: React.ReactNode;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function EditContactDialog({ contact, children, customLists, customListItems }: EditContactDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Επεξεργασία Επαφής</DialogTitle>
          <DialogDescription>
            Ενημερώστε τα στοιχεία της επαφής παρακάτω.
          </DialogDescription>
        </DialogHeader>
        <ContactForm contact={contact} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
