"use client";

import type { Project, ProjectIntervention, Contact, CustomList, CustomListItem, MasterIntervention } from "@/types";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddStageDialog } from "./add-stage-dialog";
import { InterventionPipeline } from "./InterventionPipeline";
import { DeleteInterventionDialog } from "./delete-intervention-dialog";

interface InterventionCardProps {
    project: Project;
    intervention: ProjectIntervention;
    allProjectInterventions: ProjectIntervention[];
    masterInterventions: MasterIntervention[];
    contacts: Contact[];
    customLists: CustomList[];
    customListItems: CustomListItem[];
    owner?: Contact;
}

export function InterventionCard({ project, intervention, allProjectInterventions, masterInterventions, contacts, customLists, customListItems, owner }: InterventionCardProps) {

    const masterIntervention = masterInterventions.find(mi => mi.id === intervention.masterInterventionId);

    return (
        <AccordionItem value={intervention.id} className="border-b-0">
            <Card>
                <AccordionTrigger className="p-4 bg-muted/50 hover:bg-muted/80">
                    <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold">{masterIntervention?.name || 'Unknown Intervention'}</h3>
                        <p className="text-sm text-muted-foreground">{masterIntervention?.description}</p>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <DeleteInterventionDialog project={project} intervention={intervention}>
                             <div className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "h-8 w-8 text-destructive hover:text-destructive cursor-pointer")}>
                                <Trash2 className="h-4 w-4" />
                             </div>
                        </DeleteInterventionDialog>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 md:p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-semibold mb-2">Στάδια Υλοποίησης</h4>
                      <InterventionPipeline 
                          stages={intervention.stages} 
                          project={project}
                          allProjectInterventions={allProjectInterventions}
                          interventionName={masterIntervention?.name || 'Intervention'}
                          contacts={contacts} 
                          owner={owner} 
                          interventionMasterId={intervention.masterInterventionId} 
                      />
                    </div>
                    <div className="flex justify-start pt-4 border-t">
                        <AddStageDialog projectId={project.id} interventionMasterId={intervention.masterInterventionId} interventionName={masterIntervention?.name || 'Intervention'} contacts={contacts}>
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
