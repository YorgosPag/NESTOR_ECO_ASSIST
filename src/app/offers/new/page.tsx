import { CreateOfferForm } from "@/components/offers/create-offer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContacts } from "@/lib/contacts-data";
import { getAdminDb } from "@/lib/firebase-admin";
import { getAllProjects } from "@/lib/projects-data";
import { getCustomLists, getAllCustomListItems } from "@/lib/custom-lists-data";
import { PlusCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NewOfferPage() {
    const db = getAdminDb();
    const [contacts, projects, customLists, customListItems] = await Promise.all([
        getContacts(db),
        getAllProjects(db),
        getCustomLists(db),
        getAllCustomListItems(db)
    ]);

    const suppliers = contacts.filter(c => c.role === 'Προμηθευτής' || c.role === 'Vendor' || c.role === 'Συνεργάτης');
    const unitsList = customLists.find(l => l.key === 'UNIT_OF_MEASUREMENT');
    const unitItems = unitsList ? customListItems.filter(item => item.listId === unitsList.id) : [];

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="max-w-4xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <PlusCircle className="h-5 w-5" />
                            Δημιουργία Νέας Προσφοράς
                        </CardTitle>
                        <CardDescription>
                            Καταχωρήστε μια νέα προσφορά από προμηθευτή. 
                            Μπορεί να είναι γενική ή να αφορά ένα συγκεκριμένο έργο.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateOfferForm 
                            suppliers={suppliers}
                            projects={projects}
                            units={unitItems}
                        />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
