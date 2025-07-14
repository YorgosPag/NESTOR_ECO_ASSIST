// src/components/projects/edit-sub-intervention-dialog.tsx
"use client";

import { useState } from 'react';
import type { Project, ProjectIntervention, SubIntervention, CustomList, CustomListItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditSubInterventionForm } from './edit-sub-intervention-form';
import { ScrollArea } from '../ui/scroll-area';

interface EditSubInterventionDialogProps {
  project: Project;
  intervention: ProjectIntervention;
  subIntervention: SubIntervention;
  customLists: CustomList[];
  customListItems: CustomListItem[];
  children: React.ReactNode;
}

export function EditSubInterventionDialog({ project, intervention, subIntervention, customLists, customListItems, children }: EditSubInterventionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Επεξεργασία Υπο-Παρέμβασης</DialogTitle>
          <DialogDescription>
            Για την παρέμβαση: <strong>{intervention.interventionSubcategory}</strong>. Ενημερώστε τα στοιχεία παρακάτω.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
            <EditSubInterventionForm 
                project={project} 
                intervention={intervention}
                subIntervention={subIntervention}
                setOpen={setOpen} 
                customLists={customLists} 
                customListItems={customListItems} 
            />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}