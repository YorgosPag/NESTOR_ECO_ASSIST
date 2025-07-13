// Placeholder for ProjectDetails component
import type { Project, MasterIntervention, Contact, CustomList, CustomListItem, AuditLog } from "@/types";
import { ProjectPipeline } from "../project/project-pipeline";

interface ProjectDetailsProps {
    project: Project;
    masterInterventions: MasterIntervention[];
    contacts: Contact[];
    customLists: CustomList[];
    customListItems: CustomListItem[];
    auditLogs: AuditLog[];
}

export function ProjectDetails({ project, masterInterventions, contacts, customLists, customListItems, auditLogs }: ProjectDetailsProps) {
    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p>Details for the project will be implemented here.</p>

            <ProjectPipeline project={project} />

        </div>
    );
}