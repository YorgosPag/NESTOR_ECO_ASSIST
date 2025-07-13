"use client";

import type { Project, ProjectIntervention, Contact, CustomList, CustomListItem } from "@/types";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { InterventionPipeline } from "./InterventionPipeline";
import { DeleteInterventionDialog } from "./delete-intervention-dialog";
import { AddStageDialog } from "./add-stage-dialog";
import { PlusCircle, Trash2, ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditInterventionDialog } from "./edit-intervention-dialog";

interface InterventionCardProps {
    project: Project;
    intervention: ProjectIntervention;
    allProjectInterventions: ProjectIntervention[];
    contacts: Contact[];
    customLists: CustomList[];
    customListItems: CustomListItem[];
    owner?: Contact;
}

export function InterventionCard({ project, intervention, allProjectInterventions, contacts, customLists, customListItems, owner }: InterventionCardProps) {
    const interventionName = intervention.interventionSubcategory || intervention.interventionCategory || intervention.name || 'Unnamed Intervention';

    return (
        <AccordionItem value={intervention.id} className="border-none">
            <Card className="overflow-hidden">
                <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="flex w-full items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors [&[data-state=open]>svg]:rotate-180">
                        <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold">{interventionName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                             <div onClick={(e) => e.stopPropagation()}>
                                <EditInterventionDialog project={project} intervention={intervention} customLists={customLists} customListItems={customListItems}>
                                    <div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 cursor-pointer")}>
                                        <Pencil className="h-4 w-4" />
                                    </div>
                                </EditInterventionDialog>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <DeleteInterventionDialog project={project} intervention={intervention}>
                                     <div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 text-destructive hover:text-destructive cursor-pointer")}>
                                        <Trash2 className="h-4 w-4" />
                                     </div>
                                </DeleteInterventionDialog>
                            </div>
                            <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                        </div>
                    </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent>
                  <div className="px-6 pb-6 space-y-6">
                    <div className="border-t -mx-6 px-6 pt-6">
                      <h4 className="text-base font-semibold mb-2">Στάδια Υλοποίησης</h4>
                      <InterventionPipeline 
                          stages={intervention.stages} 
                          project={project}
                          allProjectInterventions={allProjectInterventions}
                          interventionName={interventionName}
                          contacts={contacts} 
                          owner={owner} 
                          interventionMasterId={intervention.masterInterventionId} 
                      />
                    </div>
                    <div className="flex justify-start pt-2">
                        <AddStageDialog projectId={project.id} interventionMasterId={intervention.masterInterventionId} interventionName={interventionName} contacts={contacts}>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Προσθήκη Νέου Σταδίου
                            </Button>
                        </AddStageDialog>
                    </div>
                  </div>
                </AccordionContent>
            </Card>
        </AccordionItem>
    );
}
