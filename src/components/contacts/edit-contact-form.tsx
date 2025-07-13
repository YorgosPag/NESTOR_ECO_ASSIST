"use client";

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Contact, CustomList, CustomListItem } from '@/types';
import { updateContactAction } from '@/app/actions/contacts';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle } from 'lucide-react';
import { SearchableSelect } from '../ui/searchable-select';
import { Separator } from '../ui/separator';
import { CreateItemDialog } from '../admin/custom-lists/create-item-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Textarea } from '../ui/textarea';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

const DialogChild = ({listId, text}: {listId: string, text: string}) => (
    <>
        <Separator className="my-1"/>
        <CreateItemDialog listId={listId}>
            <div onMouseDown={(e) => e.preventDefault()} className="flex cursor-pointer select-none items-center gap-2 rounded-sm p-2 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <PlusCircle className="h-4 w-4 mr-2" />
                <span>{text}</span>
            </div>
        </CreateItemDialog>
    </>
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Αποθήκευση Αλλαγών"}
    </Button>
  );
}

interface EditContactFormProps {
    contact: Contact;
    setOpen: (open: boolean) => void;
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function EditContactForm({ contact, setOpen, customLists, customListItems }: EditContactFormProps) {
    const [state, formAction] = useActionState(updateContactAction, initialState);
    const { toast } = useToast();
    const [role, setRole] = useState(contact.role);
    
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
    
    const contactRolesList = customLists.find(l => l.key === 'CONTACT_ROLES' || l.name === 'Ρόλοι Επαφών');
    const contactRoleOptions = contactRolesList
        ? customListItems
            .filter(item => item.listId === contactRolesList.id)
            .map(item => ({ value: item.name, label: item.name }))
            .sort((a,b) => a.label.localeCompare(b.label))
        : [];

    return (
        <form action={formAction} className="space-y-4 pt-4">
            <input type="hidden" name="id" value={contact.id} />
            <input type="hidden" name="role" value={role} />
            
            <Accordion type="multiple" defaultValue={['basic_info']} className="w-full space-y-4">
                
                <AccordionItem value="basic_info" className="border rounded-md px-4">
                    <AccordionTrigger>Βασικά Στοιχεία</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Όνομα</Label>
                                <Input id="firstName" name="firstName" defaultValue={contact.firstName || ''} required />
                                {state.errors?.firstName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.firstName[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Επώνυμο</Label>
                                <Input id="lastName" name="lastName" defaultValue={contact.lastName || ''} required />
                                {state.errors?.lastName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.lastName[0]}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={contact.email || ''} />
                            {state.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{state.errors.email[0]}</p>}
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="mobilePhone">Κινητό Τηλέφωνο</Label>
                                <Input id="mobilePhone" name="mobilePhone" type="tel" defaultValue={contact.mobilePhone || ''} />
                                {state.errors?.mobilePhone && <p className="text-sm font-medium text-destructive mt-1">{state.errors.mobilePhone[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="landlinePhone">Σταθερό Τηλέφωνο</Label>
                                <Input id="landlinePhone" name="landlinePhone" type="tel" defaultValue={contact.landlinePhone || ''} />
                                {state.errors?.landlinePhone && <p className="text-sm font-medium text-destructive mt-1">{state.errors.landlinePhone[0]}</p>}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="address_info" className="border rounded-md px-4">
                     <AccordionTrigger>Στοιχεία Διεύθυνσης</AccordionTrigger>
                     <AccordionContent className="space-y-4 pt-2">
                         <div className="grid grid-cols-3 gap-4">
                             <div className="space-y-2 col-span-2">
                                 <Label htmlFor="addressStreet">Οδός</Label>
                                 <Input id="addressStreet" name="addressStreet" defaultValue={contact.addressStreet} />
                             </div>
                             <div className="space-y-2">
                                 <Label htmlFor="addressNumber">Αριθμός</Label>
                                 <Input id="addressNumber" name="addressNumber" defaultValue={contact.addressNumber} />
                             </div>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="addressArea">Περιοχή</Label>
                                <Input id="addressArea" name="addressArea" defaultValue={contact.addressArea} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="addressPostalCode">Τ.Κ.</Label>
                                <Input id="addressPostalCode" name="addressPostalCode" defaultValue={contact.addressPostalCode} />
                                 {state.errors?.addressPostalCode && <p className="text-sm font-medium text-destructive mt-1">{state.errors.addressPostalCode[0]}</p>}
                            </div>
                         </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                 <Label htmlFor="addressCity">Πόλη</Label>
                                 <Input id="addressCity" name="addressCity" defaultValue={contact.addressCity} />
                             </div>
                             <div className="space-y-2">
                                 <Label htmlFor="addressPrefecture">Νομός</Label>
                                 <Input id="addressPrefecture" name="addressPrefecture" defaultValue={contact.addressPrefecture} />
                             </div>
                          </div>
                     </AccordionContent>
                </AccordionItem>

                <AccordionItem value="professional_info" className="border rounded-md px-4">
                     <AccordionTrigger>Επαγγελματικά & Οικονομικά Στοιχεία</AccordionTrigger>
                     <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="role-select">Ρόλος</Label>
                            <SearchableSelect
                                value={role}
                                onValueChange={setRole}
                                options={contactRoleOptions}
                                placeholder="Επιλέξτε ρόλο..."
                                searchPlaceholder="Αναζήτηση ρόλου..."
                                emptyMessage="Δεν βρέθηκε ρόλος."
                            >
                                {contactRolesList && <DialogChild listId={contactRolesList.id} text="Προσθήκη Νέου Ρόλου..."/>}
                            </SearchableSelect>
                             {state.errors?.role && <p className="text-sm font-medium text-destructive mt-1">{state.errors.role[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="company">Επιχείρηση/Οργανισμός</Label>
                            <Input id="company" name="company" defaultValue={contact.company || ''} />
                         </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialty">Επάγγελμα/Ειδικότητα</Label>
                            <Input id="specialty" name="specialty" defaultValue={contact.specialty || ''} />
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="vatNumber">ΑΦΜ</Label>
                             <Input id="vatNumber" name="vatNumber" defaultValue={contact.vatNumber} />
                             {state.errors?.vatNumber && <p className="text-sm font-medium text-destructive mt-1">{state.errors.vatNumber[0]}</p>}
                         </div>
                     </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="additional_info" className="border rounded-md px-4">
                     <AccordionTrigger>Πρόσθετες Πληροφορίες</AccordionTrigger>
                     <AccordionContent className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="notes">Σημειώσεις</Label>
                            <Textarea id="notes" name="notes" defaultValue={contact.notes} placeholder="Οποιεσδήποτε σχετικές σημειώσεις για την επαφή..."/>
                        </div>
                     </AccordionContent>
                </AccordionItem>

            </Accordion>
            
            <div className="pt-4">
                <SubmitButton />
            </div>
        </form>
    );
}
