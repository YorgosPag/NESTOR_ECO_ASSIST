
"use client";

import type { ProjectIntervention } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "../ui/card";

interface QuotationSummaryCardProps {
  interventions: ProjectIntervention[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function QuotationSummaryCard({ interventions }: QuotationSummaryCardProps) {

  const totalCost = interventions.reduce((acc, i) => acc + (i.cost || 0), 0);
  const totalRevenue = interventions.reduce((acc, i) => acc + (i.price || 0), 0);
  const totalVat = interventions.reduce((acc, i) => acc + (i.vat || 0), 0);
  
  const totalWithVat = totalRevenue + totalVat;
  const profit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;


  return (
    <Card className="bg-muted/30">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Περιγραφή</TableHead>
                <TableHead className="text-right">Σύνολο</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Συνολικό Κόστος Υλοποίησης</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalCost)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Συνολικά Έσοδα (χωρίς ΦΠΑ)</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalRevenue)}</TableCell>
                </TableRow>
                 <TableRow>
                    <TableCell>Συνολικός ΦΠΑ</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalVat)}</TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow className="bg-muted/60">
                    <TableHead>Τελικό Ποσό (με ΦΠΑ)</TableHead>
                    <TableHead className="text-right">{formatCurrency(totalWithVat)}</TableHead>
                </TableRow>
                <TableRow>
                    <TableCell className="font-semibold">Κέρδος</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(profit)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-semibold">Περιθώριο Κέρδους</TableCell>
                    <TableCell className="text-right font-semibold">{profitMargin.toFixed(2)}%</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </Card>
  );
}
