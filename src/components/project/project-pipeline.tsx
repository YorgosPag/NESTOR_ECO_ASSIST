"use client";

import type { Project } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileManager } from "./file-manager";

type ProjectPipelineProps = {
  project: Project;
};

export function ProjectPipeline({ project }: ProjectPipelineProps) {
  if (!project.stages || project.stages.length === 0) {
    return (
        <div className="py-8 text-center text-muted-foreground">
            No stages defined for this project yet.
        </div>
    )
  }
  return (
    <Tabs defaultValue={project.stages[0].id} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {project.stages.map((stage) => (
          <TabsTrigger key={stage.id} value={stage.id}>
            {stage.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {project.stages.map((stage) => (
        <TabsContent key={stage.id} value={stage.id}>
          <FileManager stage={stage} />
        </TabsContent>
      ))}
    </Tabs>
  );
}