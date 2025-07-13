"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateStageAction } from '@/app/actions/stages';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Contact, Stage } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Αποθήκευση Αλλαγών"}
    </Button>
  );
}

interface EditStageFormProps {
    stage: Stage;
    projectId: string;
    contacts: Contact[];
    setOpen: (open: boolean) => void;
}

export function EditStageForm({ stage, projectId, contacts, setOpen }: EditStageFormProps) {
    const [state, formAction] = useActionState(updateStageAction, initialState);
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

    const formattedDeadline = stage.deadline ? new Date(stage.deadline).toISOString().substring(0, 10) : '';

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="stageId" value={stage.id} />

            <div className="space-y-2">
                <Label htmlFor="title">Τίτλος Σταδίου</Label>
                <Input id="title" name="title" defaultValue={stage.title} required />
                {state.errors?.title && <p className="text-sm font-medium text-destructive mt-1">{state.errors.title[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="assigneeContactId">Υπεύθυνος (Προαιρετικό)</Label>
                <Select name="assigneeContactId" defaultValue={stage.assigneeContactId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε υπεύθυνο" />
                    </SelectTrigger>
                    <SelectContent>
                        {contacts.map(contact => (
                            <SelectItem key={contact.id} value={contact.id}>
                                {contact.firstName} {contact.lastName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="deadline">Προθεσμία</Label>
                <Input id="deadline" name="deadline" type="date" defaultValue={formattedDeadline} required />
                {state.errors?.deadline && <p className="text-sm font-medium text-destructive mt-1">{state.errors.deadline[0]}</p>}
            </div>

            <SubmitButton />
        </form>
    );
}
