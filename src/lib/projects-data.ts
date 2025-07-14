"use server";

import type { Project, StageStatus } from '@/types';
import { firestore } from "firebase-admin";
import { users } from '@/lib/data-helpers';

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
    const project = await getProjectById(db, projectId);
    if (!project) return false;

    let stageUpdated = false;
    let stageTitle = '';
    let interventionTitle = '';

    for (const intervention of project.interventions) {
        const stage = intervention.stages.find(s => s.id === stageId);
        if (stage) {
            stage.status = status;
            stage.lastUpdated = new Date().toISOString();
            stageUpdated = true;
            stageTitle = stage.title;
            interventionTitle = intervention.interventionCategory;
            break;
        }
    }

    if (!stageUpdated) return false;

    project.auditLog?.unshift({
        id: `log-${Date.now()}`,
        user: users[0], 
        action: 'Ενημέρωση Κατάστασης Σταδίου',
        timestamp: new Date().toISOString(),
        details: `Η κατάσταση του σταδίου "${stageTitle}" στην παρέμβαση "${interventionTitle}" άλλαξε σε "${status}".`
    });

    try {
        await updateProject(db, project);
        return true;
    } catch (error) {
        console.error("Error updating stage status:", error);
        return false;
    }
}
