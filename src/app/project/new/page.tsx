import { getContacts } from "@/lib/contacts-data";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function CreateProjectPage() {
  const contacts = await getContacts();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink asChild>
                    <Link href="/projects">Projects</Link>
                </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>Create</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">Create a New Project or Quotation</h1>
            <p className="text-muted-foreground mt-2">Fill in the initial details to get started. You can add more complex information like interventions and stages after creation.</p>
        </div>
        <div className="max-w-2xl mt-4">
           <CreateProjectForm contacts={contacts} />
        </div>
    </main>
  );
}
