"use client";

import type { Project } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Rocket } from "lucide-react";
import { calculateClientProjectMetrics } from '@/lib/client-utils';
import { useMemo } from 'react';

interface ProjectAlertsProps {
    project: Project;
    isMounted: boolean;
}

export function ProjectAlerts({ project: serverProject, isMounted }: ProjectAlertsProps) {
    const project = useMemo(() => calculateClientProjectMetrics(serverProject, isMounted), [serverProject, isMounted]);

    if (project.status === 'Quotation') {
        return (
             <Alert variant="info" className="mt-4">
                <Rocket className="h-4 w-4" />
                <AlertTitle>Φάση Προσφοράς</AlertTitle>
                <AlertDescription>
                    Αυτό το έργο είναι σε φάση προσφοράς. Μπορείτε να προσθέσετε παρεμβάσεις και να διαμορφώσετε την ανάλυση κόστους.
                    Όταν η προσφορά γίνει αποδεκτή, πατήστε το κουμπί ενεργοποίησης από τις ενέργειες του έργου.
                </AlertDescription>
            </Alert>
        );
    }

    if (project.status === 'Delayed' && project.alerts && project.alerts > 0) {
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
