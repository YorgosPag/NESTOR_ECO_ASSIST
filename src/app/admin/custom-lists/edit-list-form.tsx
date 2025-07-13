// src/app/admin/custom-lists/edit-list-form.tsx
"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateListAction } from '@/app/actions/custom-lists';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { CustomList } from '@/types';

const initialState = { success: false, errors: {}, message: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Αποθήκευση Αλλαγών"}
    </Button>
  );
}

interface EditListFormProps {
    list: CustomList;
    setOpen: (open: boolean) => void;
}

export function EditListForm({ list, setOpen }: EditListFormProps) {
    const [state, formAction] = useActionState(updateListAction, initialState);
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
            <input type="hidden" name="id" value={list.id} />
            <div className="space-y-2">
                <Label htmlFor="name">Όνομα Λίστας</Label>
                <Input id="name" name="name" defaultValue={list.name} required />
                {state.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="key">Μοναδικό Κλειδί (Key)</Label>
                <Input id="key" name="key" defaultValue={list.key || ''} />
                {state.errors?.key && <p className="text-sm font-medium text-destructive mt-1">{state.errors.key[0]}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}
