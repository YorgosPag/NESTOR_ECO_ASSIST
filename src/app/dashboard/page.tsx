import { DashboardClientPage } from "@/components/dashboard/dashboard-client-page";
import { projects } from "@/lib/data";


export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // In a real app, you'd fetch real data. For now, we are using mock data.
  const projectsData = projects;
 
  return <DashboardClientPage projects={projectsData} />;
}
