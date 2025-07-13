"use client";

import Link from 'next/link';
import type { Project } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProjectCard({ project }: { project: Project }) {
  const getStatusVariant = (status: Project['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'On Track':
        return 'secondary';
      case 'At Risk':
        return 'destructive';
      case 'Delayed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-200 ease-in-out group-hover:border-primary group-hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <CardDescription className="line-clamp-2 h-10">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge variant={getStatusVariant(project.status)}>
                {project.status}
              </Badge>
              {project.alertCount > 0 && (
                <div className="flex items-center gap-1 text-destructive text-sm font-medium">
                  <AlertTriangle className="size-4" />
                  {project.alertCount} {project.alertCount > 1 ? 'Alerts' : 'Alert'}
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
                <span className="text-sm font-bold">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            View Project
            <ArrowRight className="ml-2 size-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
