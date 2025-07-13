"use client";

import { useState, useEffect, useRef } from "react";
import type { Stage, Contact, ProjectIntervention, Project } from "@/types";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EditStageDialog } from "./edit-stage-dialog";
import { DeleteStageDialog } from "./delete-stage-dialog";
import { Calendar, Clock, MoreVertical, Pencil, Trash2, ArrowUp, ArrowDown, Play, CheckCircle, XCircle, Undo2, User, AlertCircle } from "lucide-react";
import { format, differenceInDays, isPast } from 'date-fns';
import { cn } from "@/lib/utils";
import { moveStageAction, updateStageStatusAction } from "@/app/actions/projects";

interface StageCardProps {
  stage: Stage;
  project: Project;
  interventionName: string;
  contacts: Contact[];
  owner?: Contact;
  interventionMasterId: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function StageCard({ stage, project, interventionName, contacts, interventionMasterId, canMoveUp, canMoveDown }: StageCardProps) {
  const [isClient, setIsClient] = useState(false);
  const formRefUp = useRef<HTMLFormElement>(null);
  const formRefDown = useRef<HTMLFormElement>(null);
  const formRefStart = useRef<HTMLFormElement>(null);
  const formRefComplete = useRef<HTMLFormElement>(null);
  const formRefFail = useRef<HTMLFormElement>(null);
  const formRefRestart = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const statusConfig = {
    'Δεν έχει ξεκινήσει': { variant: "outline", text: "Σε Εκκρεμότητα" },
    'Σε Εξέλιξη': { variant: "default", text: "Σε Εξέλιξη" },
    'Ολοκληρωμένο': { variant: "secondary", text: "Ολοκληρωμένο" },
    'Σε Καθυστέρηση': { variant: "destructive", text: "Σε Καθυστέρηση" },
    'Απέτυχε': { variant: "destructive", text: "Απέτυχε", icon: <XCircle className="h-4 w-4" /> },
  } as const;

  let currentStageStatus = stage.status;
  const deadlineDate = stage?.deadline ? new Date(stage.deadline) : null;
  const isOverdue = isClient && deadlineDate ? isPast(deadlineDate) && stage.status !== 'Ολοκληρωμένο' : false;

  if(isOverdue && stage.status === 'Σε Εξέλιξη') {
    currentStageStatus = 'Σε Καθυστέρηση';
  }

  const currentStatus = statusConfig[currentStageStatus];
  const daysUntilDeadline = isClient && deadlineDate ? differenceInDays(deadlineDate, new Date()) : 0;
  const isApproaching = isClient && deadlineDate ? daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && stage.status !== 'Ολοκληρωμένο' : false;

  const assignee = contacts.find(c => c.id === stage.assigneeContactId);

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow")}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-base font-semibold flex-1">
                {stage.title}
            </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                {stage.status === 'Δεν έχει ξεκινήσει' && (
                    <form action={updateStageStatusAction} ref={formRefStart}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <input type="hidden" name="stageId" value={stage.id} />
                        <input type="hidden" name="status" value="Σε Εξέλιξη" />
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); formRefStart.current?.requestSubmit(); }}>
                            <Play className="mr-2 h-4 w-4" />
                            <span>Έναρξη Εργασιών</span>
                        </DropdownMenuItem>
                    </form>
                )}

                {(stage.status === 'Σε Εξέλιξη' || stage.status === 'Σε Καθυστέρηση') && (
                    <>
                        <form action={updateStageStatusAction} ref={formRefComplete}>
                            <input type="hidden" name="projectId" value={project.id} />
                            <input type="hidden" name="stageId" value={stage.id} />
                            <input type="hidden" name="status" value="Ολοκληρωμένο" />
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); formRefComplete.current?.requestSubmit(); }}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Ολοκλήρωση Σταδίου</span>
                            </DropdownMenuItem>
                        </form>
                        <form action={updateStageStatusAction} ref={formRefFail}>
                            <input type="hidden" name="projectId" value={project.id} />
                            <input type="hidden" name="stageId" value={stage.id} />
                            <input type="hidden" name="status" value="Απέτυχε" />
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); formRefFail.current?.requestSubmit(); }} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Σήμανση ως Αποτυχημένο</span>
                            </DropdownMenuItem>
                        </form>
                    </>
                )}

                {(stage.status === 'Ολοκληρωμένο' || stage.status === 'Απέτυχε') && (
                    <form action={updateStageStatusAction} ref={formRefRestart}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <input type="hidden" name="stageId" value={stage.id} />
                        <input type="hidden" name="status" value="Σε Εξέλιξη" />
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); formRefRestart.current?.requestSubmit(); }}>
                            <Undo2 className="mr-2 h-4 w-4" />
                            <span>Επανέναρξη Εργασιών</span>
                        </DropdownMenuItem>
                    </form>
                )}
              <DropdownMenuSeparator />
              <form action={moveStageAction} ref={formRefUp} className="w-full">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="interventionMasterId" value={interventionMasterId} />
                <input type="hidden" name="stageId" value={stage.id} />
                <input type="hidden" name="direction" value="up" />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); formRefUp.current?.requestSubmit(); }} disabled={!canMoveUp}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    <span>Μετακίνηση Πάνω</span>
                </DropdownMenuItem>
              </form>
              <form action={moveStageAction} ref={formRefDown} className="w-full">
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="interventionMasterId" value={interventionMasterId} />
                <input type="hidden" name="stageId" value={stage.id} />
                <input type="hidden" name="direction" value="down" />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); formRefDown.current?.requestSubmit(); }} disabled={!canMoveDown}>
                  <ArrowDown className="mr-2 h-4 w-4" />
                  <span>Μετακίνηση Κάτω</span>
                </DropdownMenuItem>
              </form>
              <DropdownMenuSeparator />
              <EditStageDialog 
                stage={stage} 
                projectId={project.id} 
                interventionName={interventionName}
                interventionMasterId={interventionMasterId} 
                contacts={contacts}
              >
                 <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Επεξεργασία Σταδίου</span>
                </div>
              </EditStageDialog>
               <DeleteStageDialog stage={stage} projectId={project.id}>
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive w-full">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Διαγραφή Σταδίου</span>
                    </div>
                </DeleteStageDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge variant={currentStatus.variant} className="capitalize">{currentStatus.text}</Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2 text-sm text-muted-foreground">
        {assignee && (
            <div className="flex items-center gap-2 text-foreground">
                <User className="h-4 w-4"/>
                <span>{assignee.firstName} {assignee.lastName}</span>
            </div>
        )}
        <div className={cn("flex items-center gap-2", {
            'text-destructive': isOverdue,
            'font-bold text-foreground': isApproaching && !isOverdue,
        })}>
            <Calendar className="h-4 w-4"/>
            <span>Λήξη: {isClient && deadlineDate ? format(deadlineDate, 'dd MMM, yyyy') : "..."}</span>
        </div>
        <div className="flex items-center gap-2">
            <Clock className="h-4 w-4"/>
            <span>Ενημέρωση: {isClient && stage.lastUpdated ? format(new Date(stage.lastUpdated), 'dd MMM, yyyy') : "..."}</span>
        </div>
      </CardContent>
    </Card>
  );
}
