import { getProjects } from "@/lib/projects-data";
import { getContacts } from "@/lib/contacts-data";
import { ProjectsClientPage } from "@/components/projects/projects-client-page";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  // In a real app, you'd fetch this data from a database.
  const projectsData = await getProjects();
  const contactsData = await getContacts();

  return <ProjectsClientPage projects={projectsData} contacts={contactsData} />;
}
