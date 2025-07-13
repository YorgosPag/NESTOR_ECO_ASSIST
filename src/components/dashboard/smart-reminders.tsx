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
          title: "Δεν υπάρχουν Ενεργά Έργα",
          description: "Δεν υπάρχουν ενεργά έργα για τη δημιουργία υπενθυμίσεων.",
        });
        return;
      }

      const projectTimeline = activeProjects.map(p => 
        `Έργο: ${p.name}, Προθεσμία: ${p.endDate}, Κατάσταση: ${p.status}`
      ).join('\n');

      const documentContent = activeProjects.flatMap(p => 
        (p.interventions || []).flatMap(i => (i.stages || []).flatMap(s => 
          (s.files || []).map(f => `Αρχείο: ${f.name} στο στάδιο ${s.title} του έργου ${p.name}`)
        ))
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
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η δημιουργία έξυπνων υπενθυμίσεων. Παρακαλώ δοκιμάστε ξανά αργότερα.",
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
                <CardTitle>Έξυπνες Υπενθυμίσεις AI</CardTitle>
                <CardDescription>Λάβετε σχετικές υπενθυμίσεις για τα έργα σας.</CardDescription>
            </div>
             <Button onClick={handleGenerateReminders} disabled={isLoading} size="sm">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                Δημιουργία
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder, index) => (
              <Alert key={index}>
                <Bell className="h-4 w-4" />
                <AlertTitle>Υπενθύμιση</AlertTitle>
                <AlertDescription>{reminder}</AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Πατήστε "Δημιουργία" για να λάβετε έξυπνες υπενθυμίσεις από την AI.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
