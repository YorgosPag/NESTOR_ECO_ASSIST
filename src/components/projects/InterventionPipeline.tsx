"use client";

import type { Stage, Contact, ProjectIntervention, Project } from "@/types";
import { StageCard } from "./StageCard";

interface InterventionPipelineProps {
  stages: Stage[];
  project: Project;
  interventionName: string;
  contacts: Contact[];
  owner?: Contact;
  interventionMasterId: string;
}

const PipelineColumn = ({ title, stages, project, interventionName, contacts, owner, interventionMasterId }: { title: string, stages: Stage[], project: Project, interventionName: string, contacts: Contact[], owner?: Contact, interventionMasterId: string }) => (
  <div className="flex flex-col gap-3 flex-shrink-0 w-72">
    <h3 className="font-semibold mb-3 px-2 text-muted-foreground">{title} ({stages.length})</h3>
      {stages.map((stage, index) => (
        <StageCard 
            key={stage.id} 
            stage={stage} 
            project={project}
            interventionName={interventionName}
            contacts={contacts} 
            owner={owner}
            interventionMasterId={interventionMasterId}
            canMoveUp={index > 0}
            canMoveDown={index < stages.length - 1}
        />
      ))}
      {stages.length === 0 && <p className="text-sm text-muted-foreground px-2 italic pt-4">Κανένα στάδιο σε αυτή τη στήλη.</p>}
  </div>
);

export function InterventionPipeline({ stages, project, interventionName, contacts, owner, interventionMasterId }: InterventionPipelineProps) {
  const notStartedItems = stages.filter((s) => s.status === 'Δεν έχει ξεκινήσει');
  const inProgressItems = stages.filter((s) => s.status === 'Σε Εξέλιξη' || s.status === 'Σε Καθυστέρηση');
  const completedItems = stages.filter((s) => s.status === 'Ολοκληρωμένο');
  const failedItems = stages.filter((s) => s.status === 'Απέτυχε');

  return (
    <div className="flex gap-6">
      <PipelineColumn title="Σε Εκκρεμότητα" stages={notStartedItems} project={project} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId} />
      <PipelineColumn title="Σε Εξέλιξη" stages={inProgressItems} project={project} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId}/>
      <PipelineColumn title="Ολοκληρωμένα" stages={completedItems} project={project} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId}/>
      <PipelineColumn title="Απέτυχαν" stages={failedItems} project={project} interventionName={interventionName} contacts={contacts} owner={owner} interventionMasterId={interventionMasterId}/>
    </div>
  );
}
