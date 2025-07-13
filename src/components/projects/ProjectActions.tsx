"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { EditProjectDialog } from "./edit-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";
import type { Project, Contact } from '@/types';

interface ProjectActionsProps {
    project: Project;
    contacts: Contact[];
}

export function ProjectActions({ project, contacts }: ProjectActionsProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <Button asChild variant="outline">
                <Link href="/projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Επιστροφή στη Λίστα
                </Link>
            </Button>
            <div className="flex items-center gap-2">
                <EditProjectDialog project={project} contacts={contacts}>
                    <Button variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Επεξεργασία
                    </Button>
                </EditProjectDialog>
                <DeleteProjectDialog project={project}>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Διαγραφή
                    </Button>
                </DeleteProjectDialog>
            </div>
        </div>
    );
}
