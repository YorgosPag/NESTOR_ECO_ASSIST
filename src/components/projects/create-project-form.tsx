"use client";

import { useActionState, useFormStatus } from 'react';
import { createProjectAction } from '@/app/actions/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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

export function CreateProjectForm({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [state, formAction] = useActionState(createProjectAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Επιτυχία!",
        description: state.message,
      });
      router.push('/projects');
    } else if (state.message) {
      toast({
        variant: "destructive",
        title: "Σφάλμα Επικύρωσης",
        description: state.message,
      });
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Τίτλος Έργου</Label>
        <Input id="name" name="name" placeholder="π.χ., Ανακαίνιση κατοικίας Παπαδόπουλου" required aria-describedby="name-error" />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
        </div>
      </div>
       <div className="space-y-2">
          <Label htmlFor="description">Περιγραφή</Label>
          <Textarea id="description" name="description" placeholder="Μια σύντομη περιγραφή των στόχων και του αντικειμένου του έργου." required aria-describedby="description-error" />
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
          </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="applicationNumber">Αριθμός Αίτησης (Προαιρετικό)</Label>
        <Input id="applicationNumber" name="applicationNumber" placeholder="π.χ., ΕΞ-2024-123" aria-describedby="applicationNumber-error" />
        <div id="applicationNumber-error" aria-live="polite" aria-atomic="true">
          {state.errors?.applicationNumber && <p className="text-sm font-medium text-destructive">{state.errors.applicationNumber[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ownerContactId">Ιδιοκτήτης / Ωφελούμενος</Label>
        <Select name="ownerContactId" required defaultValue="">
            <SelectTrigger id="ownerContactId" aria-describedby="ownerContactId-error">
                <SelectValue placeholder="Επιλέξτε από τη λίστα επαφών..." />
            </SelectTrigger>
            <SelectContent>
                {contacts.filter(c => c.role === 'Πελάτης').map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <div id="ownerContactId-error" aria-live="polite" aria-atomic="true">
            {state.errors?.ownerContactId && <p className="text-sm font-medium text-destructive">{state.errors.ownerContactId[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="deadline">Προθεσμία Ολοκλήρωσης Έργου (Προαιρετικό)</Label>
        <Input id="deadline" name="deadline" type="date" aria-describedby="deadline-error" />
         <div id="deadline-error" aria-live="polite" aria-atomic="true">
          {state.errors?.deadline && <p className="text-sm font-medium text-destructive">{state.errors.deadline[0]}</p>}
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
