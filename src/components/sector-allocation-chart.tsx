'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { SectorAllocation } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

const chartConfig = {
  value: {
    label: 'Value',
  },
  'Information Technology': {
    label: 'IT',
    color: 'hsl(var(--chart-1))',
  },
  Energy: {
    label: 'Energy',
    color: 'hsl(var(--chart-2))',
  },
  Financials: {
    label: 'Financials',
    color: 'hsl(var(--chart-3))',
  },
};

const riskLevelColors = {
    'High': 'bg-destructive',
    'Elevated': 'bg-yellow-500',
    'Normal': 'bg-green-500'
}

type SectorAllocationChartProps = {
  data: SectorAllocation[];
};

export function SectorAllocationChart({ data }: SectorAllocationChartProps) {
  const id = 'pie-interactive';
  const [mounted, setMounted] = React.useState(false);
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Sector Allocation</CardTitle>
          <CardDescription>By Current Value</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
            <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card data-chart={id} className="flex flex-col">
      <CardHeader>
        <CardTitle>Sector Allocation</CardTitle>
        <CardDescription>By Current Value & Risk</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="sector"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry) => (
                    <Cell
                        key={entry.sector}
                        fill={chartConfig[entry.sector as keyof typeof chartConfig]?.color || 'hsl(var(--chart-5))'}
                    />
                ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-3 text-sm">
         {data.map(item => (
            <div key={item.sector} className="flex w-full items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: chartConfig[item.sector as keyof typeof chartConfig]?.color }} />
                    <span className="text-muted-foreground">{item.sector}</span>
                </div>
                <div className="flex items-center gap-2">
                     <div className='flex items-center gap-1.5'>
                        <div className={cn("w-2 h-2 rounded-full", riskLevelColors[item.riskLevel])}></div>
                        <span>{item.riskLevel}</span>
                    </div>
                    <span className="font-semibold">{((item.value / totalValue) * 100).toFixed(0)}%</span>
                </div>
            </div>
         ))}
      </CardFooter>
    </Card>
  );
}
