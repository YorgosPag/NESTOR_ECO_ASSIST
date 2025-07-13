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

const UpdateStageStatusSchema = z.object({
    projectId: z.string(),
    stageId: z.string(),
    status: z.enum(['Not Started', 'In Progress', 'Completed', 'Delayed', 'Failed']),
});

const MoveStageSchema = z.object({
    projectId: z.string(),
    stageId: z.string(),
    interventionMasterId: z.string(),
    direction: z.enum(['up', 'down']),
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

export async function updateStageStatusAction(formData: FormData) {
    const validatedFields = UpdateStageStatusSchema.safeParse({
        projectId: formData.get('projectId'),
        stageId: formData.get('stageId'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        // Handle validation error, maybe return a message
        console.error("Validation failed for updating stage status:", validatedFields.error.flatten().fieldErrors);
        return;
    }

    const { projectId, stageId, status } = validatedFields.data;
    
    // In a real app, you'd find the project, then the intervention, then the stage and update its status.
    console.log(`Updating stage ${stageId} in project ${projectId} to status: ${status}`);
    
    revalidatePath(`/project/${projectId}`);
}

export async function moveStageAction(formData: FormData) {
    const validatedFields = MoveStageSchema.safeParse({
        projectId: formData.get('projectId'),
        stageId: formData.get('stageId'),
        interventionMasterId: formData.get('interventionMasterId'),
        direction: z.enum(['up', 'down']),
    });

    if (!validatedFields.success) {
        console.error("Validation failed for moving stage:", validatedFields.error.flatten().fieldErrors);
        return;
    }

    const { projectId, stageId, interventionMasterId, direction } = validatedFields.data;

    // In a real app, you would implement the logic to reorder the stage in the database.
    console.log(`Moving stage ${stageId} ${direction} in intervention ${interventionMasterId} of project ${projectId}.`);
    
    revalidatePath(`/project/${projectId}`);
}
