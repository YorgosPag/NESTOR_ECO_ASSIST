
"use server";

import type { Project, StageStatus, Trigger } from '@/types';
import { firestore } from "firebase-admin";
import { users } from '@/lib/data-helpers';
import { isPast } from 'date-fns';
import { getTriggers } from './triggers-data';

// Helper function to serialize Firestore Timestamps
function serializeObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof firestore.Timestamp) {
        return obj.toDate().toISOString();
    }

    if (Array.isArray(obj)) {
        return obj.map(serializeObject);
    }

    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = serializeObject(obj[key]);
        }
    }
    return newObj;
}

// Centralized function to calculate and update project metrics
async function updateProjectMetrics(db: firestore.Firestore, projectId: string): Promise<Project> {
    const project = await getProjectById(db, projectId);
    if (!project) throw new Error("Project not found for metrics update");

    let totalStages = 0;
    let completedStages = 0;
    let overdueStages = 0;

    project.interventions?.forEach(intervention => {
        if (intervention.stages) {
            totalStages += intervention.stages.length;
            intervention.stages.forEach(stage => {
                if (stage.status === 'Ολοκληρωμένο') {
                    completedStages++;
                } else if (stage.status !== 'Ολοκληρωμένο' && stage.deadline && isPast(new Date(stage.deadline))) {
                    overdueStages++;
                }
            });
        }
    });

    const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
    
    let status: Project['status'] = project.status;
    if (status !== 'Προσφορά' && status !== 'Ολοκληρωμένο') {
        if (progress === 100 && totalStages > 0) {
            status = 'Ολοκληρωμένο';
        } else if (overdueStages > 0) {
            status = 'Σε Καθυστέρηση';
        } else {
            status = 'Εντός Χρονοδιαγράμματος';
        }
    }

    project.progress = progress;
    project.status = status;
    project.alerts = overdueStages;

    await updateProject(db, project);
    return project;
}

// Centralized function to add an audit log entry
export async function addAuditLog(db: firestore.Firestore, projectId: string, action: string, details: string) {
    const projectRef = db.collection('projects').doc(projectId);
    const newLog = {
        id: `log-${Date.now()}`,
        user: users[0],
        action,
        timestamp: new Date().toISOString(),
        details,
    };
    
    const project = await getProjectById(db, projectId);
    if (project) {
        const auditLog = project.auditLog || [];
        auditLog.unshift(newLog);
        await projectRef.update({ auditLog });
    }
}


export async function getProjectById(db: firestore.Firestore, id: string): Promise<Project | undefined> {
    const projectsCollection = db.collection('projects');
    const doc = await projectsCollection.doc(id).get();
    if (!doc.exists) {
        return undefined;
    }
    const projectData = { id: doc.id, ...doc.data() } as Project;
    return serializeObject(projectData);
};

export async function getAllProjects(db: firestore.Firestore): Promise<Project[]> {
    const projectsCollection = db.collection('projects');
    const snapshot = await projectsCollection.orderBy('name').get();
    if (snapshot.empty) {
        return [];
    }
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    return serializeObject(projects);
};
 
export async function addProject(db: firestore.Firestore, project: Omit<Project, 'id' | 'progress' | 'alerts' | 'budget'>) {
    const projectsCollection = db.collection('projects');
    const docRef = await projectsCollection.add(project);
    return docRef.id;
};
 
export async function updateProject(db: firestore.Firestore, project: Project) {
    const { id, ...projectData } = project;
    const projectsCollection = db.collection('projects');
    try {
        await projectsCollection.doc(id).set(projectData, { merge: true });
        return true;
    } catch(error) {
        console.error("Error updating project:", error);
        return false;
    }
};
 
export async function deleteProject(db: firestore.Firestore, id: string): Promise<boolean> {
    const projectsCollection = db.collection('projects');
    try {
        await projectsCollection.doc(id).delete();
        return true;
    } catch (error) {
        console.error("Error deleting project:", error);
        return false;
    }
};
 
export async function findInterventionAndStage(db: firestore.Firestore, projectId: string, stageId: string) {
    const project = await getProjectById(db, projectId);
    if (!project) return null;

    for (const intervention of project.interventions) {
        const stage = intervention.stages.find(s => s.id === stageId);
        if (stage) {
            return { project, intervention, stage };
        }
    }
    return null;
};
 
export async function updateStageStatus(db: firestore.Firestore, projectId: string, stageId: string, status: StageStatus): Promise<boolean> {
    const findResult = await findInterventionAndStage(db, projectId, stageId);
    if (!findResult) return false;

    const { project, intervention, stage } = findResult;

    if (stage.status === status) return true; // No change
    
    const oldStatus = stage.status;
    stage.status = status;
    stage.lastUpdated = new Date().toISOString();

    // Log the status change
    await addAuditLog(db, projectId, 'Ενημέρωση Κατάστασης Σταδίου', `Το στάδιο "${stage.title}" άλλαξε από "${oldStatus}" σε "${status}".`);

    // If stage is completed, check for triggers
    if (status === 'Ολοκληρωμένο') {
        const triggers: Trigger[] = await getTriggers(db);
        const matchedTrigger = triggers.find(t => t.code === intervention.code);
        if (matchedTrigger) {
            await addAuditLog(db, projectId, 'Ενεργοποίηση Trigger', `Ολοκληρώθηκε το στάδιο "${stage.title}" και ενεργοποιήθηκε το trigger: "${matchedTrigger.name}"`);
        }
    }

    await updateProject(db, project);
    await updateProjectMetrics(db, projectId);

    return true;
}
