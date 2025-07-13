import { DashboardClientPage } from "@/components/dashboard/dashboard-client-page";
import { getProjects } from "@/lib/projects-data";
import { getContacts } from "@/lib/contacts-data";


export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // In a real app, you'd fetch real data. For now, we are using mock data.
  const projectsData = await getProjects();
  const contactsData = await getContacts();
 
  return <DashboardClientPage projects={projectsData} contacts={contactsData} />;
}
