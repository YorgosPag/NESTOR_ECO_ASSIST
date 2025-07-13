import { getProjectById } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import { ProjectDetails } from "@/components/projects/project-details";
import { getMasterInterventions } from "@/lib/interventions-data";
import { getContacts } from "@/lib/contacts-data";
import { getAdminDb } from "@/lib/firebase-admin";
import { getCustomLists, getAllCustomListItems } from "@/lib/custom-lists-data";
import { getAuditLogs } from "@/lib/audit-log-data";

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const db = getAdminDb();
    const [project, masterInterventions, contacts, customLists, customListItems, auditLogs] = await Promise.all([
        getProjectById(db, params.id),
        getMasterInterventions(db),
        getContacts(db),
        getCustomLists(db),
        getAllCustomListItems(db),
        getAuditLogs(db, params.id),
    ]);

    if (!project) {
        notFound();
    }

    return <ProjectDetails 
        project={project} 
        masterInterventions={masterInterventions} 
        contacts={contacts} 
        customLists={customLists} 
        customListItems={customListItems}
        auditLogs={auditLogs}
    />;
}
