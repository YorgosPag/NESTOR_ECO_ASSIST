
import { DashboardClientPage } from "@/components/dashboard/dashboard-client-page";
import { getAllProjects } from "@/lib/projects-data";
import { getContacts } from "@/lib/contacts-data";
import { getAdminDb } from "@/lib/firebase-admin";


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const db = getAdminDb();
 
  const [projectsData, contactsData] = await Promise.all([
    getAllProjects(db),
    getContacts(db),
  ]);
 
  return <DashboardClientPage projects={projectsData} contacts={contactsData} />;
}
