'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getProjectById, updateProject } from '@/lib/projects-data';
import { getAdminDb } from '@/lib/firebase-admin';
import type { Stage, StageStatus } from '@/types';

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
        direction: formData.get('direction'),
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
    notes?: string[];
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
  notes: z.string().optional(),
});

export type UpdateStageState = AddStageState; // They share the same structure

export async function updateStageAction(prevState: UpdateStageState, formData: FormData): Promise<UpdateStageState> {
  const validatedFields = UpdateStageSchema.safeParse({
    projectId: formData.get('projectId'),
    stageId: formData.get('stageId'),
    title: formData.get('title'),
    assigneeContactId: formData.get('assigneeContactId') === 'none' ? '' : formData.get('assigneeContactId'),
    deadline: formData.get('deadline'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the form fields.',
      success: false,
    };
  }
  
  const { projectId, stageId, title, assigneeContactId, deadline, notes } = validatedFields.data;
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
    stageToUpdate.notes = notes;
    
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
