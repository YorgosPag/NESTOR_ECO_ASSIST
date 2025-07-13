"use client";

import type { MasterIntervention, CustomList, CustomListItem } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasterInterventionsTable } from "./master-interventions-table";
import { CustomListsManager } from "./custom-lists-manager";
import { Settings, List, Hammer } from "lucide-react";

interface AdminClientPageProps {
    masterInterventions: MasterIntervention[];
    customLists: CustomList[];
    customListItems: CustomListItem[];
}

export function AdminClientPage({ masterInterventions, customLists, customListItems }: AdminClientPageProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Πίνακας Ελέγχου Διαχειριστή
                </h1>
                <p className="text-muted-foreground">Κεντρική διαχείριση λιστών και παραμέτρων της εφαρμογής.</p>
            </div>
            <Tabs defaultValue="custom-lists" className="w-full">
                <TabsList>
                    <TabsTrigger value="custom-lists">
                        <List className="mr-2 h-4 w-4" />
                        Προσαρμοσμένες Λίστες
                    </TabsTrigger>
                    <TabsTrigger value="master-interventions">
                         <Hammer className="mr-2 h-4 w-4" />
                        Τύποι Παρεμβάσεων
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="custom-lists" className="mt-4">
                   <CustomListsManager customLists={customLists} allItems={customListItems} />
                </TabsContent>
                <TabsContent value="master-interventions" className="mt-4">
                    <MasterInterventionsTable interventions={masterInterventions} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
