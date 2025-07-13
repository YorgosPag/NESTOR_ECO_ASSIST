import { AuditTrailTable } from "@/components/audit/audit-trail-table";

export default function AuditTrailPage() {
  return (
    <div className="flex min-h-screen w-full flex-col p-4 md:p-8">
      <h1 className="text-2xl font-semibold mb-4">Audit Trail</h1>
      <main className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground">A log of all significant actions taken within the application.</p>
        <AuditTrailTable />
      </main>
    </div>
  );
}
