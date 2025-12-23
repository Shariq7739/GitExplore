
"use client"

import { useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { format, parseISO } from 'date-fns';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Repository } from "@/lib/types"

interface CreationsLineChartProps {
  repos: Repository[]
}

const chartConfig = {
  creations: {
    label: "Creations",
    color: "hsl(var(--primary))",
  },
}

export function CreationsLineChart({ repos }: CreationsLineChartProps) {
  const chartData = useMemo(() => {
    const creationsByMonth = repos.reduce((acc, repo) => {
      if (repo.created_at) {
        const month = format(parseISO(repo.created_at), 'yyyy-MM');
        acc[month] = (acc[month] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(creationsByMonth)
      .map(([month, count]) => ({
        month,
        creations: count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [repos]);


  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30 h-full">
      <CardHeader>
        <CardTitle>Repository Creation Trends</CardTitle>
        <CardDescription>Number of visible repositories created per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full" tabIndex={0} aria-label="Line chart showing repository creations over time">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => format(parseISO(`${value}-01`), 'MMM yy')}
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs fill-muted-foreground"
            />
            <ChartTooltip
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="creations"
              type="monotone"
              stroke="var(--color-creations)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-creations)",
                r: 4,
                strokeWidth: 2,
                stroke: "hsl(var(--background))"
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
