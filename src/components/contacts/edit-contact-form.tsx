"use client";

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateContactAction } from '@/app/actions/contacts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Contact } from '@/types';
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
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Αποθήκευση Αλλαγών'}
    </Button>
  );
}

interface EditContactFormProps {
    contact: Contact;
    setOpen: (open: boolean) => void;
}

export function EditContactForm({ contact, setOpen }: EditContactFormProps) {
    const [state, formAction] = useActionState(updateContactAction, initialState);
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
        <form action={formAction} className="space-y-4 pt-4 pr-1">
            <input type="hidden" name="id" value={contact.id} />
            
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

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="mobilePhone">Κινητό Τηλέφωνο</Label>
                    <Input id="mobilePhone" name="mobilePhone" defaultValue={contact?.mobilePhone} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="landlinePhone">Σταθερό Τηλέφωνο</Label>
                    <Input id="landlinePhone" name="landlinePhone" defaultValue={contact?.landlinePhone} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="company">Εταιρεία</Label>
                <Input id="company" name="company" defaultValue={contact?.company} />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                 <div className="space-y-2">
                    <Label htmlFor="specialty">Ειδικότητα</Label>
                    <Input id="specialty" name="specialty" defaultValue={contact?.specialty} />
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="addressStreet">Διεύθυνση (Οδός)</Label>
                <Input id="addressStreet" name="addressStreet" defaultValue={contact?.addressStreet} />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="addressNumber">Αριθμός</Label>
                    <Input id="addressNumber" name="addressNumber" defaultValue={contact?.addressNumber} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="addressPostalCode">Τ.Κ.</Label>
                    <Input id="addressPostalCode" name="addressPostalCode" defaultValue={contact?.addressPostalCode} />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="addressCity">Πόλη</Label>
                    <Input id="addressCity" name="addressCity" defaultValue={contact?.addressCity} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="addressPrefecture">Νομός</Label>
                    <Input id="addressPrefecture" name="addressPrefecture" defaultValue={contact?.addressPrefecture} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Σημειώσεις</Label>
                <Textarea id="notes" name="notes" defaultValue={contact?.notes || ''} rows={3}/>
            </div>

            <SubmitButton />
        </form>
    );
}
