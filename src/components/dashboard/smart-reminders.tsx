"use client";

import { useState } from 'react';
import { generateSmartReminders } from '@/ai/flows/generate-smart-reminders';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { projects } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function SmartReminders() {
  const [reminders, setReminders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReminders = async () => {
    setIsLoading(true);
    setReminders([]);

    try {
      const projectTimeline = projects.map(p => `${p.name}: ${p.startDate} to ${p.endDate}`).join('\n');
      const documentContent = projects.map(p => `${p.name}: ${p.description}`).join('\n');
      
      const result = await generateSmartReminders({ projectTimeline, documentContent });
      setReminders(result.reminders);

    } catch (error) {
        console.error("Failed to generate reminders:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate smart reminders. Please try again later.",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Generate contextual reminders based on project timelines and documents.
      </p>
      <Button onClick={handleGenerateReminders} disabled={isLoading} className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Lightbulb className="mr-2 h-4 w-4" />
        )}
        Generate Reminders
      </Button>

      {reminders.length > 0 && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Suggested Reminders</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {reminders.map((reminder, index) => (
                <li key={index}>{reminder}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
