'use server';

import { documentTagging, type DocumentTaggingInput, type DocumentTaggingOutput } from '@/ai/flows/document-tagging';
import { generateSmartReminder, type SmartReminderInput, type SmartReminderOutput } from '@/ai/flows/smart-reminders';

export async function getDocumentTags(input: DocumentTaggingInput): Promise<DocumentTaggingOutput> {
  return await documentTagging(input);
}

export async function getSmartReminder(input: SmartReminderInput): Promise<SmartReminderOutput> {
  return await generateSmartReminder(input);
}
