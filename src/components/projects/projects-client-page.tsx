
"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

const EmptyStateFiltered = ({ title = "Δεν βρέθηκαν έργα", description = "Δεν υπάρχουν έργα που να ταιριάζουν σε αυτήν την κατηγορία." }) => (
    <div className="flex flex-col col-span-full items-center justify-center rounded-lg border border-dashed shadow-sm p-8 mt-4 min-h-[400px]">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
);

interface ProjectsPageProps {
    projects: Project[];
    contacts: Contact[];
}

function ProjectsClientContent({ projects, contacts }: ProjectsPageProps) {
    const searchParams = useSearchParams();
    const statusFromQuery = searchParams.get('status');

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const tabMap: { [key: string]: string } = {
            'active': 'on_track',
            'quotation': 'quotation',
            'completed': 'completed'
        };
        if (statusFromQuery && tabMap[statusFromQuery]) {
            setActiveTab(tabMap[statusFromQuery]);
        }
    }, [statusFromQuery]);

    const filteredProjects = useMemo(() => {
        if (!searchTerm.trim()) {
            return projects;
        }
        
        const normalizedFilter = normalizeForSearch(searchTerm);
        
        return projects.filter(project => {
            const owner = contacts.find(c => c.id === project.ownerContactId);
            const haystack = [
                project.name,
                project.applicationNumber,
                owner?.firstName,
                owner?.lastName,
            ].filter(Boolean).join(' ');
            
            const normalizedHaystack = normalizeForSearch(haystack);
            
            return normalizedHaystack.includes(normalizedFilter);
        });
    }, [projects, contacts, searchTerm]);
    
    const quotationProjects = filteredProjects.filter(p => p.status === 'Προσφορά');
    const onTrackProjects = filteredProjects.filter(p => p.status === 'Εντός Χρονοδιαγράμματος');
    const delayedProjects = filteredProjects.filter(p => p.status === 'Σε Καθυστέρηση');
    const completedProjects = filteredProjects.filter(p => p.status === 'Ολοκληρωμένο');
    const allNonCompletedProjects = [...quotationProjects, ...onTrackProjects, ...delayedProjects];

    const allActiveProjects = [...onTrackProjects, ...delayedProjects];


    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FolderKanban className="h-6 w-6" />
                        Έργα & Προσφορές
                    </h1>
                    <p className="text-muted-foreground">Προβάλετε και διαχειριστείτε όλες τις προσφορές, τα ενεργά και τα ολοκληρωμένα έργα.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild className="w-full md:w-auto">
                    <Link href="/project/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Δημιουργία Έργου/Προσφοράς
                    </Link>
                    </Button>
                </div>
            </div>

            <div className="flex items-center py-4">
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Αναζήτηση με έργο, αίτηση, ή ιδιοκτήτη..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                    <TabsTrigger value="all">Όλα ({allNonCompletedProjects.length})</TabsTrigger>
                    <TabsTrigger value="quotation">Προσφορές ({quotationProjects.length})</TabsTrigger>
                    <TabsTrigger value="on_track">Ενεργά ({allActiveProjects.length})</TabsTrigger>
                    <TabsTrigger value="completed">Ολοκληρωμένα ({completedProjects.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-8 mt-4 min-h-[400px]">
                            <h3 className="text-2xl font-bold tracking-tight">Δεν έχετε ακόμη έργα</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
                                Για να ξεκινήσετε, μπορείτε να δημιουργήσετε το πρώτο σας έργο ή προσφορά.
                            </p>
                            <div className="mt-6 flex gap-4">
                                <Button asChild>
                                    <Link href="/project/new">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Δημιουργία Έργου/Προσφοράς
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : allNonCompletedProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allNonCompletedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : (
                        <EmptyStateFiltered title="Δεν βρέθηκαν έργα" description="Δοκιμάστε έναν διαφορετικό όρο αναζήτησης." />
                    )}
                </TabsContent>
                <TabsContent value="quotation" className="mt-4">
                    {quotationProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {quotationProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : <EmptyStateFiltered title="Δεν βρέθηκαν προσφορές" description="Δεν υπάρχουν έργα σε φάση προσφοράς που να ταιριάζουν με την αναζήτησή σας." />}
                </TabsContent>
                <TabsContent value="on_track" className="mt-4">
                    {allActiveProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allActiveProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : <EmptyStateFiltered title="Δεν βρέθηκαν ενεργά έργα" description="Δεν υπάρχουν ενεργά έργα (εντός ή εκτός χρονοδιαγράμματος) που να ταιριάζουν με την αναζήτησή σας."/>}
                </TabsContent>
                <TabsContent value="completed" className="mt-4">
                    {completedProjects.length > 0 ? (
                        <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {completedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} contacts={contacts} />
                            ))}
                        </div>
                    ) : <EmptyStateFiltered title="Δεν βρέθηκαν ολοκληρωμένα έργα" description="Δεν υπάρχουν ολοκληρωμένα έργα που να ταιριάζουν με την αναζήτησή σας." />}
                </TabsContent>
            </Tabs>
        </main>
    )
}

export function ProjectsClientPage(props: ProjectsPageProps) {
    return (
        <Suspense fallback={<div>Loading projects...</div>}>
            <ProjectsClientContent {...props} />
        </Suspense>
    )
}
