
"use client";

import { useState, useEffect } from "react";
import type { Project, MasterIntervention, Contact, CustomList, CustomListItem, ProjectIntervention } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AuditLogDisplay } from "@/components/projects/audit-log";
import { History, PlusCircle, ChevronsUp, ChevronsDown, FileText } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AddInterventionDialog } from "./add-intervention-dialog";
import { QuotationSummaryCard } from "./quotation-summary-card";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectDetailsActions } from "./ProjectDetailsActions";
import { ProjectAlerts } from "./ProjectAlerts";
import { InterventionCard } from "./InterventionCard";

export function ProjectDetails({ project: serverProject, masterInterventions, contacts, customLists, customListItems }: { project: Project, masterInterventions: MasterIntervention[], contacts: Contact[], customLists: CustomList[], customListItems: CustomListItem[] }) {
  const [openInterventions, setOpenInterventions] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (serverProject.interventions) {
      setOpenInterventions(serverProject.interventions.map(i => i.masterId));
    }
  }, [serverProject.interventions]);

  const expandAll = () => {
    if (serverProject.interventions) {
      setOpenInterventions(serverProject.interventions.map(i => i.masterId));
    }
  }
  const collapseAll = () => setOpenInterventions([]);
  
  const owner = contacts.find(c => c.id === serverProject.ownerContactId);
  
  const hasInterventions = Array.isArray(serverProject.interventions) && serverProject.interventions.length > 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4">
        <ProjectHeader project={serverProject} owner={owner} isMounted={isMounted} />
        <ProjectDetailsActions project={serverProject} contacts={contacts} />
      </div>
      
      <ProjectAlerts project={serverProject} isMounted={isMounted} />

      {isMounted && hasInterventions && (
        <Accordion type="single" collapsible value={isSummaryOpen ? "summary" : ""} onValueChange={(value) => setIsSummaryOpen(value === "summary")}>
          <AccordionItem value="summary" className="border-b-0">
             <Card>
                <AccordionTrigger className="p-4 md:p-6 hover:no-underline">
                     <div className="flex flex-col items-start text-left">
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                           <FileText className="h-5 w-5"/>
                           Συνοπτική Οικονομική Ανάλυση
                        </CardTitle>
                        <CardDescription className="pt-1 text-xs md:text-sm">
                           Αναλυτική εικόνα κόστους και κέρδους.
                        </CardDescription>
                     </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                    <QuotationSummaryCard interventions={serverProject.interventions} />
                </AccordionContent>
             </Card>
          </AccordionItem>
        </Accordion>
      )}

      <Tabs defaultValue="interventions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interventions">Παρεμβάσεις</TabsTrigger>
            <TabsTrigger value="audit-log">
                <History className="w-4 h-4 mr-2" />
                Ιστορικό
            </TabsTrigger>
        </TabsList>
        <TabsContent value="interventions" className="mt-4 space-y-6">
          
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
                <AddInterventionDialog projectId={serverProject.id}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Προσθήκη Παρέμβασης
                  </Button>
                </AddInterventionDialog>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={expandAll} disabled={!hasInterventions}>
                      <ChevronsDown className="mr-2 h-4 w-4" />
                      Όλα
                  </Button>
                  <Button variant="outline" size="sm" onClick={collapseAll} disabled={!hasInterventions}>
                      <ChevronsUp className="mr-2 h-4 w-4" />
                      Κανένα
                  </Button>
              </div>
            </div>
            {hasInterventions ? (
              <Accordion type="multiple" value={openInterventions} onValueChange={setOpenInterventions} className="w-full space-y-4">
                  {serverProject.interventions?.map((intervention) => (
                      <InterventionCard 
                          key={intervention.masterId}
                          project={serverProject}
                          intervention={intervention}
                          contacts={contacts}
                          customLists={customLists}
                          customListItems={customListItems}
                          owner={owner}
                      />
                  ))}
              </Accordion>
            ) : (
              <div className="text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                Δεν υπάρχουν ακόμη παρεμβάσεις για αυτό το έργο.
              </div>
            )}
          </div>
        </TabsContent>
         <TabsContent value="audit-log" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Ιστορικό Ενεργειών Έργου</CardTitle>
                    <CardDescription>Ένα πλήρες ιστορικό όλων των ενεργειών σε αυτό το έργο.</CardDescription>
                  </CardHeader>
                <CardContent>
                    <AuditLogDisplay auditLogs={serverProject.auditLog || []} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
