'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getProjectById } from '@/lib/projects-data'; // We'll need this to "update" the project

// In a real app, you would have a proper database update function.
// For now, we'll just log the action.

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

  // In a real app, you'd add the intervention to the project in your database.
  // For this mock implementation, we'll just log it.
  console.log(`Adding intervention ${interventionName} to project ${projectId}`);
  
  // And then revalidate the path to show the new data.
  revalidatePath(`/project/${projectId}`);

  return { message: 'Intervention added successfully.', success: true };
}
