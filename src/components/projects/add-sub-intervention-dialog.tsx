// src/components/projects/add-sub-intervention-dialog.tsx
"use client";

import { useState } from 'react';
import type { Project, ProjectIntervention, CustomList, CustomListItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddSubInterventionForm } from './add-sub-intervention-form';
import { ScrollArea } from '../ui/scroll-area';

interface AddSubInterventionDialogProps {
  project: Project;
  intervention: ProjectIntervention;
  customLists: CustomList[];
  customListItems: CustomListItem[];
  children: React.ReactNode;
}

export function AddSubInterventionDialog({ project, intervention, customLists, customListItems, children }: AddSubInterventionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Προσθήκη Νέας Υπο-Παρέμβασης</DialogTitle>
          <DialogDescription>
            Για την παρέμβαση: <strong>{intervention.interventionSubcategory}</strong>. Συμπληρώστε τα στοιχεία παρακάτω.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
            <AddSubInterventionForm 
                project={project} 
                intervention={intervention} 
                setOpen={setOpen} 
                customLists={customLists} 
                customListItems={customListItems} 
            />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}