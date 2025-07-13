import { Header } from "@/components/layout/header";
import { ProjectOverview } from "@/components/dashboard/project-overview";
import { SmartReminders } from "@/components/dashboard/smart-reminders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectOverview />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI Smart Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <SmartReminders />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
