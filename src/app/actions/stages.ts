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
