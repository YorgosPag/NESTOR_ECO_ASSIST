"use client";

import type { Project } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ProjectAlertsProps {
    project: Project;
}

export function ProjectAlerts({ project }: ProjectAlertsProps) {
    if (project.status === 'Delayed' && project.alerts > 0) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Προσοχή Απαιτείται</AlertTitle>
                <AlertDescription>
                    Αυτό το έργο έχει {project.alerts} στάδι{project.alerts > 1 ? 'α' : 'ο'} που έχει καθυστερήσει. Παρακαλούμε ελέγξτε τις προθεσμίες.
                </AlertDescription>
            </Alert>
        );
    }
    
    return null;
}
