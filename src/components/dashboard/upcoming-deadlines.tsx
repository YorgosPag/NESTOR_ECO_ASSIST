"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { Contact } from "@/types";

interface Deadline {
    projectId: string;
    projectTitle: string;
    stageId: string;
    stageTitle: string;
    deadline: string;
    assigneeContactId?: string;
}

interface UpcomingDeadlinesProps {
    deadlines?: Deadline[];
    contacts: Contact[];
}

export function UpcomingDeadlines({ deadlines = [], contacts = [] }: UpcomingDeadlinesProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        {deadlines.length > 0 ? (
            <div className="space-y-8">
            {deadlines.map((item) => {
                const assignee = contacts.find(c => c.id === item.assigneeContactId);
                return (
                    <div key={item.stageId} className="flex items-center">
                        {assignee && (
                             <Avatar className="h-9 w-9">
                                <AvatarImage src={assignee.avatarUrl} alt={assignee.firstName} data-ai-hint="person" />
                                <AvatarFallback>{assignee.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                <Link href={`/project/${item.projectId}`} className="hover:underline">
                                    {item.stageTitle}
                                </Link>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {item.projectTitle}
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-sm">
                           {isClient ? formatDistanceToNow(new Date(item.deadline), { addSuffix: true }) : "..."}
                        </div>
                    </div>
                )
            })}
            </div>
        ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming deadlines.</p>
        )}
      </CardContent>
    </Card>
  );
}
