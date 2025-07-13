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
import { AddInterventionForm } from './add-intervention-form';

interface AddInterventionDialogProps {
    projectId: string;
    children: React.ReactNode;
}

export function AddInterventionDialog({ projectId, children }: AddInterventionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Προσθήκη Νέας Παρέμβασης</DialogTitle>
          <DialogDescription>Εισάγετε ένα όνομα για τη νέα παρέμβαση.</DialogDescription>
        </DialogHeader>
        <AddInterventionForm projectId={projectId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
