"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {

  const statusVariant = {
    'On Track': 'default',
    'At Risk': 'destructive',
    'Completed': 'secondary',
    'On Hold': 'outline',
  }[project.status] as "default" | "destructive" | "secondary" | "outline" | undefined;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">{project.manager}</p>
                <CardTitle className="mt-1 text-lg">
                    <Link href={`/project/${project.id}`} className="hover:underline">
                        {project.name}
                    </Link>
                </CardTitle>
            </div>
            {statusVariant && <Badge variant={statusVariant}>{project.status}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-grow">
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} aria-label={`${project.progress}% complete`} />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
            <Link href={`/project/${project.id}`}>
                View Project <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
