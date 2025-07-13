// src/components/projects/sub-interventions-table.tsx
"use client";

import type { Project, ProjectIntervention, SubIntervention, CustomList, CustomListItem } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddSubInterventionDialog } from "./add-sub-intervention-dialog";
import { useMemo, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditSubInterventionDialog } from "./edit-sub-intervention-dialog";
import { DeleteSubInterventionDialog } from "./delete-sub-intervention-dialog";
import { moveSubInterventionAction } from "@/app/actions/projects";

const MoveButton = ({ direction, disabled, onClick }: { direction: 'up' | 'down', disabled: boolean, onClick: () => void }) => {
    const [isPending, startTransition] = useTransition();

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            disabled={disabled || isPending}
            onClick={() => startTransition(onClick)}
        >
            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : (
                direction === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
            )}
        </Button>
    )
}

interface SubInterventionsTableProps {
  project: Project;
  intervention: ProjectIntervention;
  customLists: CustomList[];
  customListItems: CustomListItem[];
}

export function SubInterventionsTable({ project, intervention, customLists, customListItems }: SubInterventionsTableProps) {
  const { subInterventions = [] } = intervention;

  const totals = useMemo(() => {
    return subInterventions.reduce(
      (acc, curr) => {
        acc.cost += curr.cost || 0;
        acc.costOfMaterials += curr.costOfMaterials || 0;
        acc.costOfLabor += curr.costOfLabor || 0;
        return acc;
      },
      { cost: 0, costOfMaterials: 0, costOfLabor: 0 }
    );
  }, [subInterventions]);

  const handleMove = (subInterventionId: string, direction: 'up' | 'down') => {
    const formData = new FormData();
    formData.append('projectId', project.id);
    formData.append('interventionMasterId', intervention.masterId);
    formData.append('subInterventionId', subInterventionId);
    formData.append('direction', direction);
    moveSubInterventionAction(formData);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Κωδικός</TableHead>
              <TableHead>Περιγραφή</TableHead>
              <TableHead className="text-right">Ποσότητα</TableHead>
              <TableHead className="text-right">Κόστος</TableHead>
              <TableHead className="text-right">Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subInterventions.length > 0 ? (
              subInterventions.map((sub, index) => (
                <TableRow key={sub.id}>
                  <TableCell className="p-1 pr-2 align-middle">
                     <div className="flex flex-col items-center">
                        <MoveButton direction="up" disabled={index === 0} onClick={() => handleMove(sub.id, 'up')} />
                        <MoveButton direction="down" disabled={index === subInterventions.length - 1} onClick={() => handleMove(sub.id, 'down')} />
                     </div>
                  </TableCell>
                  <TableCell>{sub.subcategoryCode}</TableCell>
                  <TableCell className="font-medium">{sub.description}</TableCell>
                  <TableCell className="text-right">
                    {sub.quantity ? `${sub.quantity} ${sub.quantityUnit || ''}`.trim() : '-'}
                  </TableCell>
                  <TableCell className="text-right font-mono">{sub.cost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <EditSubInterventionDialog
                          project={project}
                          intervention={intervention}
                          subIntervention={sub}
                          customLists={customLists}
                          customListItems={customListItems}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Επεξεργασία
                          </DropdownMenuItem>
                        </EditSubInterventionDialog>
                        <DeleteSubInterventionDialog 
                          project={project} 
                          intervention={intervention} 
                          subIntervention={sub}
                        >
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Διαγραφή
                            </DropdownMenuItem>
                        </DeleteSubInterventionDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Δεν υπάρχουν υπο-παρεμβάσεις ακόμη.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
             <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={4}>Σύνολα Κόστους</TableCell>
                <TableCell className="text-right font-mono">{totals.cost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableCell>
                <TableCell></TableCell>
             </TableRow>
          </TableFooter>
        </Table>
      </div>
      <AddSubInterventionDialog project={project} intervention={intervention} customLists={customLists} customListItems={customListItems}>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Προσθήκη Υπο-Παρέμβασης
        </Button>
      </AddSubInterventionDialog>
    </div>
  );
}
