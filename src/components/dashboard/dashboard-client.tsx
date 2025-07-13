"use client";

import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProjectCard } from './project-card';

export function DashboardClient({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all environmental projects.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          New Project
        </Button>
      </div>
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
