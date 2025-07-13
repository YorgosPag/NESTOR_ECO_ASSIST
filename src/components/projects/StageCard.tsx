"use client";

import { useState, useEffect } from "react";
import type { Stage, Contact, Project, ProjectIntervention } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditStageDialog } from "./edit-stage-dialog";
import { DeleteStageDialog } from "./delete-stage-dialog";
import { Calendar, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { format, isPast } from 'date-fns';
import { cn } from "@/lib/utils";

interface StageCardProps {
  stage: Stage;
  project: Project;
  allProjectInterventions: ProjectIntervention[];
  interventionName: string;
  contacts: Contact[];
  owner?: Contact;
  interventionMasterId: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function StageCard({ stage, project, interventionName, contacts }: StageCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const statusVariant = {
    "Not Started": "outline",
    "In Progress": "default",
    "Completed": "secondary",
    "Delayed": "destructive",
  }[stage.status] as "default" | "destructive" | "secondary" | "outline";

  const deadlineDate = new Date(stage.deadline);
  const isOverdue = isClient ? isPast(deadlineDate) && stage.status !== 'Completed' : false;

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow", isOverdue && "border-destructive/50 bg-destructive/5")}>
      <CardHeader className="p-3">
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-base font-semibold">
                {stage.title}
            </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditStageDialog stage={stage} projectId={project.id} interventionName={interventionName} contacts={contacts}>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Επεξεργασία</span>
                </DropdownMenuItem>
              </EditStageDialog>
              <DeleteStageDialog stage={stage} projectId={project.id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Διαγραφή</span>
                </DropdownMenuItem>
              </DeleteStageDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-xs text-muted-foreground">
        <Badge variant={statusVariant} className="capitalize">{stage.status}</Badge>
        <div className={cn("flex items-center gap-2", isOverdue && 'text-destructive font-medium')}>
            <Calendar className="h-3.5 w-3.5"/>
            <span>Λήξη: {isClient ? format(deadlineDate, 'dd MMM, yyyy') : "..."}</span>
        </div>
        {stage.lastUpdated && (
            <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5"/>
                <span>Ενημ.: {isClient ? format(new Date(stage.lastUpdated), 'dd MMM, yyyy') : "..."}</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
}