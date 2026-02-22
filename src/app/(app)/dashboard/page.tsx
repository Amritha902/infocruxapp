'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { portfolioData, sectorAllocations } from '@/lib/data';
import { cn } from '@/lib/utils';
import { SectorAllocationChart } from '@/components/sector-allocation-chart';
import Link from 'next/link';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function DashboardPage() {
  const { totalInvested, currentValue, totalPnl, dayPnl, dayPnlPercentage } =
    portfolioData;

  const summaryCards = [
    { title: 'Invested', value: formatCurrency(totalInvested) },
    { title: 'Current Value', value: formatCurrency(currentValue) },
    {
      title: "Today's P&L",
      value: formatCurrency(dayPnl),
      change: `${dayPnlPercentage.toFixed(2)}%`,
      changeColor: dayPnl >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Overall P&L',
      value: formatCurrency(totalPnl),
      change: `${(
        (totalPnl / totalInvested) *
        100
      ).toFixed(2)}%`,
      changeColor: totalPnl >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.change && (
                <p className={cn('text-xs', card.changeColor)}>
                  {card.change}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>
              Your current stock portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Avg. Price</TableHead>
                  <TableHead className="text-right">LTP</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Day's Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.holdings.map((holding) => (
                  <TableRow key={holding.id}>
                    <TableCell>
                      <Link href={`/stock/${holding.symbol}`} className="font-medium text-primary hover:underline">{holding.symbol}</Link>
                      <div className="text-xs text-muted-foreground">{holding.name}</div>
                    </TableCell>
                    <TableCell className="text-right">{holding.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(holding.avgPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(holding.ltp)}</TableCell>
                    <TableCell
                      className={cn(
                        'text-right',
                        holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {formatCurrency(holding.pnl)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={cn(holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600', 'flex items-center justify-end gap-1')}>
                        {holding.dayChange >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {holding.dayChangePercentage.toFixed(2)}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <SectorAllocationChart data={sectorAllocations} totalValue={currentValue} />
      </div>
    </div>
  );
}
