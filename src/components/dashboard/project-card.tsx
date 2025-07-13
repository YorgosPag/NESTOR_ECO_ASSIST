import Link from "next/link";
import type { Project } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

type ProjectCardProps = {
  project: Project;
};

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "On Track": "default",
  "Completed": "secondary",
  "At Risk": "destructive",
  "On Hold": "outline",
};


export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{project.name}</CardTitle>
        <CardDescription>{project.manager}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
            <Badge variant={statusVariantMap[project.status]}>{project.status}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">{project.progress}% Complete</p>
          <Progress value={project.progress} />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
            <Link href={`/project/${project.id}`}>
                View Project <ArrowUpRight className="ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
