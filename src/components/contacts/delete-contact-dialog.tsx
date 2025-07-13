// src/components/contacts/delete-contact-dialog.tsx
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
import { deleteContactAction } from '@/app/actions/contacts';
import type { Contact } from '@/types';

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

interface DeleteContactDialogProps {
  contact: Contact;
  children: React.ReactNode;
}

export function DeleteContactDialog({ contact, children }: DeleteContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteContactAction, initialState);
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
      <AlertDialogTrigger asChild>
        <div onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
          <AlertDialogDescription>
            Είστε βέβαιος ότι θέλετε να διαγράψετε την επαφή '{contact.firstName} {contact.lastName}'; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={formAction} key={contact.id}>
            <input type="hidden" name="id" value={contact.id} />
            <AlertDialogFooter>
                <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                <SubmitButton />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
