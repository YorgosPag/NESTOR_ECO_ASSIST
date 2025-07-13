import Link from 'next/link';
import { projects } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "On Track": "default",
  "Completed": "secondary",
  "At Risk": "destructive",
  "On Hold": "outline",
};

export function ProjectOverview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Progress</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[project.status] || 'default'}>{project.status}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Progress value={project.progress} className="h-2" />
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/project/${project.id}`}>
                  <ArrowRight className="h-4 w-4" />
                   <span className="sr-only">View Project</span>
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
