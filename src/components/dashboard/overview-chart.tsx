import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "January", initiated: 18, completed: 12 },
  { month: "February", initiated: 20, completed: 15 },
  { month: "March", initiated: 25, completed: 18 },
  { month: "April", initiated: 22, completed: 20 },
  { month: "May", initiated: 30, completed: 25 },
  { month: "June", initiated: 28, completed: 26 },
];

const chartConfig = {
  initiated: {
    label: "Initiated",
    color: "hsl(var(--primary))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--accent))",
  },
};

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects Overview</CardTitle>
        <CardDescription>Initiated vs. Completed Projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="initiated" fill="var(--color-initiated)" radius={4} />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
