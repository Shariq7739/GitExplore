
"use client"

import * as React from "react"
import { Pie, PieChart, Sector } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Repository } from "@/lib/types"

interface LanguagePieChartProps {
  repos: Repository[]
}

export function LanguagePieChart({ repos }: LanguagePieChartProps) {

  const chartData = React.useMemo(() => {
    const langCount = repos.reduce((acc, repo) => {
      const lang = repo.language || "Other"
      acc[lang] = (acc[lang] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const sortedLangs = Object.entries(langCount)
      .sort(([, a], [, b]) => b - a);

    const topLangs = sortedLangs.slice(0, 5);
    const otherLangs = sortedLangs.slice(5);

    const chartData = topLangs.map(([language, count], index) => ({
        language,
        count,
        fill: `hsl(var(--chart-${index + 1}))`,
    }));

    if (otherLangs.length > 0) {
        chartData.push({
            language: "Other",
            count: otherLangs.reduce((acc, [, count]) => acc + count, 0),
            fill: "hsl(var(--muted))",
        });
    }

    return chartData;
  }, [repos])

  const chartConfig = React.useMemo(() => {
      const config: any = {};
      chartData.forEach(item => {
          config[item.language] = {
              label: item.language,
              color: item.fill,
          }
      });
      return config;
  }, [chartData]);
  
  const totalRepos = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData]);


  return (
    <Card className="flex flex-col bg-card/60 backdrop-blur-xl border-border/30 h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Language Distribution</CardTitle>
        <CardDescription>Distribution of languages in visible repositories</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
                data={chartData}
                dataKey="count"
                nameKey="language"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={0}
                activeShape={({ outerRadius = 0, ...props }) => (
                    <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector {...props} outerRadius={outerRadius} stroke="none" />
                    </g>
                )}
            >
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="language" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
