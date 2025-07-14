

"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, FileText, Rocket } from "lucide-react";
import { EditProjectDialog } from "./edit-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { useActionState } from 'react';
import { activateProjectAction } from '@/app/actions/projects';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import type { Project, Contact } from '@/types';

function ActivateProjectButton({ projectId }: { projectId: string }) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(activateProjectAction, { success: false, message: null });

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({ title: "Επιτυχία!", description: state.message });
            } else {
                toast({ variant: "destructive", title: "Σφάλμα", description: state.message });
            }
        }
    }, [state, toast]);

    return (
        <form action={formAction}>
            <input type="hidden" name="projectId" value={projectId} />
            <Button type="submit" className="w-full sm:w-auto">
                <Rocket className="mr-2 h-4 w-4" />
                Ενεργοποίηση Έργου
            </Button>
        </form>
    );
}

interface ProjectDetailsActionsProps {
    project: Project;
    contacts: Contact[];
}

export function ProjectDetailsActions({ project, contacts }: ProjectDetailsActionsProps) {
    const isQuotation = project.status === 'Προσφορά';
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
             <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Επιστροφή
                </Link>
            </Button>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                {!isQuotation && (
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href={`/project/${project.id}/work-order`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Αναφορά Εργ.
                        </Link>
                    </Button>
                )}
                 {isQuotation && <ActivateProjectButton projectId={project.id} />}
                <EditProjectDialog project={project} contacts={contacts}>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Pencil className="mr-2 h-4 w-4" />
                        Επεξεργασία
                    </Button>
                </EditProjectDialog>
                <DeleteProjectDialog project={project}>
                    <Button variant="destructive" className="w-full sm:w-auto">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Διαγραφή
                    </Button>
                </DeleteProjectDialog>
            </div>
        </div>
    );
}
