import { getProjectById } from '@/lib/data';
import { ProjectClient } from './project-client';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return <ProjectClient project={project} />;
}
