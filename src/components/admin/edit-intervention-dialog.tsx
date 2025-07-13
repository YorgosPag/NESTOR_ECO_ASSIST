// src/components/admin/edit-intervention-dialog.tsx
"use client";

import { useState } from 'react';
import type { MasterIntervention, CustomList, CustomListItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditInterventionForm } from './edit-intervention-form';

interface EditInterventionDialogProps {
    intervention: MasterIntervention;
    children: React.ReactNode;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function EditInterventionDialog({ intervention, children, customLists, customListItems }: EditInterventionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Επεξεργασία Παρέμβασης</DialogTitle>
          <DialogDescription>Ενημερώστε τα στοιχεία της master παρέμβασης.</DialogDescription>
        </DialogHeader>
        <EditInterventionForm intervention={intervention} setOpen={setOpen} customLists={customLists} customListItems={customListItems} />
      </DialogContent>
    </Dialog>
  );
}
