"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addInterventionAction, type AddInterventionState } from '@/app/actions/interventions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { MasterIntervention } from '@/types';

const initialState: AddInterventionState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Προσθήκη Παρέμβασης"}
    </Button>
  );
}

interface AddInterventionFormProps {
    projectId: string;
    masterInterventions: MasterIntervention[];
    setOpen: (open: boolean) => void;
}

export function AddInterventionForm({ projectId, masterInterventions, setOpen }: AddInterventionFormProps) {
    const [state, formAction] = useActionState(addInterventionAction, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success === true) {
            toast({ title: 'Επιτυχία!', description: state.message });
            setOpen(false);
        } else if (state?.success === false && state.message) {
            toast({
                variant: 'destructive',
                title: 'Σφάλμα',
                description: state.message,
            });
        }
    }, [state, toast, setOpen]);

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="projectId" value={projectId} />
            <div className="space-y-2">
                <Label htmlFor="masterInterventionId">Τύπος Παρέμβασης</Label>
                <Select name="masterInterventionId">
                    <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε έναν τύπο παρέμβασης" />
                    </SelectTrigger>
                    <SelectContent>
                        {masterInterventions.map(intervention => (
                            <SelectItem key={intervention.id} value={intervention.id}>
                                {intervention.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {state.errors?.masterInterventionId && <p className="text-sm font-medium text-destructive mt-1">{state.errors.masterInterventionId[0]}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}
