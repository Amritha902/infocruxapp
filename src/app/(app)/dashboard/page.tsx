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
import { ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
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

function getRiskBadgeVariant(score: number): "default" | "destructive" | "secondary" {
    if (score > 60) return "destructive";
    if (score > 30) return "secondary";
    return "default";
}

export default function DashboardPage() {
  const { totalInvested, currentValue, totalPnl, dayPnl, dayPnlPercentage } = portfolioData;

  const highRiskHoldings = portfolioData.holdings.filter(h => h.riskScore > 60);
  const elevatedRiskHoldings = portfolioData.holdings.filter(h => h.riskScore > 30 && h.riskScore <= 60);
  const latestTrigger = portfolioData.holdings.sort((a,b) => b.riskScore - a.riskScore)[0];


  const summaryCards = [
    { title: 'Current Value', value: formatCurrency(currentValue) },
    { title: 'Invested', value: formatCurrency(totalInvested) },
    {
      title: "Today's P&L",
      value: formatCurrency(dayPnl),
      change: `${dayPnlPercentage.toFixed(2)}%`,
      changeColor: dayPnl >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Overall P&L',
      value: formatCurrency(totalPnl),
      change: `${((totalPnl / totalInvested) * 100).toFixed(2)}%`,
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
              Your current stock portfolio with integrated risk intelligence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-center">Risk</TableHead>
                  <TableHead>Last Event</TableHead>
                  <TableHead className="text-right">Day's Change</TableHead>
                  <TableHead className="text-right">Total P&L</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.holdings.map((holding) => (
                  <TableRow key={holding.id}>
                    <TableCell>
                      <Link href={`/stock/${holding.symbol}`} className="font-medium text-primary hover:underline">{holding.symbol}</Link>
                      <div className="text-xs text-muted-foreground">{holding.name}</div>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant={getRiskBadgeVariant(holding.riskScore)}>{holding.riskScore}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{holding.lastEvent}</TableCell>
                    <TableCell className="text-right">
                      <div className={cn(holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600', 'flex items-center justify-end gap-1 font-medium')}>
                        {holding.dayChange >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {holding.dayChangePercentage.toFixed(2)}%
                      </div>
                    </TableCell>
                     <TableCell
                      className={cn(
                        'text-right font-medium',
                        holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {formatCurrency(holding.pnl)}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(holding.currentValue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Risk Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-2xl font-bold text-destructive">{highRiskHoldings.length}</p>
                            <p className="text-xs text-muted-foreground">High Risk</p>
                        </div>
                         <div>
                            <p className="text-2xl font-bold text-yellow-500">{elevatedRiskHoldings.length}</p>
                            <p className="text-xs text-muted-foreground">Elevated</p>
                        </div>
                         <div>
                            <p className="text-2xl font-bold text-green-500">{portfolioData.holdings.length - highRiskHoldings.length - elevatedRiskHoldings.length}</p>
                            <p className="text-xs text-muted-foreground">Normal</p>
                        </div>
                     </div>
                     <div className='text-xs space-y-1'>
                        <div className="font-semibold">Latest Trigger:</div>
                        <p className='text-muted-foreground truncate'>
                            <Link href={`/stock/${latestTrigger.symbol}`} className='text-primary font-medium hover:underline'>{latestTrigger.symbol}</Link> - {latestTrigger.lastEvent}
                        </p>
                     </div>
                </CardContent>
            </Card>
            <SectorAllocationChart data={sectorAllocations} />
        </div>
      </div>
    </div>
  );
}
