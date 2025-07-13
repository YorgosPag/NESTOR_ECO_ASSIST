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
import { deleteStageAction } from '@/app/actions/projects';
import type { Stage } from '@/types';

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

interface DeleteStageDialogProps {
  stage: Stage;
  projectId: string;
  children: React.ReactNode;
}

export function DeleteStageDialog({ stage, projectId, children }: DeleteStageDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteStageAction, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'Επιτυχία!', description: state.message });
      } else {
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: state.message,
        });
      }
      setOpen(false);
    }
  }, [state, toast, setOpen]);
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Επιβεβαίωση Διαγραφής Σταδίου</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε βέβαιος ότι θέλετε να διαγράψετε το στάδιο ‘{stage.title}’; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction}>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="stageId" value={stage.id} />
            <AlertDialogFooter>
                <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                <SubmitButton />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
