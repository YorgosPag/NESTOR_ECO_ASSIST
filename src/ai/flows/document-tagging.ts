'use server';

/**
 * @fileOverview AI-powered document tagging flow.
 *
 * - documentTagging - A function that suggests relevant tags for uploaded documents using AI.
 * - DocumentTaggingInput - The input type for the documentTagging function.
 * - DocumentTaggingOutput - The return type for the documentTagging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentTaggingInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document for which tags are to be suggested.'),
});
export type DocumentTaggingInput = z.infer<typeof DocumentTaggingInputSchema>;

const DocumentTaggingOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe('An array of suggested tags for the document.'),
});
export type DocumentTaggingOutput = z.infer<typeof DocumentTaggingOutputSchema>;

export async function documentTagging(input: DocumentTaggingInput): Promise<DocumentTaggingOutput> {
  return documentTaggingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentTaggingPrompt',
  input: {schema: DocumentTaggingInputSchema},
  output: {schema: DocumentTaggingOutputSchema},
  prompt: `You are an expert document management assistant. Based on the content of the document provided, suggest relevant tags that can be used to categorize and organize the document.

Document Content: {{{documentContent}}}

Suggested Tags (as a JSON array of strings):`,
});

const documentTaggingFlow = ai.defineFlow(
  {
    name: 'documentTaggingFlow',
    inputSchema: DocumentTaggingInputSchema,
    outputSchema: DocumentTaggingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
