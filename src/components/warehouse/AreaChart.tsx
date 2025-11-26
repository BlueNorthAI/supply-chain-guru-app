/* eslint-disable react/prop-types */
import React from 'react';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from "recharts"

export default function AreaChartCard({kpiData }: {kpiData: any}) {
  // const emptyStyles = { background: '#ef4444' };
  // const progressStyles = { background: '#22c55e' };

  return (
    <>
       {kpiData.map((kpi: any) => (
        <ChartContainer key={kpi.title} config={kpi.chartConfig} className="mx-auto  max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground" >
          <AreaChart
            accessibilityLayer
            data={kpi.chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
              dot={{fill: "var(--color-mobile)"}}
            >
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={8}
              />
            </Area>
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
              dot={{fill: "var(--color-desktop)"}}
              activeDot={{r: 6}}
            >
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground"
                fontSize={8}
              />
            </Area>
          </AreaChart>
        </ChartContainer>
       ))}
    </>
  );
}
