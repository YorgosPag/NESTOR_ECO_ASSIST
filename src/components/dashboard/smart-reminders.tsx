"use client";

import { useState } from 'react';
import { generateSmartReminders } from '@/ai/flows/generate-smart-reminders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface SmartRemindersProps {
  projects: Project[];
}

export function SmartReminders({ projects }: SmartRemindersProps) {
  const [reminders, setReminders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReminders = async () => {
    setIsLoading(true);
    setReminders([]);
    try {
      // For this demo, we'll combine the info of all active projects.
      // In a real app, you might select a specific project or context.
      const activeProjects = projects.filter(p => p.status === 'On Track' || p.status === 'At Risk');

      if (activeProjects.length === 0) {
        toast({
          variant: "default",
          title: "No Active Projects",
          description: "There are no active projects to generate reminders for.",
        });
        return;
      }

      const projectTimeline = activeProjects.map(p => 
        `Project: ${p.name}, Deadline: ${p.endDate}, Status: ${p.status}`
      ).join('\n');

      const documentContent = activeProjects.flatMap(p => 
        p.stages.flatMap(s => 
          s.files.map(f => `File: ${f.name} in stage ${s.name} of project ${p.name}`)
        )
      ).join('\n');

      const result = await generateSmartReminders({
        projectTimeline,
        documentContent,
      });
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
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
            <div>
                <CardTitle>AI Smart Reminders</CardTitle>
                <CardDescription>Get contextual reminders for your projects.</CardDescription>
            </div>
             <Button onClick={handleGenerateReminders} disabled={isLoading} size="sm">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder, index) => (
              <Alert key={index}>
                <Bell className="h-4 w-4" />
                <AlertTitle>Reminder</AlertTitle>
                <AlertDescription>{reminder}</AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Click &quot;Generate&quot; to get smart reminders from the AI.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}