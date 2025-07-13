"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProjectAction } from '@/app/actions/projects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Contact } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Δημιουργία Έργου"}
    </Button>
  );
}

interface CreateProjectFormProps {
    contacts: Contact[];
}

export function CreateProjectForm({ contacts }: CreateProjectFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(createProjectAction, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success === true) {
            toast({ title: 'Επιτυχία!', description: state.message });
            router.push('/projects');
        } else if (state?.success === false && state.message) {
            toast({
                variant: 'destructive',
                title: 'Σφάλμα',
                description: state.message,
            });
        }
    }, [state, toast, router]);

    return (
        <form action={formAction} className="space-y-4 pt-4">
             <div className="space-y-2">
                <Label htmlFor="title">Όνομα Έργου</Label>
                <Input id="title" name="title" placeholder="π.χ., Αναδάσωση Αμαζονίου" required />
                {state.errors?.title && <p className="text-sm font-medium text-destructive mt-1">{state.errors.title[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Περιγραφή</Label>
                <Textarea id="description" name="description" placeholder="Μια σύντομη περιγραφή των στόχων και του αντικειμένου του έργου." required />
                {state.errors?.description && <p className="text-sm font-medium text-destructive mt-1">{state.errors.description[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="applicationNumber">Αριθμός Αίτησης (Προαιρετικό)</Label>
                <Input id="applicationNumber" name="applicationNumber" placeholder="π.χ., APP-2024-001" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="ownerContactId">Ιδιοκτήτης / Δικαιούχος</Label>
                <Select name="ownerContactId" defaultValue="">
                    <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε ιδιοκτήτη" />
                    </SelectTrigger>
                    <SelectContent>
                        {contacts.filter(c => c.role === 'Πελάτης').map(contact => (
                            <SelectItem key={contact.id} value={contact.id}>
                                {contact.firstName} {contact.lastName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {state.errors?.ownerContactId && <p className="text-sm font-medium text-destructive mt-1">{state.errors.ownerContactId[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="deadline">Προθεσμία Έργου (Προαιρετικό)</Label>
                <Input id="deadline" name="deadline" type="date" />
            </div>
            <SubmitButton />
        </form>
    );
}
