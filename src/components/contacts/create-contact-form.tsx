"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createContactAction } from '@/app/actions/contacts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import type { CustomList, CustomListItem } from '@/types';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Δημιουργία Επαφής'}
    </Button>
  );
}

interface CreateContactFormProps {
    setOpen: (open: boolean) => void;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function CreateContactForm({ setOpen, customLists, customListItems }: CreateContactFormProps) {
    const [state, formAction] = useActionState(createContactAction, initialState);
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

    // Fallback roles in case custom list is not available
    const fallbackRoles = ['Πελάτης', 'Ομάδα', 'Ενδιαφερόμενος', 'Διαχειριστής'];
    const rolesList = customLists.find(l => l.name === 'Contact Roles');
    let roles = rolesList 
        ? customListItems.filter(item => item.listId === rolesList.id).map(item => item.name)
        : fallbackRoles;
    if (roles.length === 0) {
        roles = fallbackRoles;
    }

    return (
        <form action={formAction} className="space-y-4 pt-4 pr-1">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Όνομα</Label>
                    <Input id="firstName" name="firstName" required />
                    {state.errors?.firstName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.firstName[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Επώνυμο</Label>
                    <Input id="lastName" name="lastName" required />
                    {state.errors?.lastName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.lastName[0]}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
                {state.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{state.errors.email[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="mobilePhone">Κινητό Τηλέφωνο</Label>
                    <Input id="mobilePhone" name="mobilePhone" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="landlinePhone">Σταθερό Τηλέφωνο</Label>
                    <Input id="landlinePhone" name="landlinePhone" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="company">Εταιρεία</Label>
                <Input id="company" name="company" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="role">Ρόλος</Label>
                    <Select name="role" defaultValue="">
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
                 <div className="space-y-2">
                    <Label htmlFor="specialty">Ειδικότητα</Label>
                    <Input id="specialty" name="specialty" />
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="addressStreet">Διεύθυνση (Οδός)</Label>
                <Input id="addressStreet" name="addressStreet" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="addressNumber">Αριθμός</Label>
                    <Input id="addressNumber" name="addressNumber" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="addressPostalCode">Τ.Κ.</Label>
                    <Input id="addressPostalCode" name="addressPostalCode" />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="addressCity">Πόλη</Label>
                    <Input id="addressCity" name="addressCity" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="addressPrefecture">Νομός</Label>
                    <Input id="addressPrefecture" name="addressPrefecture" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Σημειώσεις</Label>
                <Textarea id="notes" name="notes" rows={3}/>
            </div>

            <SubmitButton />
        </form>
    );
}
