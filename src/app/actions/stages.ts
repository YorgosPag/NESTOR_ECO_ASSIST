'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getProjectById, updateProject } from '@/lib/projects-data'; 
import { getAdminDb } from '@/lib/firebase-admin';
import type { Stage, StageStatus } from '@/types';

const AddStageSchema = z.object({
  projectId: z.string(),
  interventionMasterId: z.string(),
  title: z.string().min(1, { message: 'Stage title is required.' }),
  assigneeContactId: z.string().optional(),
  deadline: z.string().min(1, { message: 'Deadline is required.' }),
});

export type AddStageState = {
  errors?: {
    title?: string[];
    assigneeContactId?: string[];
    deadline?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function addStageAction(prevState: AddStageState, formData: FormData): Promise<AddStageState> {
  const validatedFields = AddStageSchema.safeParse({
    projectId: formData.get('projectId'),
    interventionMasterId: formData.get('interventionMasterId'),
    title: formData.get('title'),
    assigneeContactId: formData.get('assigneeContactId'),
    deadline: formData.get('deadline'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the form fields.',
      success: false,
    };
  }
  
  const { projectId, interventionMasterId, title, assigneeContactId, deadline } = validatedFields.data;
  const db = getAdminDb();

  try {
    const project = await getProjectById(db, projectId);

    if (!project) {
        return { message: 'Project not found.', success: false };
    }

    const intervention = project.interventions.find(i => i.masterInterventionId === interventionMasterId);

    if (!intervention) {
        return { message: 'Intervention not found.', success: false };
    }

    const newStage: Stage = {
        id: `stage-${new Date().getTime()}`,
        title,
        deadline: new Date(deadline).toISOString(),
        assigneeContactId,
        status: 'Not Started' as StageStatus,
        lastUpdated: new Date().toISOString(),
        files: [],
    };

    intervention.stages.push(newStage);
    
    await updateProject(db, project);

  } catch (error) {
    console.error('Error adding stage:', error);
    return { message: 'Database error: Could not add stage.', success: false };
  }
  
  revalidatePath(`/project/${projectId}`);

  return { message: 'Stage added successfully.', success: true };
}


const UpdateStageSchema = z.object({
  projectId: z.string(),
  stageId: z.string(),
  title: z.string().min(1, { message: 'Stage title is required.' }),
  assigneeContactId: z.string().optional(),
  deadline: z.string().min(1, { message: 'Deadline is required.' }),
});

export type UpdateStageState = AddStageState; // They share the same structure

export async function updateStageAction(prevState: UpdateStageState, formData: FormData): Promise<UpdateStageState> {
  const validatedFields = UpdateStageSchema.safeParse({
    projectId: formData.get('projectId'),
    stageId: formData.get('stageId'),
    title: formData.get('title'),
    assigneeContactId: formData.get('assigneeContactId'),
    deadline: formData.get('deadline'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the form fields.',
      success: false,
    };
  }
  
  const { projectId, stageId, title, assigneeContactId, deadline } = validatedFields.data;
  const db = getAdminDb();

  try {
    const project = await getProjectById(db, projectId);

    if (!project) {
        return { message: 'Project not found.', success: false };
    }

    let stageToUpdate: Stage | undefined;
    for (const intervention of project.interventions) {
        stageToUpdate = intervention.stages.find(s => s.id === stageId);
        if (stageToUpdate) break;
    }

    if (!stageToUpdate) {
        return { message: 'Stage not found.', success: false };
    }

    stageToUpdate.title = title;
    stageToUpdate.assigneeContactId = assigneeContactId;
    stageToUpdate.deadline = new Date(deadline).toISOString();
    stageToUpdate.lastUpdated = new Date().toISOString();
    
    await updateProject(db, project);

  } catch (error) {
    console.error('Error updating stage:', error);
    return { message: 'Database error: Could not update stage.', success: false };
  }
  
  revalidatePath(`/project/${projectId}`);

  return { message: 'Stage updated successfully.', success: true };
}

const DeleteStageSchema = z.object({
  projectId: z.string(),
  stageId: z.string(),
});

export type DeleteStageState = {
  message?: string | null;
  success?: boolean;
};

export async function deleteStageAction(prevState: DeleteStageState, formData: FormData): Promise<DeleteStageState> {
  const validatedFields = DeleteStageSchema.safeParse({
    projectId: formData.get('projectId'),
    stageId: formData.get('stageId'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Invalid data provided.',
      success: false,
    };
  }
  
  const { projectId, stageId } = validatedFields.data;
  const db = getAdminDb();

  try {
    const project = await getProjectById(db, projectId);

    if (!project) {
      return { message: 'Project not found.', success: false };
    }

    let stageFound = false;
    for (const intervention of project.interventions) {
      const stageIndex = intervention.stages.findIndex(s => s.id === stageId);
      if (stageIndex !== -1) {
        intervention.stages.splice(stageIndex, 1);
        stageFound = true;
        break;
      }
    }

    if (!stageFound) {
      return { message: 'Stage not found in any intervention.', success: false };
    }
    
    await updateProject(db, project);

  } catch (error) {
    console.error('Error deleting stage:', error);
    return { message: 'Database error: Could not delete stage.', success: false };
  }
  
  revalidatePath(`/project/${projectId}`);

  return { message: 'Stage deleted successfully.', success: true };
}
