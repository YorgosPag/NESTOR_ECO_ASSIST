// src/components/projects/edit-sub-intervention-form.tsx
"use client";

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Project, ProjectIntervention, SubIntervention, CustomList, CustomListItem } from "@/types";
import { updateSubInterventionAction } from '@/app/actions/interventions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { SearchableSelect } from '../ui/searchable-select';

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

interface EditSubInterventionFormProps {
    project: Project;
    intervention: ProjectIntervention;
    subIntervention: SubIntervention;
    setOpen: (open: boolean) => void;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function EditSubInterventionForm({ project, intervention, subIntervention, setOpen, customLists, customListItems }: EditSubInterventionFormProps) {
    const [state, formAction] = useActionState(updateSubInterventionAction, initialState);
    const { toast } = useToast();
    const [unit, setUnit] = useState(subIntervention.quantityUnit || '');

    useEffect(() => {
        if (state?.success) {
            toast({ title: 'Επιτυχία!', description: state.message });
            setOpen(false);
        } else if (state?.success === false && state.message) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: state.message });
        }
    }, [state, toast, setOpen]);

    const unitsList = customLists.find(l => l.key === 'UNIT_OF_MEASUREMENT');
    const unitOptions = unitsList ? customListItems.filter(item => item.listId === unitsList.id).map(item => ({ value: item.name, label: item.name })) : [];

    return (
        <form action={formAction} className="space-y-4 pt-4 pr-6">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="interventionMasterId" value={intervention.masterId} />
            <input type="hidden" name="subInterventionId" value={subIntervention.id} />
            <input type="hidden" name="quantityUnit" value={unit} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="subcategoryCode">Κωδικός</Label>
                    <Input id="subcategoryCode" name="subcategoryCode" defaultValue={subIntervention.subcategoryCode} required />
                    {state.errors?.subcategoryCode && <p className="text-sm font-medium text-destructive mt-1">{state.errors.subcategoryCode[0]}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cost">Συνολικό Κόστος</Label>
                    <Input id="cost" name="cost" type="number" step="0.01" defaultValue={subIntervention.cost} required />
                    {state.errors?.cost && <p className="text-sm font-medium text-destructive mt-1">{state.errors.cost[0]}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Περιγραφή</Label>
                <Textarea id="description" name="description" defaultValue={subIntervention.description} required />
                {state.errors?.description && <p className="text-sm font-medium text-destructive mt-1">{state.errors.description[0]}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity">Ποσότητα</Label>
                    <Input id="quantity" name="quantity" type="number" step="any" defaultValue={subIntervention.quantity} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantityUnit-select">Μον. Μέτρησης</Label>
                     <SearchableSelect
                        value={unit}
                        onValueChange={setUnit}
                        options={unitOptions}
                        placeholder="Επιλέξτε μονάδα..."
                        searchPlaceholder="Αναζήτηση..."
                        emptyMessage="Δεν βρέθηκε."
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="costOfMaterials">Κόστος Υλικών</Label>
                    <Input id="costOfMaterials" name="costOfMaterials" type="number" step="0.01" defaultValue={subIntervention.costOfMaterials} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="costOfLabor">Κόστος Εργασίας</Label>
                    <Input id="costOfLabor" name="costOfLabor" type="number" step="0.01" defaultValue={subIntervention.costOfLabor} />
                </div>
            </div>
            
            <div className="pt-2">
                <SubmitButton />
            </div>
        </form>
    );
}