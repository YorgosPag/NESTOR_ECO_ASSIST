'use client';

import type { Project } from "@/types";
import { isPast } from 'date-fns';

export function calculateClientProjectMetrics(project: Project): Project {
    if (!project || !project.stages) {
        return project;
    }

    let totalStages = 0;
    let completedStages = 0;
    let overdueStages = 0;

    if (project.stages) {
        totalStages += project.stages.length;
        project.stages.forEach(stage => {
            if (stage.status === 'Completed') {
                completedStages++;
            } else if (stage.status !== 'Delayed') { // Assuming 'failed' is not a status, but if so, it should be handled.
                if (isPast(new Date(stage.deadline))) {
                    overdueStages++;
                }
            }
        });
    }


    const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
    
    let status: Project['status'] = project.status;
    if (status !== 'On Hold' && status !== 'Completed') {
        if (progress === 100 && totalStages > 0) {
            status = 'Completed';
        } else if (overdueStages > 0) {
            status = 'At Risk';
        } else {
            status = 'On Track';
        }
    }

    return {
        ...project,
        progress,
        status,
        // The type definition for Project does not have alerts, so I am commenting this out.
        // alerts: overdueStages, 
    };
}
