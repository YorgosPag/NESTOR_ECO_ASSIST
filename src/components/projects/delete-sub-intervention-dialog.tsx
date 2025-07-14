// src/components/projects/delete-sub-intervention-dialog.tsx
"use client";

import { useEffect, useState, useActionState, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { deleteSubInterventionAction } from '@/app/actions/interventions';
import type { Project, ProjectIntervention, SubIntervention } from '@/types';

const initialState = {
  message: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction asChild>
        <Button type="submit" variant="destructive" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Ναι, Διαγραφή"}
        </Button>
    </AlertDialogAction>
  );
}

interface DeleteSubInterventionDialogProps {
  project: Project;
  intervention: ProjectIntervention;
  subIntervention: SubIntervention;
  children: ReactNode;
}

export function DeleteSubInterventionDialog({ project, intervention, subIntervention, children }: DeleteSubInterventionDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteSubInterventionAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return; 

    if (state.success) {
      toast({ title: 'Επιτυχία!', description: state.message });
      setOpen(false);
    } else if (state.message) {
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: state.message,
      });
      setOpen(false);
    }
  }, [state, toast, open, setOpen]);
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Επιβεβαίωση Διαγραφής Υπο-Παρέμβασης</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε βέβαιος ότι θέλετε να διαγράψετε την υπο-παρέμβαση ‘{subIntervention.description}’; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction}>
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="interventionMasterId" value={intervention.masterId} />
            <input type="hidden" name="subInterventionId" value={subIntervention.id} />
            <AlertDialogFooter>
                <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                <SubmitButton />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}