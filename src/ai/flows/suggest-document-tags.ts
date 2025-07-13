// src/ai/flows/suggest-document-tags.ts
'use server';

/**
 * @fileOverview AI-powered document tag suggestion.
 *
 * - suggestDocumentTags - A function that suggests tags for a document based on its content and filename.
 * - SuggestDocumentTagsInput - The input type for the suggestDocumentTags function.
 * - SuggestDocumentTagsOutput - The return type for the suggestDocumentTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDocumentTagsInputSchema = z.object({
  filename: z.string().describe('The name of the document file.'),
  contentSummary: z.string().describe('A summary of the document content.'),
});
export type SuggestDocumentTagsInput = z.infer<typeof SuggestDocumentTagsInputSchema>;

const SuggestDocumentTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the document.'),
});
export type SuggestDocumentTagsOutput = z.infer<typeof SuggestDocumentTagsOutputSchema>;

export async function suggestDocumentTags(input: SuggestDocumentTagsInput): Promise<SuggestDocumentTagsOutput> {
  return suggestDocumentTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDocumentTagsPrompt',
  input: {schema: SuggestDocumentTagsInputSchema},
  output: {schema: SuggestDocumentTagsOutputSchema},
  prompt: `You are an AI assistant helping project managers categorize documents.

  Based on the filename and content summary provided, suggest relevant tags for the document.
  Return ONLY an array of strings.

  Filename: {{{filename}}}
  Content Summary: {{{contentSummary}}}
  `,
});

const suggestDocumentTagsFlow = ai.defineFlow(
  {
    name: 'suggestDocumentTagsFlow',
    inputSchema: SuggestDocumentTagsInputSchema,
    outputSchema: SuggestDocumentTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
