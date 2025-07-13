"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AuditLog as AuditLogType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AuditLogDisplayProps {
  auditLogs: AuditLogType[];
}

export function AuditLogDisplay({ auditLogs }: AuditLogDisplayProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!auditLogs || auditLogs.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No action history for this project yet.
      </p>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="text-right">Timestamp</TableHead>
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
            <TableCell className="text-muted-foreground">
              {log.details || "N/A"}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {isClient
                ? format(new Date(log.timestamp), "MMM d, yyyy, h:mm a")
                : "..."}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}