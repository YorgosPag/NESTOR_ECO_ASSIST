"use client";

import { useState, useEffect } from "react";
import type { Project, MasterIntervention, Contact, CustomList, CustomListItem, ProjectIntervention } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AuditLogDisplay } from "@/components/projects/audit-log";
import { History, PlusCircle, ChevronsUp, ChevronsDown } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { AddInterventionDialog } from "./add-intervention-dialog";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectActions } from "./ProjectActions";
import { ProjectAlerts } from "./ProjectAlerts";
import { InterventionCard } from "./InterventionCard";

export function ProjectDetails({ project: serverProject, masterInterventions, contacts, customLists, customListItems }: { project: Project, masterInterventions: MasterIntervention[], contacts: Contact[], customLists: CustomList[], customListItems: CustomListItem[] }) {
  const [openInterventions, setOpenInterventions] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (serverProject.interventions) {
      setOpenInterventions(serverProject.interventions.map(i => i.id));
    }
  }, [serverProject.interventions]);

  const expandAll = () => {
    if (serverProject.interventions) {
      setOpenInterventions(serverProject.interventions.map(i => i.id));
    }
  }
  const collapseAll = () => setOpenInterventions([]);
  
  const owner = contacts.find(c => c.id === serverProject.ownerContactId);
  
  const hasInterventions = Array.isArray(serverProject.interventions) && serverProject.interventions.length > 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ProjectHeader project={serverProject} owner={owner} isMounted={isMounted} />
      
      <ProjectActions project={serverProject} contacts={contacts} />

      {isMounted && <ProjectAlerts project={serverProject} />}

      <Tabs defaultValue="interventions" className="w-full">
        <TabsList>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
            <TabsTrigger value="audit-log">
                <History className="w-4 h-4 mr-2" />
                Audit Log
            </TabsTrigger>
        </TabsList>
        <TabsContent value="interventions" className="mt-4 space-y-6">
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
                <AddInterventionDialog projectId={serverProject.id} customLists={customLists} customListItems={customListItems} masterInterventions={masterInterventions}>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Intervention
                  </Button>
                </AddInterventionDialog>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={expandAll} disabled={!hasInterventions}>
                      <ChevronsDown className="mr-2 h-4 w-4" />
                      Expand All
                  </Button>
                  <Button variant="outline" size="sm" onClick={collapseAll} disabled={!hasInterventions}>
                      <ChevronsUp className="mr-2 h-4 w-4" />
                      Collapse All
                  </Button>
              </div>
            </div>
            {hasInterventions ? (
              <Accordion type="multiple" value={openInterventions} onValueChange={setOpenInterventions} className="w-full space-y-4">
                  {serverProject.interventions?.map((intervention) => (
                      <InterventionCard 
                          key={intervention.id}
                          project={serverProject}
                          intervention={intervention}
                          masterInterventions={masterInterventions}
                          allProjectInterventions={serverProject.interventions as ProjectIntervention[]}
                          contacts={contacts}
                          customLists={customLists}
                          customListItems={customListItems}
                          owner={owner}
                      />
                  ))}
              </Accordion>
            ) : (
              <div className="text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                No interventions have been added to this project yet.
              </div>
            )}
          </div>
        </TabsContent>
         <TabsContent value="audit-log" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Project Audit Log</CardTitle>
                    <CardDescription>A complete history of all actions taken on this project.</CardDescription>
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
