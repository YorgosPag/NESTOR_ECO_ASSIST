import { Header } from "@/components/layout/header";
import { AuditTrailTable } from "@/components/audit/audit-trail-table";

export default function AuditTrailPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Audit Trail" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <p className="text-muted-foreground">A log of all significant actions taken within the application.</p>
        <AuditTrailTable />
      </main>
    </div>
  );
}
