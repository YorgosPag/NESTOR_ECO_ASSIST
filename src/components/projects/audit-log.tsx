import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import type { AuditLog } from '@/types';
import { format } from 'date-fns';

export function AuditLogDisplay({ auditLogs = [] }: { auditLogs: AuditLog[] }) {
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
        {auditLogs.length > 0 ? (
          auditLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.user}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell className="text-muted-foreground">{log.details}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {format(new Date(log.timestamp), "MMM d, yyyy, h:mm a")}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No audit logs for this project yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
