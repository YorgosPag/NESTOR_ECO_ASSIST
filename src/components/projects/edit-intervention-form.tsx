// src/components/projects/edit-intervention-form.tsx
"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateInterventionAction } from '@/app/actions/projects';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Project, ProjectIntervention } from '@/types';

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

interface EditInterventionFormProps {
    project: Project;
    intervention: ProjectIntervention;
    setOpen: (open: boolean) => void;
}

export function EditInterventionForm({ project, intervention, setOpen }: EditInterventionFormProps) {
    const [state, formAction] = useActionState(updateInterventionAction, initialState);
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
    
    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="interventionMasterId" value={intervention.masterId} />
            <div className="space-y-2">
                <Label htmlFor="interventionSubcategory">Όνομα Παρέμβασης</Label>
                <Input id="interventionSubcategory" name="interventionSubcategory" defaultValue={intervention.interventionSubcategory} required />
                {state.errors?.interventionSubcategory && <p className="text-sm font-medium text-destructive mt-1">{state.errors.interventionSubcategory[0]}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}
