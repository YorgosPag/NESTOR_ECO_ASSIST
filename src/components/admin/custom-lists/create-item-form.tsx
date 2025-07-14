// src/components/admin/custom-lists/create-item-form.tsx
"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCustomListItemAction } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const initialState = { success: false, errors: {}, message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Προσθήκη Στοιχείου"}
    </Button>
  );
}

interface CreateItemFormProps {
    listId: string;
    setOpen: (open: boolean) => void;
}

export function CreateItemForm({ listId, setOpen }: CreateItemFormProps) {
    const [state, formAction] = useActionState(createCustomListItemAction, initialState);
    const { toast } = useToast();
    
    useEffect(() => {
        if (state.success) {
            toast({ title: 'Επιτυχία!', description: state.message });
            setOpen(false);
        } else if (state.message) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: state.message });
        }
    }, [state, toast, setOpen]);

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="listId" value={listId} />
            <div className="space-y-2">
                <Label htmlFor="name">Ονόματα Στοιχείων</Label>
                <Textarea id="name" name="name" placeholder="π.χ., Μελέτη;Τοπογραφικό;Ανάλυση" required />
                <p className="text-xs text-muted-foreground">Μπορείτε να προσθέσετε πολλαπλά στοιχεία χωρίζοντάς τα με το σύμβολο του ερωτηματικού (;).</p>
                {state.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}
