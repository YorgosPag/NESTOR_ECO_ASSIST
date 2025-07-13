import { AuditTrailTable } from "@/components/audit/audit-trail-table";
import { getAllAuditLogs } from "@/lib/audit-log-data";

export default async function AuditTrailPage() {

  const auditLogs = await getAllAuditLogs();

  return (
    <div className="flex min-h-screen w-full flex-col p-4 md:p-8">
      <h1 className="text-2xl font-semibold mb-4">Ιστορικό Ενεργειών</h1>
      <main className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground">Ένα αρχείο καταγραφής όλων των σημαντικών ενεργειών που πραγματοποιήθηκαν στην εφαρμογή.</p>
        <AuditTrailTable auditLogs={auditLogs} />
      </main>
    </div>
  );
}
