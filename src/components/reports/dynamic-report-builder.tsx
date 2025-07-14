"use client";

import { useState, useMemo } from 'react';
import type { Project, Contact } from '@/types';
import type { ChartData } from "@/ai/flows/schemas";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { TableIcon, Filter } from 'lucide-react';
import { DynamicChart } from './dynamic-chart';

type GroupingOption = 'status' | 'interventionCategory' | 'project';

export function DynamicReportBuilder({ projects, contacts }: { projects: Project[], contacts: Contact[] }) {
    const [grouping, setGrouping] = useState<GroupingOption>('project');

    const statusOptions = [...new Set(projects.flatMap(p => p.interventions.flatMap(i => i.stages.map(s => s.status))))];
    const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
    const interventionCategoryOptions = [...new Set(projects.flatMap(p => p.interventions.map(i => i.interventionCategory)))];

    const reportData = useMemo(() => {
        const allStages = projects.flatMap(p => 
            p.interventions.flatMap(i => 
                i.stages.map(s => ({
                    ...s,
                    projectId: p.id,
                    projectName: p.name,
                    interventionCategory: i.interventionCategory
                }))
            )
        );

        const groups = allStages.reduce((acc, stage) => {
            const key = stage[grouping === 'project' ? 'projectName' : grouping];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(stage);
            return acc;
        }, {} as Record<string, typeof allStages>);

        return Object.entries(groups).map(([key, stages]) => ({
            name: key,
            count: stages.length,
            stages: stages.slice(0, 3)
        })).sort((a,b) => a.name.localeCompare(b.name));
    }, [projects, grouping]);
    
    const chartData: ChartData = useMemo(() => ({
        type: 'pie',
        title: `Stages by ${grouping}`,
        data: reportData.map(d => ({ name: d.name, value: d.count }))
    }), [reportData, grouping]);

    return (
        <Card>
            <CardHeader>
                 <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                            <TableIcon className="h-6 w-6" />
                            Ευέλικτες Αναφορές
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Ομαδοποιήστε και φιλτράρετε τα δεδομένα των σταδίων του έργου σας.
                        </CardDescription>
                    </div>
                 </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <Filter className="w-4 h-4"/>
                        Επιλογές Ομαδοποίησης
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="grouping-select">Ομαδοποίηση ανά:</Label>
                            <Select value={grouping} onValueChange={(v) => setGrouping(v as GroupingOption)}>
                                <SelectTrigger id="grouping-select">
                                    <SelectValue placeholder="Επιλέξτε..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="project">Έργο</SelectItem>
                                    <SelectItem value="status">Κατάσταση Σταδίου</SelectItem>
                                    <SelectItem value="interventionCategory">Κατηγορία Παρέμβασης</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                
                {reportData.length > 0 && (
                     <div className="min-h-[300px]">
                        <DynamicChart chartData={chartData} />
                    </div>
                )}


                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{grouping === 'status' ? 'Κατάσταση' : grouping === 'interventionCategory' ? 'Κατηγορία' : 'Έργο'}</TableHead>
                                <TableHead className="text-center">Πλήθος Σταδίων</TableHead>
                                <TableHead>Λεπτομέρειες (3 πρώτα στάδια)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {reportData.length > 0 ? reportData.map(group => (
                                <TableRow key={group.name}>
                                    <TableCell className="font-medium">{group.name}</TableCell>
                                    <TableCell className="text-center">{group.count}</TableCell>
                                    <TableCell>
                                        <ul className="text-xs list-disc pl-4 space-y-1">
                                            {group.stages.slice(0, 3).map(stage => (
                                                <li key={stage.id} className="text-muted-foreground">
                                                    <span className="font-semibold text-foreground">{grouping === 'project' ? stage.interventionCategory : stage.projectName}</span>: {stage.title}
                                                </li>
                                            ))}
                                            {group.stages.length > 3 && <li className="italic">και {group.stages.length - 3} ακόμη...</li>}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">Δεν βρέθηκαν δεδομένα για τα επιλεγμένα φίλτρα.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
