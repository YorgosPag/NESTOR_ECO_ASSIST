import { getProjects } from '@/lib/data';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function DashboardPage() {
  const projects = await getProjects();
  return <DashboardClient projects={projects} />;
}
