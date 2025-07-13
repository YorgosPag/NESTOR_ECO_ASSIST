"use client";

import { useState, useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProjectCard } from "@/components/dashboard/project-card";
import type { Project, Contact } from '@/types';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Search, FolderKanban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { normalizeForSearch } from "@/lib/text-utils";

const EmptyStateFiltered = ({ title = "No projects found", description = "There are no projects that match this category." }) => (
    <div className="flex flex-col col-span-full items-center justify-center rounded-lg border border-dashed shadow-sm p-8 mt-4 min-h-[400px]">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
);

interface ProjectsPageProps {
    projects: Project[];
    contacts: Contact[];
}

export function ProjectsClientPage({ projects, contacts }: ProjectsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = useMemo(() => {
        if (!searchTerm.trim()) {
            return projects;
        }
        
        const normalizedFilter = normalizeForSearch(searchTerm);
        
        return projects.filter(project => {
            
            const haystack = [
                project.name,
                project.manager
            ].filter(Boolean).join(' ');
            
            const normalizedHaystack = normalizeForSearch(haystack);
            
            return normalizedHaystack.includes(normalizedFilter);
        });
    }, [projects, searchTerm]);
    

    const onHoldProjects = filteredProjects.filter(p => p.status === 'On Hold');
    const onTrackProjects = filteredProjects.filter(p => p.status === 'On Track');
    const atRiskProjects = filteredProjects.filter(p => p.status === 'At Risk');
    const completedProjects = filteredProjects.filter(p => p.status === 'Completed');
    const allNonCompletedProjects = [...onHoldProjects, ...onTrackProjects, ...atRiskProjects];


    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FolderKanban className="h-6 w-6" />
                        Projects & Quotations
                    </h1>
                    <p className="text-muted-foreground">View and manage all quotations, active, and completed projects.</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button asChild>
                    <Link href="/projects/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Project/Quotation
                    </Link>
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by project, application, or owner..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                    <TabsTrigger value="all">All ({allNonCompletedProjects.length})</TabsTrigger>
                    <TabsTrigger value="quotation">Quotations ({onHoldProjects.length})</TabsTrigger>
                    <TabsTrigger value="on_track">On Track ({onTrackProjects.length})</TabsTrigger>
                    <TabsTrigger value="at_risk">At Risk ({atRiskProjects.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-8 mt-4 min-h-[400px]">
                            <h3 className="text-2xl font-bold tracking-tight">You have no projects yet</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
                                To get started, you can create your first project or quotation.
                            </p>
                            <div className="mt-6 flex gap-4">
                                <Button asChild>
                                    <Link href="/projects/new">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create Project/Quotation
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : allNonCompletedProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allNonCompletedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : (
                        <EmptyStateFiltered title="No projects found" description="Try a different search term." />
                    )}
                </TabsContent>
                <TabsContent value="quotation" className="mt-4">
                    {onHoldProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {onHoldProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : <EmptyStateFiltered title="No quotations found" description="There are no projects in quotation phase matching your search." />}
                </TabsContent>
                <TabsContent value="on_track" className="mt-4">
                    {onTrackProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {onTrackProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : <EmptyStateFiltered />}
                </TabsContent>
                <TabsContent value="at_risk" className="mt-4">
                     {atRiskProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {atRiskProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : <EmptyStateFiltered />}
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                    {completedProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {completedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : <EmptyStateFiltered />}
                </TabsContent>
            </Tabs>
        </main>
    )
}
