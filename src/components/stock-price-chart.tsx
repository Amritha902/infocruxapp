'use client';

import * as React from 'react';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';

import {
  ChartContainer,
  ChartTooltip as ChartTooltipPrimitive,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const generateChartData = () => {
  const data = [];
  const now = new Date();
  for (let i = 60; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const price = 1500 + Math.random() * 200 - 100 + i * 2;
    const volume = 1000000 + Math.random() * 500000;
    data.push({
      date: date.toISOString(),
      price: price,
      volume: volume,
    });
  }
  return data;
};

const chartData = generateChartData();

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
  volume: {
    label: 'Volume',
    color: 'hsl(var(--chart-2))',
  },
};

export function StockPriceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-price)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(new Date(value), "MMM d")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              orientation="right"
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <ChartTooltipPrimitive
              cursor={false}
              content={<ChartTooltipContent 
                indicator="dot" 
                labelFormatter={(label, payload) => {
                  return payload[0] ? format(new Date(payload[0].payload.date), "eeee, MMM d, yyyy") : label
                }}
                formatter={(value, name) => (
                    name === 'price' ? `₹${(value as number).toFixed(2)}` : (value as number).toLocaleString()
                )}
               />}
            />
            <Line
              dataKey="price"
              type="monotone"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={false}
              fill="url(#fillPrice)"
            />
          </LineChart>
        </ChartContainer>
        <ChartContainer config={chartConfig} className="h-[100px] w-full mt-4">
            <BarChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                }}
            >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={() => ""}
                />
                <YAxis
                    dataKey="volume"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    orientation="right"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                 <ChartTooltipPrimitive
                    cursor={false}
                    content={<ChartTooltipContent 
                      indicator="dot" 
                      labelFormatter={(label) => format(new Date(label), "eeee, MMM d, yyyy")}
                      formatter={(value, name) => (
                          name === 'volume' ? (value as number).toLocaleString() : `₹${(value as number).toFixed(2)}`
                      )}
                    />}
                />
                <Bar dataKey="volume" fill="var(--color-volume)" radius={2} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
