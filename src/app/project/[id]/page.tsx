import { projects } from "@/lib/data";
import { Header } from "@/components/layout/header";
import { ProjectPipeline } from "@/components/project/project-pipeline";
import { notFound } from "next/navigation";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title={project.name} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ProjectPipeline project={project} />
      </main>
    </div>
  );
}
