
"use server";

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { Project, Stage, StageStatus } from '@/types';
import { getAdminDb } from "@/lib/firebase-admin";
import { users } from '@/lib/data-helpers';
import { 
    getProjectById as getProjectDataById, 
    updateProject as updateProjectData,
    addProject as addProjectData,
    deleteProject as deleteProjectData,
    findInterventionAndStage as findInterventionAndStageData,
} from '@/lib/projects-data';

const CreateProjectSchema = z.object({
    name: z.string({invalid_type_error: "Παρακαλώ εισάγετε έναν έγκυρο τίτλο."}).min(1, "Ο τίτλος του έργου είναι υποχρεωτικός."),
    description: z.string().min(1, "Η περιγραφή είναι υποχρεωτική."),
    applicationNumber: z.string().optional(),
    ownerContactId: z.string().min(1, "Παρακαλώ επιλέξτε έναν ιδιοκτήτη."),
    deadline: z.string().optional(),
});

export async function createProjectAction(prevState: any, formData: FormData) {
    try {
        const validatedFields = CreateProjectSchema.safeParse({
            name: formData.get('name'),
            description: formData.get('description'),
            applicationNumber: formData.get('applicationNumber'),
            ownerContactId: formData.get('ownerContactId'),
            deadline: formData.get('deadline'),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία με σφάλμα και προσπαθήστε ξανά.',
                success: false,
            };
        }

        const { name, description, applicationNumber, ownerContactId, deadline } = validatedFields.data;
        const db = getAdminDb();

        const newProject: Omit<Project, 'id'> = {
            name,
            description,
            applicationNumber,
            ownerContactId,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            status: 'Quotation',
            interventions: [],
            progress: 0,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            auditLog: [
                {
                    id: `log-${Date.now()}`,
                    user: users[0], 
                    action: 'Δημιουργία Προσφοράς',
                    timestamp: new Date().toISOString(),
                    details: `Το έργο "${name}" δημιουργήθηκε σε φάση προσφοράς.`
                }
            ],
        };
        
        await addProjectData(db, newProject);

    } catch (error: any) {
        console.error("🔥 ERROR in createProjectAction:", error);
        return { message: `Σφάλμα Βάσης Δεδομένων: ${error.message}`, success: false };
    }

    revalidatePath('/projects');
    redirect('/projects');
}

const UpdateProjectSchema = z.object({
    id: z.string().min(1, "Το ID του έργου είναι απαραίτητο."),
    name: z.string({invalid_type_error: "Παρακαλώ εισάγετε έναν έγκυρο τίτλο."}).min(3, "Ο τίτλος του έργου πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
    applicationNumber: z.string().optional(),
    ownerContactId: z.string().min(1, "Παρακαλώ επιλέξτε έναν ιδιοκτήτη."),
    deadline: z.string().optional(),
});

export async function updateProjectAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateProjectSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        applicationNumber: formData.get('applicationNumber'),
        ownerContactId: formData.get('ownerContactId'),
        deadline: formData.get('deadline'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }
    const { id, ...projectData } = validatedFields.data;
     const updateData = {
        ...projectData,
        deadline: projectData.deadline ? new Date(projectData.deadline).toISOString() : '',
     };

    try {
        const db = getAdminDb();
        const project = await getProjectDataById(db, id);
        if (!project) {
            throw new Error("Το έργο δεν βρέθηκε για ενημέρωση.");
        }
        
        await updateProjectData(db, { ...project, ...updateData });

    } catch (error: any) {
        console.error("🔥 ERROR in updateProjectAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/project/${id}`);
    return { success: true, message: 'Το έργο ενημερώθηκε με επιτυχία.' };
}

const ActivateProjectSchema = z.object({
    projectId: z.string().min(1),
});

export async function activateProjectAction(prevState: any, formData: FormData) {
    const validatedFields = ActivateProjectSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρο ID έργου.' };
    }
    const { projectId } = validatedFields.data;

    try {
        const db = getAdminDb();
        
        const project = await getProjectDataById(db, projectId);
        if (!project) {
            throw new Error("Το έργο δεν βρέθηκε.");
        }
        
        const auditLog = project.auditLog || [];
        auditLog.unshift({
            id: `log-${Date.now()}`,
            user: users[0],
            action: 'Ενεργοποίηση Έργου',
            timestamp: new Date().toISOString(),
            details: 'Η κατάσταση του έργου άλλαξε από "Προσφορά" σε "Εντός Χρονοδιαγράμματος".',
        });

        project.status = 'On Track';
        project.auditLog = auditLog;

        await updateProjectData(db, project);

    } catch (error: any) {
        console.error("🔥 ERROR in activateProjectAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath(`/project/${projectId}`);
    revalidatePath(`/projects`);
    revalidatePath(`/dashboard`);
    return { success: true, message: 'Το έργο ενεργοποιήθηκε με επιτυχία.' };
}

const DeleteProjectSchema = z.object({
    id: z.string().min(1),
});

export async function deleteProjectAction(prevState: any, formData: FormData) {
    try {
        const validatedFields = DeleteProjectSchema.safeParse({
            id: formData.get('id'),
        });

        if (!validatedFields.success) {
            return { success: false, message: 'Μη έγκυρα δεδομένα.' };
        }
        
        const db = getAdminDb();
        await deleteProjectData(db, validatedFields.data.id);
    } catch (error: any) {
        console.error("🔥 ERROR in deleteProjectAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath('/projects');
    redirect('/projects');
}

const AddStageSchema = z.object({
    projectId: z.string(),
    interventionMasterId: z.string(),
    title: z.string().min(1, 'Ο τίτλος είναι υποχρεωτικός.'),
    deadline: z.string().min(1, 'Η προθεσμία είναι υποχρεωτική.'),
    notes: z.string().optional(),
    assigneeContactId: z.string().optional(),
});

export async function addStageAction(prevState: any, formData: FormData) {
    const validatedFields = AddStageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }
    const { projectId, interventionMasterId } = validatedFields.data;

    try {
        const db = getAdminDb();
        const project = await getProjectDataById(db, projectId);
        if (!project) throw new Error('Project not found');

        const intervention = project.interventions.find(i => i.masterInterventionId === interventionMasterId);
        if (!intervention) throw new Error('Intervention not found');
        
        const { title, deadline, notes, assigneeContactId } = validatedFields.data;

        const newStage: Stage = {
            id: `stage-${Date.now()}`,
            title,
            status: 'Not Started',
            deadline: new Date(deadline).toISOString(),
            lastUpdated: new Date().toISOString(),
            files: [],
            notes: notes || undefined,
            assigneeContactId: assigneeContactId && assigneeContactId !== 'none' ? assigneeContactId : undefined,
        };

        intervention.stages.push(newStage);

        project.auditLog.unshift({
            id: `log-${Date.now()}`,
            user: users[0],
            action: 'Προσθήκη Σταδίου',
            timestamp: new Date().toISOString(),
            details: `Προστέθηκε το στάδιο "${title}" στην παρέμβαση "${intervention.name}".`,
        });
        
        await updateProjectData(db, project);

    } catch (error: any) {
        console.error("🔥 ERROR in addStageAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath(`/project/${projectId}`);
    return { success: true, message: 'Το στάδιο προστέθηκε με επιτυχία.' };
}

const UpdateStageSchema = AddStageSchema.extend({
  stageId: z.string(),
});

export async function updateStageAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateStageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }
    const { projectId, stageId, interventionMasterId } = validatedFields.data;

    try {
        const db = getAdminDb();
        const project = await getProjectDataById(db, projectId);
        if (!project) throw new Error('Project not found');

        const intervention = project.interventions.find(i => i.masterInterventionId === interventionMasterId);
        if (!intervention) throw new Error('Intervention not found for stage update');
        
        const stage = intervention.stages.find(s => s.id === stageId);
        if (!stage) throw new Error('Stage not found');
        
        const { title, deadline, notes, assigneeContactId } = validatedFields.data;
        
        stage.title = title;
        stage.deadline = new Date(deadline).toISOString();
        stage.notes = notes || undefined;
        stage.assigneeContactId = assigneeContactId && assigneeContactId !== 'none' ? assigneeContactId : undefined;
        stage.lastUpdated = new Date().toISOString();

        project.auditLog.unshift({
            id: `log-${Date.now()}`,
            user: users[0],
            action: 'Επεξεργασία Σταδίου',
            timestamp: new Date().toISOString(),
            details: `Επεξεργάστηκε το στάδιο "${title}" στην παρέμβαση "${intervention.name}".`,
        });

        await updateProjectData(db, project);

    } catch (error: any) {
        console.error("🔥 ERROR in updateStageAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath(`/project/${projectId}`);
    return { success: true, message: 'Το στάδιο ενημερώθηκε με επιτυχία.' };
}

const DeleteStageSchema = z.object({
  projectId: z.string(),
  stageId: z.string(),
});

export async function deleteStageAction(prevState: any, formData: FormData) {
    const validatedFields = DeleteStageSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { success: false, message: 'Μη έγκυρα δεδομένα.' };
    }
    const { projectId, stageId } = validatedFields.data;

    try {
        const db = getAdminDb();
        const project = await getProjectDataById(db, projectId);
        if (!project) throw new Error('Project not found');

        let interventionContainingStage = null;
        let stageToDelete = null;
        
        for (const intervention of project.interventions) {
            const foundStage = intervention.stages.find(s => s.id === stageId);
            if (foundStage) {
                interventionContainingStage = intervention;
                stageToDelete = foundStage;
                break;
            }
        }

        if (!interventionContainingStage || !stageToDelete) {
             throw new Error('Stage or intervention not found');
        }
        
        const stageIndex = interventionContainingStage.stages.findIndex(s => s.id === stageId);
        if (stageIndex === -1) throw new Error('Stage index not found in intervention');

        interventionContainingStage.stages.splice(stageIndex, 1);
        
        project.auditLog.unshift({
            id: `log-${Date.now()}`,
            user: users[0],
            action: 'Διαγραφή Σταδίου',
            timestamp: new Date().toISOString(),
            details: `Διαγράφηκε το στάδιο "${stageToDelete.title}" από την παρέμβαση "${interventionContainingStage.name}".`,
        });

        await updateProjectData(db, project);

    } catch (error: any) {
        console.error("🔥 ERROR in deleteStageAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath(`/project/${projectId}`);
    return { success: true, message: 'Το στάδιο διαγράφηκε με επιτυχία.' };
}

const UpdateStageStatusSchema = z.object({
  projectId: z.string(),
  stageId: z.string(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'Delayed', 'Failed']),
});

export async function updateStageStatusAction(formData: FormData) {
    const validatedFields = UpdateStageStatusSchema.safeParse({
        projectId: formData.get('projectId'),
        stageId: formData.get('stageId'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        console.error("Validation failed for updating stage status:", validatedFields.error.flatten().fieldErrors);
        return;
    }

    const { projectId, stageId, status } = validatedFields.data;
    
    const db = getAdminDb();
    try {
        const project = await getProjectDataById(db, projectId);
        if (project) {
            let stageFound = false;
            for (const intervention of project.interventions) {
                const stage = intervention.stages.find(s => s.id === stageId);
                if (stage) {
                    stage.status = status;
                    stage.lastUpdated = new Date().toISOString();
                    stageFound = true;
                    break;
                }
            }
            if (stageFound) {
                await updateProjectData(db, project);
            }
        }
    } catch (error) {
        console.error("Database error while updating stage status", error);
    }
    
    revalidatePath(`/project/${projectId}`);
}


const MoveStageSchema = z.object({
  projectId: z.string(),
  stageId: z.string(),
  interventionMasterId: z.string(),
  direction: z.enum(['up', 'down']),
});

export async function moveStageAction(formData: FormData) {
    const validatedFields = MoveStageSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        console.error("Validation failed for moving stage:", validatedFields.error.flatten().fieldErrors);
        return;
    }

    const { projectId, interventionMasterId, stageId, direction } = validatedFields.data;
    try {
        const db = getAdminDb();
        const project = await getProjectDataById(db, projectId);
        if (!project) throw new Error('Project not found');

        const intervention = project.interventions.find(i => i.masterInterventionId === interventionMasterId);
        if (!intervention) throw new Error('Intervention not found');

        const stages = intervention.stages;
        const fromIndex = stages.findIndex(s => s.id === stageId);
        if (fromIndex === -1) throw new Error('Stage not found');
        
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

        if (toIndex >= 0 && toIndex < stages.length) {
            const [movedStage] = stages.splice(fromIndex, 1);
            stages.splice(toIndex, 0, movedStage);
        } else {
            return;
        }
        
        await updateProjectData(db, project);

    } catch (error: any) {
        console.error("🔥 ERROR in moveStageAction:", error);
    }

    revalidatePath(`/project/${projectId}`);
}

const AddInterventionSchema = z.object({
  projectId: z.string(),
  interventionName: z.string().min(1, { message: 'Please select an intervention type.' }),
});

export type AddInterventionState = {
  errors?: {
    interventionName?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function addInterventionAction(prevState: AddInterventionState, formData: FormData) {
  const validatedFields = AddInterventionSchema.safeParse({
    projectId: formData.get('projectId'),
    interventionName: formData.get('interventionName'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please select an intervention.',
      success: false,
    };
  }
  
  const { projectId, interventionName } = validatedFields.data;
  const db = getAdminDb();

  try {
    const project = await getProjectDataById(db, projectId);

    if (!project) {
        return { message: 'Project not found.', success: false };
    }

    const newIntervention = {
        id: `inter-${new Date().getTime()}`,
        masterInterventionId: `master-int-${new Date().getTime()}`,
        projectId: projectId,
        interventionCategory: 'Uncategorized',
        interventionSubcategory: interventionName,
        name: interventionName,
        stages: [],
        costOfMaterials: 0,
        costOfLabor: 0,
        totalCost: 0,
    };

    project.interventions.push(newIntervention);
    
    await updateProjectData(db, project);

  } catch (error) {
    console.error('Error adding intervention:', error);
    return { message: 'Database error: Could not add intervention.', success: false };
  }
  
  revalidatePath(`/project/${projectId}`);

  return { message: 'Intervention added successfully.', success: true };
}


const DeleteInterventionSchema = z.object({
  projectId: z.string(),
  interventionId: z.string(),
});

export type DeleteInterventionState = {
  message?: string | null;
  success?: boolean;
};


export async function deleteInterventionAction(prevState: DeleteInterventionState, formData: FormData) {
  const validatedFields = DeleteInterventionSchema.safeParse({
    projectId: formData.get('projectId'),
    interventionId: formData.get('interventionId'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Invalid data provided.',
      success: false,
    };
  }

  const { projectId, interventionId } = validatedFields.data;
  const db = getAdminDb();

  try {
    const project = await getProjectDataById(db, projectId);

    if (!project) {
        return { message: 'Project not found.', success: false };
    }

    project.interventions = project.interventions.filter(
      (intervention) => intervention.id !== interventionId
    );

    await updateProjectData(db, project);

  } catch (error) {
    console.error('Error deleting intervention:', error);
    return { message: 'Database error: Could not delete intervention.', success: false };
  }

  revalidatePath(`/project/${projectId}`);

  return { message: 'Intervention deleted successfully.', success: true };
}
