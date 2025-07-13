
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project, Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Printer } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

interface WorkOrderViewProps {
  project: Project;
  contacts: Contact[];
}

export function WorkOrderView({ project, contacts }: WorkOrderViewProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const owner = contacts.find(c => c.id === project.ownerContactId);

    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    return (
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background print:bg-white">
            <div className="flex items-center justify-between gap-4 print:hidden">
                <Button variant="outline" asChild>
                    <Link href={`/project/${project.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Επιστροφή στο Έργο
                    </Link>
                </Button>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Εκτύπωση
                </Button>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader className="border-b">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Αναφορά Εργασιών</p>
                            <CardTitle className="text-2xl mt-1">{project.name}</CardTitle>
                        </div>
                        <div className="text-sm text-muted-foreground md:text-right">
                            <p className="font-semibold text-foreground">{owner ? `${owner.firstName} ${owner.lastName}` : 'N/A'}</p>
                            <p>{owner?.company}</p>
                            <p>{project.applicationNumber ? `Αρ. Αίτησης: ${project.applicationNumber}` : ''}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/3">Παρέμβαση / Στάδιο</TableHead>
                                <TableHead>Υπεύθυνος</TableHead>
                                <TableHead>Προθεσμία</TableHead>
                                <TableHead>Κατάσταση</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {project.interventions.map((intervention) => (
                                <React.Fragment key={intervention.id}>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableCell colSpan={4} className="font-bold">
                                            {intervention.name}
                                        </TableCell>
                                    </TableRow>
                                    {intervention.stages.map((stage) => {
                                        const assignee = contacts.find(c => c.id === stage.assigneeContactId);
                                        return (
                                            <TableRow key={stage.id}>
                                                <TableCell className="pl-8">{stage.title}</TableCell>
                                                <TableCell>{assignee ? `${assignee.firstName} ${assignee.lastName}` : '-'}</TableCell>
                                                <TableCell>{isClient ? format(new Date(stage.deadline), "dd/MM/yyyy") : '...'}</TableCell>
                                                <TableCell><Badge variant="outline">{stage.status}</Badge></TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {intervention.stages.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground pl-8">
                                                Δεν υπάρχουν στάδια για αυτή την παρέμβαση.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                             {project.interventions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                        Δεν υπάρχουν παρεμβάσεις για αυτό το έργο.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}
