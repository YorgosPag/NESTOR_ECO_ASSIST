// src/components/projects/InterventionCard.tsx
"use client";

import type { Project, ProjectIntervention, Contact, CustomList, CustomListItem } from "@/types";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { InterventionPipeline } from "./InterventionPipeline";
import { DeleteInterventionDialog } from "../projects/delete-intervention-dialog";
import { AddStageDialog } from "./add-stage-dialog";
import { PlusCircle, Trash2, ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditInterventionDialog } from "./edit-intervention-dialog";
import { SubInterventionsTable } from "./sub-interventions-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

interface InterventionCardProps {
    project: Project;
    intervention: ProjectIntervention;
    contacts: Contact[];
    customLists: CustomList[];
    customListItems: CustomListItem[];
    owner?: Contact;
}

export function InterventionCard({ project, intervention, contacts, customLists, customListItems, owner }: InterventionCardProps) {
    const interventionName = intervention.interventionSubcategory || intervention.interventionCategory;

    return (
        <AccordionItem value={intervention.masterId} className="border-none">
            <Card className="overflow-hidden">
                <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="flex w-full items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors [&[data-state=open]>svg:not(.lucide-grip-vertical)]:rotate-180">
                        <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold">{interventionName}</h3>
                        </div>
                        <div className="flex items-center gap-2 pr-2" onClick={(e) => e.stopPropagation()}>
                             <EditInterventionDialog project={project} intervention={intervention}>
                                 <div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 cursor-pointer")}>
                                    <Pencil className="h-4 w-4" />
                                 </div>
                             </EditInterventionDialog>
                            <DeleteInterventionDialog project={project} intervention={intervention}>
                                 <div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 text-destructive hover:text-destructive cursor-pointer")}>
                                    <Trash2 className="h-4 w-4" />
                                 </div>
                            </DeleteInterventionDialog>
                           <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                        </div>
                    </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent>
                  <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-6">
                    <Tabs defaultValue="sub-interventions">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="sub-interventions">Υπο-Παρεμβάσεις</TabsTrigger>
                            <TabsTrigger value="stages">Στάδια Υλοποίησης</TabsTrigger>
                        </TabsList>
                        <TabsContent value="sub-interventions" className="pt-4">
                            <SubInterventionsTable 
                                project={project} 
                                intervention={intervention} 
                                customLists={customLists} 
                                customListItems={customListItems}
                            />
                        </TabsContent>
                        <TabsContent value="stages" className="pt-4">
                             <div className="space-y-4">
                                <ScrollArea className="w-full whitespace-nowrap">
                                <InterventionPipeline 
                                    stages={intervention.stages} 
                                    project={project}
                                    interventionName={interventionName}
                                    contacts={contacts} 
                                    owner={owner} 
                                    interventionMasterId={intervention.masterId} 
                                />
                                </ScrollArea>
                                <div className="flex justify-start pt-2">
                                    <AddStageDialog projectId={project.id} interventionMasterId={intervention.masterId} interventionName={interventionName} contacts={contacts}>
                                        <Button variant="outline" size="sm">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Προσθήκη Νέου Σταδίου
                                        </Button>
                                    </AddStageDialog>
                                </div>
                             </div>
                        </TabsContent>
                    </Tabs>
                  </div>
                </AccordionContent>
            </Card>
        </AccordionItem>
    );
}