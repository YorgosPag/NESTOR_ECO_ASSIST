
"use client";

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, PlusCircle, Activity, LayoutGrid, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import type { Project, Contact, Stage } from "@/types";
import { SmartReminders } from './smart-reminders';
import { ProjectCard } from './project-card';

interface DashboardClientPageProps {
    projects: Project[];
    contacts: Contact[];
}

interface Deadline {
    projectId: string;
    projectTitle: string;
    stageId: string;
    stageTitle: string;
    deadline: string;
    assigneeContactId?: string;
}


export function DashboardClientPage({ projects: serverProjects, contacts }: DashboardClientPageProps) {
    
    const projects = useMemo(() => serverProjects, [serverProjects]);
    const [chartData, setChartData] = useState<any[]>([]);


    useEffect(() => {
        setChartData([
            { name: 'Ιαν', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Φεβ', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Μαρ', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Απρ', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Μαϊ', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Ιουν', total: Math.floor(Math.random() * 5000) + 1000 },
        ]);
    }, []);

    const activeProjects = projects.filter(p => p.status === 'Εντός Χρονοδιαγράμματος' || p.status === 'Σε Καθυστέρηση');
    const onTrackProjects = projects.filter(p => p.status === 'Εντός Χρονοδιαγράμματος').length;
    const quotationProjects = projects.filter(p => p.status === 'Προσφορά').length;
    const delayedProjects = projects.filter(p => p.status === 'Σε Καθυστέρηση').length;
    const completedProjects = projects.filter(p => p.status === 'Ολοκληρωμένο').length;
    const recentActiveProjects = activeProjects.slice(0, 3);

    const upcomingDeadlines: Deadline[] = activeProjects
    .flatMap((p: Project) => 
        (p.interventions || []).flatMap(i => i.stages || []).map((s: Stage) => ({
            projectId: p.id,
            projectTitle: p.name,
            stageId: s.id,
            stageTitle: s.title,
            deadline: s.deadline,
            assigneeContactId: s.assigneeContactId,
        }))
    )
    .filter(stage => stage.deadline && new Date(stage.deadline) >= new Date())
    .sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);


    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <LayoutGrid className="h-6 w-6" />
                        Πίνακας Ελέγχου
                    </h1>
                    <p className="text-muted-foreground">Μια συνολική εικόνα των έργων σας.</p>
                </div>
                <Button asChild className="w-full md:w-auto">
                    <Link href="/project/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Δημιουργία Έργου
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Link href="/projects?status=active">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ενεργά Έργα
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeProjects.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {onTrackProjects} εντός, {delayedProjects} εκτός
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/projects?status=quotation">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                            Προσφορές
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{quotationProjects}</div>
                            <p className="text-xs text-muted-foreground">
                            Εκκρεμεί ενεργ/ση
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/projects?status=completed">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                            Ολοκληρωμένα
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedProjects}</div>
                            <p className="text-xs text-muted-foreground">
                            Έργα
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Επαφές</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{contacts.length}</div>
                         <p className="text-xs text-muted-foreground">
                            Σύνολο επαφών
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 grid gap-4">
                    <OverviewChart data={chartData} />
                    <SmartReminders projects={projects} />
                </div>
                <UpcomingDeadlines deadlines={upcomingDeadlines} contacts={contacts} />
            </div>

            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Πρόσφατα Ενεργά Έργα</h2>
                        <p className="text-muted-foreground">Μια ματιά στα πιο πρόσφατα ενεργά έργα σας.</p>
                    </div>
                     <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                        <Link href="/projects">
                           Προβολή Όλων
                        </Link>
                    </Button>
                </div>
                {recentActiveProjects.length > 0 ? (
                    <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {recentActiveProjects.map(project => (
                            <ProjectCard key={project.id} project={project} contacts={contacts} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        Δεν υπάρχουν ενεργά έργα για προβολή.
                    </div>
                )}
            </div>
        </main>
    );
}
