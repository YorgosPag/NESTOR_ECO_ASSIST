'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: 'Project title is required.' }),
  applicationNumber: z.string().optional(),
  ownerContactId: z.string().min(1, { message: 'Please select an owner.' }),
  deadline: z.string().optional(),
});

const DeleteSchema = z.object({
  id: z.string(),
});


export type State = {
  errors?: {
    title?: string[];
    ownerContactId?: string[];
  };
  message?: string | null;
  success?: boolean;
};


export async function updateProjectAction(prevState: State, formData: FormData) {

  const validatedFields = FormSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    applicationNumber: formData.get('applicationNumber'),
    ownerContactId: formData.get('ownerContactId'),
    deadline: formData.get('deadline'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the form fields.',
      success: false,
    };
  }
  
  // In a real app, you would update the data in your database.
  // For this example, we'll just log it and revalidate the cache.
  console.log('Updating project with data:', validatedFields.data);


  revalidatePath('/dashboard');
  revalidatePath('/projects');

  return { message: 'Project updated successfully.', success: true };
}

export async function deleteProjectAction(prevState: State, formData: FormData) {
    const validatedFields = DeleteSchema.safeParse({
        id: formData.get('id'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid project ID.',
            success: false,
        };
    }
    
    // In a real app, you would delete the data from your database.
    console.log('Deleting project with ID:', validatedFields.data.id);

    revalidatePath('/dashboard');
    revalidatePath('/projects');

    return { message: 'Project deleted successfully.', success: true };
}