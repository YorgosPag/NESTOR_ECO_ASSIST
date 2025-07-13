"use client";

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addInterventionAction, type AddInterventionState } from '@/app/actions/interventions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { SearchableSelect } from '../ui/searchable-select';
import type { CustomList, CustomListItem } from '@/types';
import { Separator } from '../ui/separator';

const initialState: AddInterventionState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-4">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Προσθήκη Παρέμβασης"}
    </Button>
  );
}

interface AddInterventionFormProps {
    projectId: string;
    setOpen: (open: boolean) => void;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function AddInterventionForm({ projectId, setOpen, customLists, customListItems }: AddInterventionFormProps) {
  const [state, formAction] = useActionState(addInterventionAction, initialState);
  const { toast } = useToast();
  const [interventionName, setInterventionName] = useState('');

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
  
  const interventionTitlesList = customLists.find(l => l.name?.toLowerCase() === 'τίτλοι παρεμβάσεων'.toLowerCase());
  const interventionTitleOptions = interventionTitlesList ? customListItems.filter(item => item.listId === interventionTitlesList.id).map(item => ({ value: item.value, label: item.value })).sort((a, b) => a.label.localeCompare(b.label)) : [];

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <input type="hidden" name="projectId" value={projectId} />
      
      <div className="space-y-2">
          <Label htmlFor="interventionName-select">Τίτλος Παρέμβασης</Label>
          <SearchableSelect
            value={interventionName}
            onValueChange={(value) => setInterventionName(value)}
            options={interventionTitleOptions}
            placeholder="Επιλέξτε τίτλο..."
            searchPlaceholder="Αναζήτηση τίτλου..."
            emptyMessage='Η λίστα "τίτλοι παρεμβάσεων" είναι κενή.'
          />
          <input type="hidden" name="interventionName" value={interventionName} />
          {state.errors?.interventionName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.interventionName[0]}</p>}
      </div>
      
      <SubmitButton />
    </form>
  );
}
