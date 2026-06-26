"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Eye } from "lucide-react";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  present: {
    label: "Present",
    color: "var(--chart-1)",
  },
  late: {
    label: "Late",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ChartDataPoint {
  day: string;
  present: number;
  late: number;
}

interface ChartBarStackedProps {
  data: ChartDataPoint[];
  weekRange: string;
}

export function ChartBarStacked({ data, weekRange }: ChartBarStackedProps) {
  return (
    <Card className="shadow-md w-full">
      <CardHeader className="text-gray-600">
        <CardTitle className="text-sm font-medium flex items-center gap-2 whitespace-nowrap">Weekly Attendance Metrics</CardTitle>
        <CardDescription className="text-xs text-gray-400">{weekRange}</CardDescription>
        <CardAction>
          <div className="flex items-center justify-center gap-2">
            <button className="p-1.5 rounded-full hover:bg-secondary/50">
              <Eye className="size-5 text-gray-400" />
            </button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="present"
              stackId="a"
              fill="var(--color-present)"
              radius={[0, 0, 10, 10]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="late"
              stackId="a"
              fill="var(--color-late)"
              radius={[10, 10, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/*<CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>*/}
    </Card>
  );
}
