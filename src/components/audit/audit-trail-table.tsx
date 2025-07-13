
"use client";

import type { AuditLog } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';


interface AuditTrailTableProps {
  auditLogs: AuditLog[];
}

export function AuditTrailTable({ auditLogs }: AuditTrailTableProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Αρχείο Καταγραφής</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Χρήστης</TableHead>
              <TableHead>Ενέργεια</TableHead>
              <TableHead>Λεπτομέρειες</TableHead>
              <TableHead className="text-right">Χρονική Σήμανση</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                 <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={log.user.avatar} alt={log.user.name} data-ai-hint="person" />
                      <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{log.user.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{log.action}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{log.details}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                   {isClient ? format(new Date(log.timestamp), "d MMM, yyyy, h:mm a") : "..."}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
