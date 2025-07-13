"use client";

import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project, ProjectIntervention } from '@/types';
import { EditInterventionForm } from './edit-intervention-form';


interface EditInterventionDialogProps {
  project: Project;
  intervention: ProjectIntervention;
  children: React.ReactNode;
}

export function EditInterventionDialog({ project, intervention, children }: EditInterventionDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Επεξεργασία Παρέμβασης</DialogTitle>
                    <DialogDescription>
                        Ενημερώστε το όνομα της παρέμβασης.
                    </DialogDescription>
                </DialogHeader>
                <EditInterventionForm
                    project={project}
                    intervention={intervention}
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>
    );
}
