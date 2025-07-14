"use server";

import { revalidatePath } from 'next/cache';
import type { ReportOutput } from "@/ai/flows/schemas";
import { generateReport } from "@/ai/flows/reporting-flow";


export async function generateReportAction(query: string) {
  try {
    const result: ReportOutput = await generateReport(query);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("🔥 ERROR in generateReportAction:", error);
    return { success: false, error: `Failed to generate report: ${error.message}` };
  }
}
