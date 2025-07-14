"use server";

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getProjectById, updateProject as updateProjectData, addProject as addProjectData, deleteProject as deleteProjectData, findInterventionAndStage as findInterventionAndStageData } from '@/lib/projects-data';
import { getAdminDb } from "@/lib/firebase-admin";
import type { Project, ProjectIntervention, Stage, StageStatus, SubIntervention } from '@/types';
import { users } from '@/lib/data-helpers';
import { redirect } from 'next/navigation';


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
            status: 'Προσφορά',
            interventions: [],
            progress: 0,
            startDate: new Date().toISOString(),
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
    name: z.string({invalid_type_error: "Παρακαλώ εισάγετε έναν έγκυρο τίτλο."}).min(3, "Ο τίτλος του έργου πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
    applicationNumber: z.string().optional(),
    ownerContactId: z.string().min(1, "Παρακαλώ επιλέξτε έναν ιδιοκτήτη."),
    deadline: z.string().optional(),
});

export async function updateProjectAction(prevState: any, formData: FormData) {
    const projectId = formData.get('id') as string;
     if (!projectId) {
        return { success: false, message: 'Το ID του έργου είναι απαραίτητο.' };
    }

    const validatedFields = UpdateProjectSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
        };
    }
    
    try {
        const db = getAdminDb();
        const project = await getProjectById(db, projectId);
        if (!project) {
            throw new Error("Project not found");
        }
        
        const updateData = {
           ...validatedFields.data,
           deadline: validatedFields.data.deadline ? new Date(validatedFields.data.deadline).toISOString() : '',
        };
        
        const updatedProject = {
            ...project,
            ...updateData,
        };
        
        await updateProjectData(db, projectId, updatedProject );

    } catch (error: any) {
        console.error("🔥 ERROR in updateProjectAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/project/${projectId}`);
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
        
        const project = await getProjectById(db, projectId);
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

        project.status = 'Εντός Χρονοδιαγράμματος';
        project.auditLog = auditLog;

        await updateProjectData(db, projectId, project);

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
        const project = await getProjectById(db, projectId);
        if (!project) throw new Error('Project not found');

        const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
        if (!intervention) throw new Error('Intervention not found');
        
        const { title, deadline, notes, assigneeContactId } = validatedFields.data;

        const newStage: Stage = {
            id: `stage-${Date.now()}`,
            title,
            status: 'Δεν έχει ξεκινήσει',
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
            details: `Προστέθηκε το στάδιο "${title}" στην παρέμβαση "${intervention.interventionSubcategory}".`,
        });
        
        await updateProjectData(db, projectId, project);

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
        const project = await getProjectById(db, projectId);
        if (!project) throw new Error('Project not found');

        const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
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
            details: `Επεξεργάστηκε το στάδιο "${title}" στην παρέμβαση "${intervention.interventionSubcategory}".`,
        });

        await updateProjectData(db, projectId, project);

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
        const project = await getProjectById(db, projectId);
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
            details: `Διαγράφηκε το στάδιο "${stageToDelete.title}" από την παρέμβαση "${interventionContainingStage.interventionSubcategory}".`,
        });

        await updateProjectData(db, projectId, project);

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
  status: z.enum(['Δεν έχει ξεκινήσει', 'Σε Εξέλιξη', 'Ολοκληρωμένο', 'Σε Καθυστέρηση', 'Απέτυχε']),
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
        const project = await getProjectById(db, projectId);
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
                await updateProjectData(db, projectId, project);
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
        const project = await getProjectById(db, projectId);
        if (!project) throw new Error('Project not found');

        const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
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
        
        await updateProjectData(db, projectId, project);

    } catch (error: any) {
        console.error("🔥 ERROR in moveStageAction:", error);
    }

    revalidatePath(`/project/${projectId}`);
}

const AddInterventionSchema = z.object({
  projectId: z.string(),
  interventionName: z.string().min(3, "Το όνομα της παρέμβασης πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
});

export async function addInterventionAction(prevState: any, formData: FormData) {
  const validatedFields = AddInterventionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
    };
  }

  const { projectId, interventionName } = validatedFields.data;

  try {
    const db = getAdminDb();
    const project = await getProjectById(db, projectId);
    if (!project) {
      return { success: false, errors: {}, message: 'Σφάλμα: Το έργο δεν βρέθηκε.' };
    }

    const newIntervention: ProjectIntervention = {
      masterId: `${interventionName.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`,
      code: 'CUSTOM',
      expenseCategory: interventionName,
      interventionCategory: interventionName,
      interventionSubcategory: interventionName,
      quantity: 0,
      totalCost: 0,
      costOfMaterials: 0,
      costOfLabor: 0,
      stages: [],
      subInterventions: [],
    };
    
    if (!project.interventions) {
        project.interventions = [];
    }
    project.interventions.push(newIntervention);

    project.auditLog.unshift({
      id: `log-${Date.now()}`,
      user: users[0],
      action: 'Προσθήκη Παρέμβασης',
      timestamp: new Date().toISOString(),
      details: `Προστέθηκε η παρέμβαση: "${interventionName}".`,
    });

    await updateProjectData(db, projectId, project);

  } catch (error: any) {
    console.error("🔥 ERROR in addInterventionAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true, message: 'Η παρέμβαση προστέθηκε με επιτυχία.' };
}

const UpdateInterventionSchema = z.object({
  projectId: z.string(),
  interventionMasterId: z.string(),
  interventionSubcategory: z.string().min(3, "Το όνομα της παρέμβασης πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
});

export async function updateInterventionAction(prevState: any, formData: FormData) {
  const validatedFields = UpdateInterventionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία και προσπαθήστε ξανά.',
    };
  }

  const { projectId } = validatedFields.data;

  try {
    const { interventionMasterId, interventionSubcategory } = validatedFields.data;
    const db = getAdminDb();
    const project = await getProjectById(db, projectId);
    if (!project) {
      return { success: false, errors: {}, message: 'Σφάλμα: Το έργο δεν βρέθηκε.' };
    }

    const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
    if (!intervention) {
      return { success: false, errors: {}, message: 'Σφάλμα: Η παρέμβαση δεν βρέθηκε.' };
    }

    intervention.interventionSubcategory = interventionSubcategory;
    if (intervention.code === 'CUSTOM') {
        intervention.interventionCategory = interventionSubcategory;
        intervention.expenseCategory = interventionSubcategory;
    }


    project.auditLog.unshift({
      id: `log-${Date.now()}`,
      user: users[0],
      action: 'Επεξεργασία Ονόματος Παρέμβασης',
      timestamp: new Date().toISOString(),
      details: `Άλλαξε το όνομα της παρέμβασης σε: "${interventionSubcategory}".`,
    });

    await updateProjectData(db, projectId, project);

  } catch (error: any) {
    console.error("🔥 ERROR in updateInterventionAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true, message: 'Η παρέμβαση ενημερώθηκε με επιτυχία.' };
}

const DeleteInterventionSchema = z.object({
  projectId: z.string(),
  interventionMasterId: z.string(),
});

export async function deleteInterventionAction(prevState: any, formData: FormData) {
  const validatedFields = DeleteInterventionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: 'Μη έγκυρα δεδομένα.' };
  }
  const { projectId } = validatedFields.data;

  try {
    const { interventionMasterId } = validatedFields.data;
    const db = getAdminDb();
    const project = await getProjectById(db, projectId);
    if (!project) {
      return { success: false, message: 'Σφάλμα: Το έργο δεν βρέθηκε.' };
    }

    const interventionIndex = project.interventions.findIndex(i => i.masterId === interventionMasterId);
    if (interventionIndex === -1) {
      return { success: false, message: 'Σφάλμα: Η παρέμβαση δεν βρέθηκε.' };
    }

    const intervention = project.interventions[interventionIndex];
    
    project.interventions.splice(interventionIndex, 1);
    
    project.auditLog.unshift({
      id: `log-${Date.now()}`,
      user: users[0],
      action: 'Διαγραφή Παρέμβασης',
      timestamp: new Date().toISOString(),
      details: `Διαγράφηκε: "${intervention.interventionCategory}".`,
    });
    
    await updateProjectData(db, projectId, project);
  } catch (error: any) {
    console.error("🔥 ERROR in deleteInterventionAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true, message: 'Η παρέμβαση διαγράφηκε με επιτυχία.' };
}

const AddSubInterventionSchema = z.object({
  projectId: z.string(),
  interventionMasterId: z.string(),
  subcategoryCode: z.string().min(1, "Ο κωδικός είναι υποχρεωτικός."),
  description: z.string().min(3, "Η περιγραφή πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
  quantity: z.coerce.number().optional(),
  quantityUnit: z.string().optional(),
  cost: z.coerce.number().positive("Το κόστος πρέπει να είναι θετικός αριθμός."),
  costOfMaterials: z.coerce.number().min(0, "Το κόστος πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  costOfLabor: z.coerce.number().min(0, "Το κόστος πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  unitCost: z.coerce.number().min(0, "Το κόστος πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  implementedQuantity: z.coerce.number().min(0, "Η ποσότητα πρέπει να είναι μη αρνητικός αριθμός.").optional(),
});

export async function addSubInterventionAction(prevState: any, formData: FormData) {
  const validatedFields = AddSubInterventionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
    };
  }

  const { projectId, interventionMasterId } = validatedFields.data;

  try {
    const db = getAdminDb();
    const project = await getProjectById(db, projectId);
    if (!project) {
      return { success: false, message: 'Σφάλμα: Το έργο δεν βρέθηκε.' };
    }

    const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
    if (!intervention) {
      return { success: false, message: 'Σφάλμα: Η παρέμβαση δεν βρέθηκε.' };
    }

    const { subcategoryCode, description, cost, quantity, quantityUnit, costOfMaterials, costOfLabor, unitCost, implementedQuantity } = validatedFields.data;
    const newSubIntervention: SubIntervention = {
        id: `sub-${Date.now()}`,
        subcategoryCode,
        description,
        cost,
        quantity,
        quantityUnit,
        costOfMaterials: costOfMaterials || 0,
        costOfLabor: costOfLabor || 0,
        unitCost: unitCost || 0,
        implementedQuantity: implementedQuantity || 0,
    };

    if (!intervention.subInterventions) {
        intervention.subInterventions = [];
    }
    intervention.subInterventions.push(newSubIntervention);
    
    project.auditLog.unshift({
      id: `log-${Date.now()}`,
      user: users[0],
      action: 'Προσθήκη Υπο-Παρέμβασης',
      timestamp: new Date().toISOString(),
      details: `Προστέθηκε η υπο-παρέμβαση "${description}" στην παρέμβαση "${intervention.interventionCategory}".`,
    });
    
    await updateProjectData(db, projectId, project);

  } catch (error: any) {
    console.error("🔥 ERROR in addSubInterventionAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true, message: 'Η υπο-παρέμβαση προστέθηκε με επιτυχία.' };
}

const UpdateSubInterventionSchema = z.object({
  projectId: z.string(),
  interventionMasterId: z.string(),
  subInterventionId: z.string(),
  subcategoryCode: z.string().min(1, "Ο κωδικός είναι υποχρεωτικός."),
  expenseCategory: z.string().optional(),
  description: z.string().min(3, "Η περιγραφή πρέπει να έχει τουλάχιστον 3 χαρακτήρες."),
  quantity: z.coerce.number().optional(),
  quantityUnit: z.string().optional(),
  cost: z.coerce.number().positive("Το κόστος πρέπει να είναι θετικός αριθμός."),
  costOfMaterials: z.coerce.number().min(0, "Το κόστος πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  costOfLabor: z.coerce.number().min(0, "Το κόστος πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  unitCost: z.coerce.number().min(0, "Το κόστος πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  implementedQuantity: z.coerce.number().min(0, "Η ποσότητα πρέπει να είναι μη αρνητικός αριθμός.").optional(),
  selectedEnergySpec: z.string().optional(),
});

export async function updateSubInterventionAction(prevState: any, formData: FormData) {
  const validatedFields = UpdateSubInterventionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
    };
  }

  const { projectId, interventionMasterId, subInterventionId } = validatedFields.data;

  try {
    const db = getAdminDb();
    const project = await getProjectById(db, projectId);
    if (!project) {
      return { success: false, message: 'Σφάλμα: Το έργο δεν βρέθηκε.' };
    }

    const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
    if (!intervention) {
      return { success: false, message: 'Σφάλμα: Η παρέμβαση δεν βρέθηκε.' };
    }
    
    if (!intervention.subInterventions) {
        return { success: false, message: 'Σφάλμα: Δεν βρέθηκαν υπο-παρεμβάσεις.' };
    }

    const subIntervention = intervention.subInterventions.find(sub => sub.id === subInterventionId);
    if (!subIntervention) {
        return { success: false, message: 'Σφάλμα: Η υπο-παρέμβαση δεν βρέθηκε.' };
    }

    const { subcategoryCode, description, cost, quantity, quantityUnit, costOfMaterials, costOfLabor, unitCost, implementedQuantity, expenseCategory, selectedEnergySpec } = validatedFields.data;
    subIntervention.subcategoryCode = subcategoryCode;
    subIntervention.expenseCategory = expenseCategory;
    subIntervention.description = description;
    subIntervention.cost = cost;
    subIntervention.quantity = quantity;
    subIntervention.quantityUnit = quantityUnit;
    subIntervention.costOfMaterials = costOfMaterials || 0;
    subIntervention.costOfLabor = costOfLabor || 0;
    subIntervention.unitCost = unitCost || 0;
    subIntervention.implementedQuantity = implementedQuantity || 0;
    subIntervention.selectedEnergySpec = selectedEnergySpec;
    
    project.auditLog.unshift({
      id: `log-${Date.now()}`,
      user: users[0],
      action: 'Επεξεργασία Υπο-Παρέμβασης',
      timestamp: new Date().toISOString(),
      details: `Επεξεργάστηκε η υπο-παρέμβαση "${description}" στην παρέμβαση "${intervention.interventionCategory}".`,
    });
    
    await updateProjectData(db, projectId, project);

  } catch (error: any) {
    console.error("🔥 ERROR in updateSubInterventionAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true, message: 'Η υπο-παρέμβαση ενημερώθηκε με επιτυχία.' };
}

export async function deleteSubInterventionAction(prevState: any, formData: FormData) {
  const validatedFields = DeleteSubInterventionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
      return { success: false, message: 'Μη έγκυρα δεδομένα.' };
  }

  const { projectId, interventionMasterId, subInterventionId } = validatedFields.data;

  try {
    const db = getAdminDb();
    const project = await getProjectById(db, projectId);
    if (!project) {
      return { success: false, message: 'Σφάλμα: Το έργο δεν βρέθηκε.' };
    }

    const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
    if (!intervention || !intervention.subInterventions) {
      return { success: false, message: 'Σφάλμα: Η παρέμβαση ή οι υπο-παρεμβάσεις δεν βρέθηκαν.' };
    }

    const subInterventionIndex = intervention.subInterventions.findIndex(sub => sub.id === subInterventionId);
    if (subInterventionIndex === -1) {
        return { success: false, message: 'Σφάλμα: Η υπο-παρέμβαση δεν βρέθηκε.' };
    }

    const deletedSubIntervention = intervention.subInterventions.splice(subInterventionIndex, 1)[0];
    
    project.auditLog.unshift({
      id: `log-${Date.now()}`,
      user: users[0],
      action: 'Διαγραφή Υπο-Παρέμβασης',
      timestamp: new Date().toISOString(),
      details: `Διαγράφηκε η υπο-παρέμβαση "${deletedSubIntervention.description}" από την παρέμβαση "${intervention.interventionCategory}".`,
    });
    
    await updateProjectData(db, projectId, project);

  } catch (error: any) {
    console.error("🔥 ERROR in updateSubInterventionAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true, message: 'Η υπο-παρέμβαση διαγράφηκε με επιτυχία.' };
}


export async function updateInterventionCostsAction(prevState: any, formData: FormData) {
    const validatedFields = UpdateInterventionCostsSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Σφάλμα. Παρακαλώ διορθώστε τα πεδία.',
        };
    }

    const { projectId, interventionMasterId, costOfMaterials, costOfLabor } = validatedFields.data;

    try {
        const db = getAdminDb();
        const project = await getProjectById(db, projectId);
        if (!project) {
            return { success: false, message: 'Σφάλμα: Το έργο δεν βρέθηκε.' };
        }

        const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
        if (!intervention) {
            return { success: false, message: 'Σφάλμα: Η παρέμβαση δεν βρέθηκε.' };
        }

        if (costOfMaterials !== undefined) intervention.costOfMaterials = costOfMaterials;
        if (costOfLabor !== undefined) intervention.costOfLabor = costOfLabor;
        
        await updateProjectData(db, projectId, project);
    } catch (error: any) {
        console.error("🔥 ERROR in updateInterventionCostsAction:", error);
        return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
    }

    revalidatePath(`/project/${projectId}`);
    return { success: true, message: 'Το κόστος της παρέμβασης ενημερώθηκε με επιτυχία.' };
}

export async function moveSubInterventionAction(prevState: any, formData: FormData) {
  const effectiveFormData = formData instanceof FormData ? formData : prevState;

  if (!(effectiveFormData instanceof FormData)) {
    return { success: false, message: 'Μη έγκυρα δεδομένα φόρμας.' };
  }
  
  const validatedFields = MoveSubInterventionSchema.safeParse(Object.fromEntries(effectiveFormData.entries()));
  if (!validatedFields.success) {
    return { success: false, message: 'Μη έγκυρα δεδομένα.' };
  }
  const { projectId, interventionMasterId, subInterventionId, direction } = validatedFields.data;

  try {
    const db = getAdminDb();
    const project = await getProjectById(db, projectId);
    if (!project) throw new Error('Δεν βρέθηκε το έργο.');

    const intervention = project.interventions.find(i => i.masterId === interventionMasterId);
    if (!intervention || !intervention.subInterventions) throw new Error('Δεν βρέθηκε η παρέμβαση.');

    const subInterventions = intervention.subInterventions;
    const fromIndex = subInterventions.findIndex(s => s.id === subInterventionId);
    if (fromIndex === -1) throw new Error('Δεν βρέθηκε η υπο-παρέμβαση.');
    
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

    if (toIndex >= 0 && toIndex < subInterventions.length) {
        [subInterventions[fromIndex], subInterventions[toIndex]] = [subInterventions[toIndex], subInterventions[fromIndex]];
    } else {
        return { success: true, message: 'Δεν είναι δυνατή η περαιτέρω μετακίνηση.' };
    }
    
    await updateProjectData(db, projectId, project);

  } catch (error: any) {
    console.error("🔥 ERROR in moveSubInterventionAction:", error);
    return { success: false, message: `Σφάλμα Βάσης Δεδομένων: ${error.message}` };
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true, message: 'Η σειρά άλλαξε.' };
}
