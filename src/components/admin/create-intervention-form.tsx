// src/components/admin/create-intervention-form.tsx
"use client";

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createMasterInterventionAction } from '@/app/actions/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { CustomList, CustomListItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Δημιουργία Παρέμβασης"}
    </Button>
  );
}

interface CreateInterventionFormProps {
    setOpen: (open: boolean) => void;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function CreateInterventionForm({ setOpen, customLists, customListItems }: CreateInterventionFormProps) {
    const [state, formAction] = useActionState(createMasterInterventionAction, initialState);
    const { toast } = useToast();
    
    useEffect(() => {
        if (state?.success === true) {
            toast({ title: 'Επιτυχία!', description: state.message });
            setOpen(false);
        } else if (state?.success === false && state.message) {
            const errorMessages = state.errors ? Object.values(state.errors).flat().join('\n') : '';
            toast({
                variant: 'destructive',
                title: 'Σφάλμα',
                description: `${state.message}\n${errorMessages}`,
            });
        }
    }, [state, toast, setOpen]);

    const interventionCategoriesList = customLists.find(l => l.key === 'INTERVENTION_CATEGORIES');
    const categories = interventionCategoriesList
        ? customListItems.filter(item => item.listId === interventionCategoriesList.id)
        : [];

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label htmlFor="name">Όνομα Παρέμβασης</Label>
                <Input id="name" name="name" placeholder="π.χ., Μελέτη Περιβαλλοντικών Επιπτώσεων" required />
                {state.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Κατηγορία</Label>
                <Select name="category">
                    <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε κατηγορία" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {state.errors?.category && <p className="text-sm font-medium text-destructive mt-1">{state.errors.category[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Περιγραφή (Προαιρετικό)</Label>
                <Textarea id="description" name="description" placeholder="Μια σύντομη περιγραφή της παρέμβασης." />
            </div>
            <SubmitButton />
        </form>
    );
}
