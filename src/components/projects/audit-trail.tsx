"use client";

import type { AuditEvent } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AuditTrail({ events }: { events: AuditEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage src={event.user.avatarUrl} alt={event.user.name} />
                        <AvatarFallback>{event.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{event.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{event.action}</TableCell>
                  <TableCell className="text-muted-foreground">{event.details}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No history events for this project.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
