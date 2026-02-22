'use client';

import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { liveRiskMonitorData } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AlertTriangle, TrendingUp, Filter, BarChart, ChevronDown, ArrowUpRight, ArrowDownRight, ArrowRight, Bell, Gauge, Timer, Layers, List, FileDown } from 'lucide-react';
import {
    ChartContainer,
} from '@/components/ui/chart';
import { Area, AreaChart } from 'recharts';
import { RiskDistributionChart } from '@/components/risk-distribution-chart';

function getRiskBadgeVariant(score: number): "default" | "destructive" | "secondary" {
    if (score > 60) return "destructive";
    if (score > 30) return "secondary";
    return "default";
}

const chartConfig = {
    riskScore: {
      label: "Risk Score",
      color: "hsl(var(--destructive))",
    },
};

const DriverIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'volume':
            return <BarChart className="h-3.5 w-3.5 text-muted-foreground" />;
        case 'price':
            return <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />;
        case 'volatility':
            return <Layers className="h-3.5 w-3.5 text-muted-foreground" />;
        default:
            return <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />;
    }
};

const TrendArrow = ({ trend }: { trend: 'increasing' | 'decreasing' | 'stable' }) => {
    switch (trend) {
        case 'increasing':
            return <ArrowUpRight className="h-4 w-4 text-destructive" />;
        case 'decreasing':
            return <ArrowDownRight className="h-4 w-4 text-green-500" />;
        case 'stable':
            return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
    }
}

export default function RiskMonitorPage() {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedRows(newSet);
    };

    const highRiskCount = liveRiskMonitorData.filter(d => d.riskScore > 60).length;
    const elevatedRiskCount = liveRiskMonitorData.filter(d => d.riskScore > 30 && d.riskScore <=60).length;
    
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Live Risk Monitor</h1>
                <p className="text-muted-foreground">
                    Stocks showing statistically unusual market movement right now.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                    <FileDown className="h-4 w-4" />
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
                        <AlertTriangle/> High Risk Stocks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{highRiskCount}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-500 flex items-center gap-2">
                         <AlertTriangle/> Elevated Risk
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{elevatedRiskCount}</p>
                </CardContent>
            </Card>
             <Card className="md:col-span-2">
               <CardContent className="pt-6 h-full flex items-center justify-between">
                    <RiskDistributionChart />
                    <div className="text-xs text-muted-foreground text-right space-y-1">
                        <p>Monitoring Mode: <span className="font-bold text-foreground">Market</span></p>
                        <p>Last Updated: <span className="font-bold text-foreground">1 min ago</span></p>
                    </div>
               </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Stock</TableHead>
                  <TableHead className="text-center">Risk Score</TableHead>
                  <TableHead className="w-[120px] text-center">24h Trend</TableHead>
                  <TableHead>Market Divergence</TableHead>
                  <TableHead className="text-center">Volume</TableHead>
                  <TableHead>Trigger Time</TableHead>
                  <TableHead>Key Drivers</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveRiskMonitorData.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow className={cn("cursor-pointer", expandedRows.has(item.id) && "bg-muted/50")} onClick={() => toggleRow(item.id)}>
                        <TableCell>
                          <Link href={`/stock/${item.symbol}`} className="font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>{item.symbol}</Link>
                          <div className="text-xs text-muted-foreground truncate">{item.name}</div>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge variant={getRiskBadgeVariant(item.riskScore)} className="text-base w-16 justify-center tabular-nums">
                                {item.riskScore}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"><Gauge className="w-3 h-3" /> {item.confidence.toFixed(2)}</div>
                        </TableCell>
                        <TableCell className="text-center px-0">
                            <div className="h-10 w-full flex items-center justify-center gap-2">
                                <TrendArrow trend={item.trend} />
                                <ChartContainer config={chartConfig} className="h-full w-full max-w-[80px]">
                                    <AreaChart data={item.lastHourTrend.map((score, index) => ({ time: index, score }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <defs><linearGradient id={`fill-risk-${item.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-riskScore)" stopOpacity={0.4} /><stop offset="95%" stopColor="var(--color-riskScore)" stopOpacity={0.1} /></linearGradient></defs>
                                        <Area dataKey="score" type="monotone" stroke="var(--color-riskScore)" strokeWidth={2} fillOpacity={1} fill={`url(#fill-risk-${item.id})`} />
                                    </AreaChart>
                                </ChartContainer>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className={cn("font-semibold", item.marketDivergence.stockReturn > 0 ? "text-green-600" : "text-red-600")}>{item.marketDivergence.stockReturn.toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">vs Index {item.marketDivergence.indexReturn.toFixed(1)}%</div>
                        </TableCell>
                        <TableCell className="text-center font-semibold tabular-nums">{item.volumeRatio.toFixed(1)}x</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Timer className="w-3 h-3"/>{item.timeSinceTrigger}</div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 text-xs">
                                <DriverIcon type={item.drivers.type} />
                                <span className='truncate'>{item.drivers.text}</span>
                            </div>
                            {item.preDisclosureMovement && (
                                <Badge variant="outline" className="mt-1.5 text-xs font-normal border-yellow-500/50 text-yellow-500">
                                    Movement before disclosure
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                           <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expandedRows.has(item.id) && "rotate-180")} />
                        </TableCell>
                    </TableRow>
                    {expandedRows.has(item.id) && (
                         <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableCell colSpan={8} className="p-0">
                                <div className="p-4 grid grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-xs mb-2">Intraday Snapshot</h4>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between"><span>Abnormal Return:</span><span className="font-semibold">{item.marketDivergence.stockReturn}%</span></div>
                                            <div className="flex justify-between"><span>Volume Spike:</span><span className="font-semibold">{item.volumeRatio}x</span></div>
                                            <div className="flex justify-between"><span>Disclosure:</span><Badge variant={item.hasDisclosure ? 'default' : 'secondary'}>{item.hasDisclosure ? 'Found' : 'None'}</Badge></div>
                                        </div>
                                    </div>
                                    <div>
                                         <h4 className="font-semibold text-xs mb-2">Portfolio Impact</h4>
                                         {item.portfolioExposure ? (
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between"><span>Exposure:</span><span className="font-semibold">{item.portfolioExposure}%</span></div>
                                            </div>
                                         ) : <p className="text-xs text-muted-foreground">Not in portfolio.</p>}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="secondary" size="sm">Compare</Button>
                                        <Button variant="ghost" size="icon"><Bell className="w-4 h-4"/></Button>
                                    </div>
                                </div>
                            </TableCell>
                         </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    );
  }
