
"use client";

import { useMemo } from 'react';
import type { ProjectIntervention } from "@/types";
import {
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuotationSummaryCardProps {
  interventions: ProjectIntervention[];
}

export function QuotationSummaryCard({ interventions }: QuotationSummaryCardProps) {
  const summaryData = useMemo(() => {
    return interventions.map((intervention) => {
      const internalCost = intervention.subInterventions.reduce((sum, sub) => sum + (sub.costOfMaterials || 0) + (sub.costOfLabor || 0), 0);
      const programBudget = intervention.totalCost || 0;
      const profit = programBudget - internalCost;
      const margin = programBudget > 0 ? (profit / programBudget) * 100 : 0;
      return {
        name: intervention.interventionSubcategory,
        internalCost,
        programBudget,
        profit,
        margin,
      };
    });
  }, [interventions]);

  const totals = useMemo(() => {
     return summaryData.reduce(
      (acc, curr) => {
        acc.internalCost += curr.internalCost;
        acc.programBudget += curr.programBudget;
        acc.profit += curr.profit;
        return acc;
      },
      { internalCost: 0, programBudget: 0, profit: 0 }
    );
  }, [summaryData]);
    
  const totalMargin = useMemo(() => {
    return totals.programBudget > 0 ? (totals.profit / totals.programBudget) * 100 : 0;
  }, [totals]);

  if (interventions.length === 0) {
    return null;
  }

  return (
      <CardContent className="p-0">
        <div className="border rounded-lg overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Παρέμβαση</TableHead>
                        <TableHead className="text-right">Πραγματικό Κόστος (Έξοδα)</TableHead>
                         <TableHead className="text-right">Προϋπ/σμός (Έσοδα)</TableHead>
                         <TableHead className="text-right">Περιθώριο Κέρδους</TableHead>
                         <TableHead className="text-right">Ποσοστό Κέρδους</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {summaryData.map((data, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{data.name}</TableCell>
                            <TableCell className="text-right">{data.internalCost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableCell>
                            <TableCell className="text-right">{data.programBudget.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableCell>
                            <TableCell className={cn("text-right font-semibold", data.profit < 0 ? "text-destructive" : "text-green-600 dark:text-green-400")}>
                                {data.profit.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}
                            </TableCell>
                            <TableCell className={cn("text-right font-semibold flex items-center justify-end gap-1", data.margin < 0 ? "text-destructive" : "text-green-600 dark:text-green-400")}>
                                {data.margin >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {data.margin.toFixed(2)}%
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-bold">ΣΥΝΟΛΑ</TableHead>
                        <TableHead className="text-right font-bold">{totals.internalCost.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableHead>
                        <TableHead className="text-right font-bold">{totals.programBudget.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableHead>
                        <TableHead className={cn("text-right font-bold", totals.profit < 0 ? "text-destructive" : "text-green-600 dark:text-green-400")}>{totals.profit.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}</TableHead>
                        <TableHead className={cn("text-right font-bold flex items-center justify-end gap-1", totalMargin < 0 ? "text-destructive" : "text-green-600 dark:text-green-400")}>
                             {totalMargin >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {totalMargin.toFixed(2)}%
                        </TableHead>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
      </CardContent>
  );
}
