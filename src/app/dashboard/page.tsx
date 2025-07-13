import { DashboardClientPage } from "@/components/dashboard/dashboard-client-page";
import { getAllProjects } from "@/lib/projects-data";
import { getContacts } from "@/lib/contacts-data";


export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // In a real app, you'd fetch real data. For now, we are using mock data.
  const projectsData = await getAllProjects();
  const contactsData = await getContacts();
 
  return <DashboardClientPage projects={projectsData} contacts={contactsData} />;
}
