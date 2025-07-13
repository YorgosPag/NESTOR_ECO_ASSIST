'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getProjectById, updateProject } from '@/lib/projects-data'; 
import { getAdminDb } from '@/lib/firebase-admin';

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
    const project = await getProjectById(db, projectId);

    if (!project) {
        return { message: 'Project not found.', success: false };
    }

    // This is where we simulate adding the intervention to the database.
    const newIntervention = {
        id: `inter-${new Date().getTime()}`, // Simple unique ID
        masterInterventionId: `master-int-${new Date().getTime()}`, // Simple unique ID
        projectId: projectId,
        interventionCategory: 'Uncategorized', // Default category
        interventionSubcategory: interventionName,
        name: interventionName,
        stages: [], // Start with no stages
        costOfMaterials: 0,
        costOfLabor: 0,
        totalCost: 0,
    };

    project.interventions.push(newIntervention);
    
    await updateProject(db, project);

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
    const project = await getProjectById(db, projectId);

    if (!project) {
        return { message: 'Project not found.', success: false };
    }

    project.interventions = project.interventions.filter(
      (intervention) => intervention.id !== interventionId
    );

    await updateProject(db, project);

  } catch (error) {
    console.error('Error deleting intervention:', error);
    return { message: 'Database error: Could not delete intervention.', success: false };
  }

  revalidatePath(`/project/${projectId}`);

  return { message: 'Intervention deleted successfully.', success: true };
}