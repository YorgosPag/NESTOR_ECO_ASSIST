'use server';
/**
 * @fileOverview Defines the data structures (schemas) for AI flow inputs and outputs.
 */
import { z } from 'zod';

// #################################################################
//  REPORTING SCHEMAS
// #################################################################

export const ChartDataSchema = z.object({
    type: z.enum(['bar', 'pie']).describe("The type of chart to display."),
    title: z.string().describe("The title of the chart."),
    data: z.array(z.object({
        name: z.string().describe("The name of the data point (e.g., a category on the x-axis or a pie slice)."),
        value: z.number().describe("The numerical value of the data point.")
    })).describe("The data points for the chart.")
});
export type ChartData = z.infer<typeof ChartDataSchema>;


export const ReportOutputSchema = z.union([
    z.string().describe("A text-based answer to the user's query, formatted for readability."),
    ChartDataSchema.describe("A structured chart data object when a visual representation is requested.")
]);
export type ReportOutput = z.infer<typeof ReportOutputSchema>;
