import { getAllProjects } from "@/lib/projects-data";
import { getContacts } from "@/lib/contacts-data";
import { ProjectsClientPage } from "@/components/projects/projects-client-page";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const db = getAdminDb();
  const [projectsData, contactsData] = await Promise.all([
      getAllProjects(db),
      getContacts(db)
  ]);

  return <ProjectsClientPage projects={projectsData} contacts={contactsData} />;
}
