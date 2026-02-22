'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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
import { SectorAllocation } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

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

type SectorAllocationChartProps = {
  data: SectorAllocation[];
  totalValue: number;
};

export function SectorAllocationChart({ data, totalValue }: SectorAllocationChartProps) {
  const id = 'pie-interactive';
  const [mounted, setMounted] = React.useState(false);

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
      <CardHeader className="items-center pb-0">
        <CardTitle>Sector Allocation</CardTitle>
        <CardDescription>By Current Value</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
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
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Value
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Portfolio is well-diversified across key sectors.
        </div>
        <div className="leading-none text-muted-foreground">
          Showing allocation for top 3 sectors
        </div>
      </CardFooter>
    </Card>
  );
}
