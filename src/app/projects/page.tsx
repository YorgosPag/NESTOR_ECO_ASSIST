import { projects, contacts } from "@/lib/data";
import { ProjectsClientPage } from "@/components/projects/projects-client-page";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  // In a real app, you'd fetch this data from a database.
  // We are using static mock data for now.
  const projectsData = projects;
  const contactsData = contacts;

  return <ProjectsClientPage projects={projectsData} contacts={contactsData} />;
}
