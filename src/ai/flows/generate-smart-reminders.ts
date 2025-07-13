// src/ai/flows/generate-smart-reminders.ts
'use server';

/**
 * @fileOverview AI Smart Reminders generator based on project timelines and document content.
 *
 * - generateSmartReminders - A function that generates smart reminders.
 * - GenerateSmartRemindersInput - The input type for the generateSmartReminders function.
 * - GenerateSmartRemindersOutput - The return type for the generateSmartReminders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartRemindersInputSchema = z.object({
  projectTimeline: z
    .string()
    .describe('The timeline of the project, including key dates and milestones.'),
  documentContent: z
    .string()
    .describe('The content of the project documents, providing context for reminders.'),
});

export type GenerateSmartRemindersInput = z.infer<
  typeof GenerateSmartRemindersInputSchema
>;

const GenerateSmartRemindersOutputSchema = z.object({
  reminders: z
    .array(z.string())
    .describe('A list of smart reminders based on the project timeline and document content.'),
});

export type GenerateSmartRemindersOutput = z.infer<
  typeof GenerateSmartRemindersOutputSchema
>;

export async function generateSmartReminders(
  input: GenerateSmartRemindersInput
): Promise<GenerateSmartRemindersOutput> {
  return generateSmartRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartRemindersPrompt',
  input: {schema: GenerateSmartRemindersInputSchema},
  output: {schema: GenerateSmartRemindersOutputSchema},
  prompt: `You are an AI assistant designed to generate smart reminders for project coordinators.

  Based on the project timeline and document content provided, generate a list of reminders to help the coordinator stay on track and avoid missing deadlines or action items.

  Project Timeline: {{{projectTimeline}}}
  Document Content: {{{documentContent}}}

  Reminders:
  `,
});

const generateSmartRemindersFlow = ai.defineFlow(
  {
    name: 'generateSmartRemindersFlow',
    inputSchema: GenerateSmartRemindersInputSchema,
    outputSchema: GenerateSmartRemindersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
