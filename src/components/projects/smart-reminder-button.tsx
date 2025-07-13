'use client';

import { useState } from 'react';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, Loader2 } from 'lucide-react';

export function SmartReminderButton({ project }: { project: Project }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReminder = async () => {
    setIsLoading(true);
    try {
      const upcomingStage = project.stages.find(s => s.status !== 'Completed');
      if (!upcomingStage) {
        toast({
          title: 'All stages complete!',
          description: 'No new reminders needed for this project.',
        });
        return;
      }

      const response = await fetch('/api/smart-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskName: upcomingStage.name,
          deadline: upcomingStage.deadline,
          projectDetails: `Project: ${project.name}. Current progress is ${project.progress}%.`,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch reminder');

      const data = await response.json();

      toast({
        title: '✨ Smart Reminder',
        description: data.reminder,
        duration: 9000,
      });

    } catch (error) {
      console.error('Failed to generate reminder:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate an AI reminder.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerateReminder} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Bell className="mr-2 h-4 w-4" />
      )}
      Generate Smart Reminder
    </Button>
  );
}
