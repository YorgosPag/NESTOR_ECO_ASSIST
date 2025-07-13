"use client";

import type { Project } from "@/lib/data";
import { ProjectCard } from "./project-card";
import { OverviewChart } from "./overview-chart";
import { UpcomingDeadlines } from "./upcoming-deadlines";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function DashboardClientPage({ projects }: { projects: Project[] }) {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>
          <PlusCircle className="mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <div>
          <UpcomingDeadlines projects={projects} />
        </div>
      </div>
    </div>
  );
}
