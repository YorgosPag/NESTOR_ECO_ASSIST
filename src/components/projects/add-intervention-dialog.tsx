"use client";

import { useState } from 'react';
import type { Project, Contact, CustomList, CustomListItem, MasterIntervention } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddInterventionForm } from './add-intervention-form';

interface AddInterventionDialogProps {
    projectId: string;
    children: React.ReactNode;
    customLists: CustomList[];
    customListItems: CustomListItem[];
    masterInterventions: MasterIntervention[];
}

export function AddInterventionDialog({ projectId, children, customLists, customListItems, masterInterventions }: AddInterventionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Προσθήκη Νέας Παρέμβασης</DialogTitle>
          <DialogDescription>Επιλέξτε τον τύπο της παρέμβασης που θέλετε να προσθέσετε στο έργο.</DialogDescription>
        </DialogHeader>
        <AddInterventionForm 
            projectId={projectId} 
            setOpen={setOpen} 
            customLists={customLists}
            customListItems={customListItems}
        />
      </DialogContent>
    </Dialog>
  );
}
