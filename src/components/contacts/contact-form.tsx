// src/components/contacts/contact-form.tsx
"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createContactAction, updateContactAction } from '@/app/actions/contacts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Contact } from '@/types';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? 'Αποθήκευση Αλλαγών' : 'Δημιουργία Επαφής')}
    </Button>
  );
}

interface ContactFormProps {
    contact?: Contact;
    setOpen: (open: boolean) => void;
}

export function ContactForm({ contact, setOpen }: ContactFormProps) {
    const isEditing = !!contact;
    const action = isEditing ? updateContactAction : createContactAction;
    const [state, formAction] = useActionState(action, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.success) {
            toast({ title: 'Επιτυχία!', description: state.message });
            setOpen(false);
        } else if (state.message) {
            toast({
                variant: 'destructive',
                title: 'Σφάλμα',
                description: state.message,
            });
        }
    }, [state, toast, setOpen]);

    const roles = ['Πελάτης', 'Ομάδα', 'Ενδιαφερόμενος', 'Διαχειριστής'];

    return (
        <form action={formAction} className="space-y-4 pt-4">
            {isEditing && <input type="hidden" name="id" value={contact.id} />}
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Όνομα</Label>
                    <Input id="firstName" name="firstName" defaultValue={contact?.firstName} required />
                    {state.errors?.firstName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.firstName[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Επώνυμο</Label>
                    <Input id="lastName" name="lastName" defaultValue={contact?.lastName} required />
                    {state.errors?.lastName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.lastName[0]}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={contact?.email} required />
                {state.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Ρόλος</Label>
                <Select name="role" defaultValue={contact?.role}>
                    <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε ρόλο..." />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {state.errors?.role && <p className="text-sm font-medium text-destructive mt-1">{state.errors.role[0]}</p>}
            </div>

            <SubmitButton isEditing={isEditing} />
        </form>
    );
}
