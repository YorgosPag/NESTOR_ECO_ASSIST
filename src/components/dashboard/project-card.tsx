"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
import { ArrowUpRight, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { calculateClientProjectMetrics } from '@/lib/client-utils';
import { Skeleton } from "../ui/skeleton";
import { EditProjectDialog } from "../projects/edit-project-dialog";
import { DeleteProjectDialog } from "../projects/delete-project-dialog";
import { contacts } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project: serverProject }: ProjectCardProps) {
  const [project, setProject] = useState(serverProject);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setProject(calculateClientProjectMetrics(serverProject));
    setIsMounted(true);
  }, [serverProject]);


  const displayProject = isMounted ? project : serverProject;

  const statusVariant = {
    'On Track': 'default',
    'At Risk': 'destructive',
    'Completed': 'secondary',
    'On Hold': 'outline',
  }[displayProject.status] as "default" | "destructive" | "secondary" | "outline" | undefined;

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
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4"/>
                        <span className="sr-only">Project Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <EditProjectDialog project={project} contacts={contacts}>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </EditProjectDialog>
                     <DeleteProjectDialog project={project}>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DeleteProjectDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-grow">
        <div>
           {isMounted && statusVariant ? (
                <Badge variant={statusVariant}>{displayProject.status}</Badge>
            ) : <Skeleton className="h-5 w-20 rounded-full" />}
        </div>
        <div>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            {isMounted ? (
                <span>{displayProject.progress}%</span>
            ): <Skeleton className="h-4 w-8" />}
          </div>
          {isMounted ? (
             <Progress value={displayProject.progress} aria-label={`${displayProject.progress}% complete`} />
          ) : <Skeleton className="h-4 w-full" /> }
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
