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
import { AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import {
    ChartContainer,
} from '@/components/ui/chart';
import { Area, AreaChart } from 'recharts';


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

export default function RiskMonitorPage() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
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
            </div>
        </div>

        <Card>
            <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Stock</TableHead>
                  <TableHead className="text-center">Risk Score</TableHead>
                  <TableHead className="w-[200px] text-center">24h Trend</TableHead>
                  <TableHead>Anomaly Drivers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveRiskMonitorData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link href={`/stock/${item.symbol}`} className="font-medium text-primary hover:underline">{item.symbol}</Link>
                      <div className="text-xs text-muted-foreground">{item.name}</div>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant={getRiskBadgeVariant(item.riskScore)} className="text-base w-16 justify-center">
                            {item.riskScore}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center px-0">
                      <div className="h-10 w-full">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                          <AreaChart
                            data={item.lastHourTrend.map((score, index) => ({ time: index, score }))}
                            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                          >
                            <defs>
                                <linearGradient id={`fill-risk-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-riskScore)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-riskScore)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <Area
                              dataKey="score"
                              type="monotone"
                              stroke="var(--color-riskScore)"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill={`url(#fill-risk-${item.id})`}
                            />
                          </AreaChart>
                        </ChartContainer>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1">
                            {item.drivers.map((driver, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                    <AlertTriangle className="h-3 w-3 text-destructive" />
                                    <span>{driver}</span>
                                </div>
                            ))}
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    );
  }
