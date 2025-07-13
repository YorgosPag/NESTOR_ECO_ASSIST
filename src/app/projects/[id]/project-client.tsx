"use client";

import Link from 'next/link';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bell } from 'lucide-react';
import { PipelineView } from '@/components/projects/pipeline-view';
import { AuditTrail } from '@/components/projects/audit-trail';
import { SmartReminderButton } from '@/components/projects/smart-reminder-button';

export function ProjectClient({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
           <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
             <Link href="/">
               <ArrowLeft className="mr-2 size-4" />
               Back to Dashboard
             </Link>
           </Button>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div>
          <SmartReminderButton project={project}/>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList>
          <TabsTrigger value="pipeline">Project Pipeline</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="mt-4">
          <PipelineView stages={project.stages} />
        </TabsContent>
        <TabsContent value="audit" className="mt-4">
          <AuditTrail events={project.auditTrail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
