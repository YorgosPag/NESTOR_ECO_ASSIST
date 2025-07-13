"use client";

import type { Project, Stage } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileManager } from "./file-manager";

type ProjectPipelineProps = {
  project: Project;
};

export function ProjectPipeline({ project }: ProjectPipelineProps) {
    const allStages = project.interventions?.flatMap(i => i.stages) || [];

    if (allStages.length === 0) {
    return (
        <div className="py-8 text-center text-muted-foreground">
            No stages defined for this project yet.
        </div>
    )
  }

  // Find a default stage ID that actually exists.
  const defaultStageId = allStages.length > 0 ? allStages[0].id : undefined;

  if (!defaultStageId) {
    return (
        <div className="py-8 text-center text-muted-foreground">
             Could not determine a default stage.
        </div>
    );
  }

  return (
    <Tabs defaultValue={defaultStageId} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {allStages.map((stage: Stage) => (
          <TabsTrigger key={stage.id} value={stage.id}>
            {stage.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {allStages.map((stage: Stage) => (
        <TabsContent key={stage.id} value={stage.id}>
          <FileManager stage={stage} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
