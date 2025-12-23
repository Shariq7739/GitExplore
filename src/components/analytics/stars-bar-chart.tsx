
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

interface StarsBarChartProps {
  repos: Repository[]
}

const chartConfig = {
  stars: {
    label: "Stars",
    color: "hsl(var(--primary))",
  },
}

export function StarsBarChart({ repos }: StarsBarChartProps) {
  const chartData = repos
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map(repo => ({
      name: repo.name,
      stars: repo.stargazers_count,
    }))
    .reverse(); // reverse for vertical bar chart

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-border/30 h-full">
      <CardHeader>
        <CardTitle>Top Repositories by Stars</CardTitle>
        <CardDescription>Showing top 10 visible repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full" tabIndex={0} aria-label="Bar chart showing top 10 repositories by stars">
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            accessibilityLayer
          >
             <CartesianGrid horizontal={false} strokeDasharray="3 3" />
             <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={100}
              className="text-xs fill-muted-foreground"
            />
            <XAxis dataKey="stars" type="number" hide />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
              content={<ChartTooltipContent labelKey="name" />}
            />
            <Bar dataKey="stars" fill="var(--color-stars)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
