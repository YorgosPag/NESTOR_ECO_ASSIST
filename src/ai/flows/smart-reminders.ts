// use server'

/**
 * @fileOverview Generates smart reminders based on project deadlines.
 *
 * - generateSmartReminder - A function that generates a smart reminder.
 * - SmartReminderInput - The input type for the generateSmartReminder function.
 * - SmartReminderOutput - The return type for the generateSmartReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartReminderInputSchema = z.object({
  taskName: z.string().describe('The name of the task.'),
  deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD).'),
  projectDetails: z.string().describe('Details about the project.'),
});
export type SmartReminderInput = z.infer<typeof SmartReminderInputSchema>;

const SmartReminderOutputSchema = z.object({
  reminder: z.string().describe('The AI-generated smart reminder.'),
});
export type SmartReminderOutput = z.infer<typeof SmartReminderOutputSchema>;

export async function generateSmartReminder(input: SmartReminderInput): Promise<SmartReminderOutput> {
  return smartReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartReminderPrompt',
  input: {schema: SmartReminderInputSchema},
  output: {schema: SmartReminderOutputSchema},
  prompt: `You are an AI assistant that generates smart reminders based on project deadlines.

  Task Name: {{{taskName}}}
  Deadline: {{{deadline}}}
  Project Details: {{{projectDetails}}}

  Generate a concise and helpful reminder for the project team member to stay on track with the task and meet the deadline. The reminder should include the task name, deadline, and any relevant project details. It should be no more than two sentences.
  `,
});

const smartReminderFlow = ai.defineFlow(
  {
    name: 'smartReminderFlow',
    inputSchema: SmartReminderInputSchema,
    outputSchema: SmartReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
