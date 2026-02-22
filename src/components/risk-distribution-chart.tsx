'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { liveRiskMonitorData } from '@/lib/data';

const highRiskCount = liveRiskMonitorData.filter(d => d.riskScore > 60).length;
const elevatedRiskCount = liveRiskMonitorData.filter(d => d.riskScore > 30 && d.riskScore <=60).length;
const normalRiskCount = liveRiskMonitorData.filter(d => d.riskScore <= 30).length;

const chartData = [
  { name: 'High', value: highRiskCount, color: 'hsl(var(--destructive))' },
  { name: 'Elevated', value: elevatedRiskCount, color: 'hsl(var(--secondary-foreground))' },
  { name: 'Normal', value: normalRiskCount, color: 'hsl(var(--muted-foreground))' },
];

const chartConfig = {
  value: { label: 'Stocks' },
  High: { label: 'High', color: 'hsl(var(--destructive))' },
  Elevated: { label: 'Elevated', color: 'hsl(var(--secondary-foreground))' },
  Normal: { label: 'Normal', color: 'hsl(var(--muted-foreground))' },
};


export function RiskDistributionChart() {
  return (
    <div className="flex items-center gap-4">
        <ChartContainer config={chartConfig} className="h-[60px] w-[60px]">
        <PieChart>
            <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={20}
            strokeWidth={2}
            >
             {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
            </Pie>
        </PieChart>
        </ChartContainer>
        <div className="grid gap-1 text-xs">
            {chartData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}} />
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.value}</span>
                </div>
            ))}
        </div>
    </div>
  );
}
