import { projects } from "@/lib/data";
import { ProjectPipeline } from "@/components/project/project-pipeline";
import { notFound } from "next/navigation";
import type { Project } from "@/types";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project: Project | undefined = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col p-4 md:p-8">
      <h1 className="text-2xl font-semibold mb-4">{project.name}</h1>
      <main className="flex flex-1 flex-col gap-4">
        <ProjectPipeline project={project} />
      </main>
    </div>
  );
}
