'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreateFormSchema = z.object({
  name: z.string().min(1, { message: 'Project name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  applicationNumber: z.string().optional(),
  ownerContactId: z.string().min(1, { message: 'Please select an owner.' }),
  deadline: z.string().optional(),
});

const UpdateFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Project name is required.' }),
  applicationNumber: z.string().optional(),
  ownerContactId: z.string().min(1, { message: 'Please select an owner.' }),
  deadline: z.string().optional(),
});

const DeleteSchema = z.object({
  id: z.string(),
});

const ActivateProjectSchema = z.object({
    projectId: z.string(),
});

export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    ownerContactId?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export type ActivateProjectState = {
    message: string | null;
    success: boolean;
};


export async function createProjectAction(prevState: State, formData: FormData) {
  const validatedFields = CreateFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
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

  // In a real app, you would insert the data into your database.
  console.log('Creating new project with data:', validatedFields.data);

  revalidatePath('/projects');
  // We will redirect in the component after a success toast.
  // redirect('/projects');
  
  return { message: 'Project created successfully.', success: true };
}


export async function updateProjectAction(prevState: State, formData: FormData) {

  const validatedFields = UpdateFormSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
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
  console.log('Updating project with data:', validatedFields.data);


  revalidatePath('/dashboard');
  revalidatePath('/projects');
  revalidatePath(`/project/${validatedFields.data.id}`);

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
    // After deletion, we should redirect to the projects list.
    redirect('/projects');

    // This return is for type consistency, but redirect will happen first.
    return { message: 'Project deleted successfully.', success: true };
}

export async function activateProjectAction(prevState: ActivateProjectState, formData: FormData): Promise<ActivateProjectState> {
    const validatedFields = ActivateProjectSchema.safeParse({
        projectId: formData.get('projectId'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid project ID.',
            success: false,
        };
    }

    const { projectId } = validatedFields.data;

    // In a real app, you would find the project and update its status from 'Quotation' to 'On Track'
    // and potentially add an audit log entry.
    console.log(`Activating project with ID: ${projectId}`);
    // e.g., db.projects.update({ where: { id: projectId }, data: { status: 'On Track' } });
    // e.g., db.auditLogs.create({ data: { projectId, action: 'Project Activated', ... } });

    revalidatePath(`/project/${projectId}`);
    revalidatePath('/projects');

    return { message: 'The project has been successfully activated.', success: true };
}
