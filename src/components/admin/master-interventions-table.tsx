"use client";

import type { MasterIntervention } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MasterInterventionsTableProps {
  interventions: MasterIntervention[];
}

export function MasterInterventionsTable({ interventions }: MasterInterventionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Βιβλιοθήκη Παρεμβάσεων</CardTitle>
                <CardDescription>
                Διαχειριστείτε τους βασικούς τύπους παρεμβάσεων που είναι διαθέσιμοι στα έργα.
                </CardDescription>
            </div>
            <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Νέα Παρέμβαση
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Όνομα Παρέμβασης</TableHead>
                    <TableHead>Περιγραφή</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {interventions.map((intervention) => (
                    <TableRow key={intervention.id}>
                        <TableCell className="font-medium">{intervention.name}</TableCell>
                        <TableCell className="text-muted-foreground">{intervention.description}</TableCell>
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ενέργειες</DropdownMenuLabel>
                            <DropdownMenuItem>Επεξεργασία</DropdownMenuItem>
                            <DropdownMenuItem>Διαγραφή</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
