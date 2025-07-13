// src/components/offers/create-offer-form.tsx
"use client";

import { useEffect, useActionState, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createOfferAction } from '@/app/actions/offers';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import type { Contact, Project, CustomListItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

const initialState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Δημιουργία Προσφοράς"}
    </Button>
  );
}

interface OfferItem {
    id: string; // Temporary client-side ID
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
}

interface CreateOfferFormProps {
    suppliers: Contact[];
    projects: Project[];
    units: CustomListItem[];
}

export function CreateOfferForm({ suppliers, projects, units }: CreateOfferFormProps) {
  const [state, formAction] = useActionState(createOfferAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [items, setItems] = useState<OfferItem[]>([
    { id: `item-${Date.now()}`, name: '', unit: '', quantity: 1, unitPrice: 0 },
  ]);
  const [offerType, setOfferType] = useState<'general' | 'perProject'>('general');

  useEffect(() => {
    if (state.success) {
      toast({ title: "Επιτυχία!", description: state.message });
      formRef.current?.reset();
      setItems([{ id: `item-${Date.now()}`, name: '', unit: '', quantity: 1, unitPrice: 0 }]);
      setOfferType('general');
    } else if (state.message) {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleItemChange = (id: string, field: keyof Omit<OfferItem, 'id'>, value: string | number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addNewItem = () => {
    setItems(currentItems => [
      ...currentItems,
      { id: `item-${Date.now()}`, name: '', unit: units[0]?.name || '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };
  
  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  return (
    <form ref={formRef} action={formAction} className="space-y-6 pt-4">
        {/* Hidden input to pass items to the server action */}
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="supplierId">Προμηθευτής</Label>
                <Select name="supplierId" required>
                    <SelectTrigger><SelectValue placeholder="Επιλέξτε προμηθευτή..." /></SelectTrigger>
                    <SelectContent>
                        {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.company})</SelectItem>)}
                    </SelectContent>
                </Select>
                 {state.errors?.supplierId && <p className="text-sm font-medium text-destructive">{state.errors.supplierId[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label>Τύπος Προσφοράς</Label>
                <RadioGroup name="type" defaultValue="general" onValueChange={(value: 'general' | 'perProject') => setOfferType(value)} className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="general" id="r1" />
                        <Label htmlFor="r1">Γενική</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="perProject" id="r2" />
                        <Label htmlFor="r2">Ανά Έργο</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>

        {offerType === 'perProject' && (
            <div className="space-y-2">
                <Label htmlFor="projectId">Έργο</Label>
                <Select name="projectId">
                    <SelectTrigger><SelectValue placeholder="Επιλέξτε έργο..." /></SelectTrigger>
                    <SelectContent>
                        {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        )}

        <div className="space-y-2">
            <Label htmlFor="description">Περιγραφή</Label>
            <Textarea id="description" name="description" placeholder="Σύντομη περιγραφή του περιεχομένου της προσφοράς..." required/>
            {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
        </div>

        <div className="space-y-4">
            <Label className="text-lg font-semibold">Γραμμές Προσφοράς</Label>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[45%]">Περιγραφή</TableHead>
                            <TableHead>Μον.</TableHead>
                            <TableHead>Ποσ.</TableHead>
                            <TableHead>Τιμή/Μον.</TableHead>
                            <TableHead className="text-right">Σύνολο</TableHead>
                            <TableHead className="w-[50px]">Διαγ.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Input value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} placeholder="π.χ., Ηλιακός Θερμοσίφωνας" required />
                                </TableCell>
                                <TableCell>
                                     <Select value={item.unit} onValueChange={(value) => handleItemChange(item.id, 'unit', value)} required>
                                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {units.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}
                                        </SelectContent>
                                     </Select>
                                </TableCell>
                                <TableCell>
                                    <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.valueAsNumber || 0)} className="w-20" required />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.valueAsNumber || 0)} className="w-24" required step="0.01"/>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {(item.quantity * item.unitPrice).toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive" disabled={items.length <= 1}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-bold text-lg">Γενικό Σύνολο</TableCell>
                            <TableCell colSpan={2} className="text-left font-bold font-mono text-lg">{totalAmount.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
             {state.errors?.items && <p className="text-sm font-medium text-destructive">{typeof state.errors.items === 'string' ? state.errors.items : JSON.stringify(state.errors.items)}</p>}
            <Button type="button" variant="outline" size="sm" onClick={addNewItem}>
                <PlusCircle className="mr-2 h-4 w-4" /> Προσθήκη Γραμμής
            </Button>
        </div>
      
      <SubmitButton />
    </form>
  );
}
