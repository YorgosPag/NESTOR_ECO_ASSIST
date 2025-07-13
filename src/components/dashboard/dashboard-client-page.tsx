"use client";

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectCard } from '@/components/dashboard/project-card';
import { Users, DollarSign, FileText, PlusCircle, ArrowRight, Activity, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { UpcomingDeadlines } from '@/components/dashboard/upcoming-deadlines';
import type { Project } from "@/lib/data";

interface DashboardClientPageProps {
    projects: Project[];
}

export function DashboardClientPage({ projects: serverProjects }: DashboardClientPageProps) {
    
    const projects = useMemo(() => serverProjects, [serverProjects]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        setChartData([
            { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
            { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
        ]);
    }, []);

    const activeProjects = projects.filter(p => p.status === 'On Track' || p.status === 'At Risk');
    const onTrackProjects = projects.filter(p => p.status === 'On Track').length;
    const atRiskProjects = projects.filter(p => p.status === 'At Risk').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;


    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <LayoutGrid className="h-6 w-6" />
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">An overview of your projects.</p>
                </div>
                <Button asChild>
                    <Link href="#">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Project
                    </Link>
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Projects
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeProjects.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {onTrackProjects} on track, {atRiskProjects} at risk
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                           Completed Projects
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedProjects}</div>
                        <p className="text-xs text-muted-foreground">
                           Successfully finished
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projects.filter(p => p.status !== 'Completed').length}</div>
                         <p className="text-xs text-muted-foreground">
                            Across all active projects
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <OverviewChart data={chartData} />
                </div>
                <UpcomingDeadlines projects={projects} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </main>
    );
}