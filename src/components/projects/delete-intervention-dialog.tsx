"use client";

import { useEffect, useState, useActionState } from 'react';
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
import { deleteInterventionAction } from '@/app/actions/projects';
import type { Project, ProjectIntervention } from '@/types';

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

interface DeleteInterventionDialogProps {
  project: Project;
  intervention: ProjectIntervention;
  children: React.ReactNode;
}

export function DeleteInterventionDialog({ project, intervention, children }: DeleteInterventionDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteInterventionAction, initialState);
  const { toast } = useToast();
  
  const interventionName = intervention.interventionSubcategory || intervention.interventionCategory || intervention.name || 'Unnamed Intervention';


  useEffect(() => {
    if (!open) return; 

    if (state?.success === true) {
      toast({ title: 'Επιτυχία!', description: state.message });
      setOpen(false);
    } else if (state?.success === false && state.message) {
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
      <AlertDialogTrigger asChild>
        <div onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε βέβαιος ότι θέλετε να διαγράψετε την παρέμβαση ‘{interventionName}’; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction}>
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="interventionId" value={intervention.id} />
            <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Άκυρο</AlertDialogCancel>
                <SubmitButton />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
