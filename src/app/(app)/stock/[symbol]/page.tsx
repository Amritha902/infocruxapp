import { getStockData, getAnnouncementForStock } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StockPriceChart } from "@/components/stock-price-chart";
import { Suspense } from "react";
import { AnnouncementIntelligence } from "@/components/announcement-intelligence";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, ArrowRight, Gauge, History, FileText, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

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

const TrendArrow = ({ trend }: { trend: 'increasing' | 'decreasing' | 'stable' | undefined }) => {
    switch (trend) {
        case 'increasing':
            return <ArrowUpRight className="h-4 w-4 text-destructive" />;
        case 'decreasing':
            return <ArrowDownRight className="h-4 w-4 text-green-500" />;
        case 'stable':
            return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
        default:
             return null;
    }
}

export default function StockDetailPage({ params }: { params: { symbol: string } }) {
  const stock = getStockData(params.symbol);
  const announcement = getAnnouncementForStock(params.symbol);

  if (!stock) {
    notFound();
  }

  const change = stock.dayChange ?? (stock.price - (stock.price / (1 + (stock.changePercentage ?? 0) / 100)));
  const isPositive = change >= 0;
  const changePercentage = stock.dayChange ? (stock.dayChange / (stock.ltp - stock.dayChange)) * 100 : stock.changePercentage ?? 0;

  const overviewStats = [
    { label: "Day's Range", value: `${formatCurrency(stock.ltp * 0.98)} - ${formatCurrency(stock.ltp * 1.02)}` },
    { label: "52-wk Range", value: `${formatCurrency(stock.ltp * 0.7)} - ${formatCurrency(stock.ltp * 1.1)}` },
    { label: "Volume", value: "5.2M" },
    { label: "Market Cap", value: "₹19.8L Cr" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-bold">{stock.name} ({stock.symbol})</h1>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold">{formatCurrency(stock.ltp)}</p>
              <p className={cn("font-semibold flex items-center gap-1", isPositive ? "text-green-600" : "text-red-600")}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {change.toFixed(2)} ({isPositive ? '+' : ''}{changePercentage.toFixed(2)}%)
              </p>
            </div>
        </div>
         {stock.riskScore && (
             <Badge variant={getRiskBadgeVariant(stock.riskScore)} className="text-base px-4 py-1">
                Risk: {stock.riskScore}
            </Badge>
         )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StockPriceChart />

          {announcement && (
             <Suspense fallback={<Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>}>
                <AnnouncementIntelligence announcement={announcement} />
            </Suspense>
          )}

        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Gauge className="w-5 h-5 text-primary" />Risk Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Risk</span>
                     {stock.riskScore && (
                        <Badge variant={getRiskBadgeVariant(stock.riskScore)}>{stock.riskScore}</Badge>
                     )}
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Risk Trend</span>
                    <div className="flex items-center gap-1 font-semibold">
                        <TrendArrow trend={stock.riskTrend} />
                        <span className="capitalize">{stock.riskTrend}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Trigger</span>
                    <span className="font-semibold">{stock.lastTrigger}</span>
                </div>
                 <div>
                    <h4 className="text-muted-foreground mb-2">Key Drivers</h4>
                    <ul className="space-y-1">
                       {stock.riskDrivers?.map(driver => (
                         <li key={driver} className="flex items-center gap-2 font-medium">
                           <AlertTriangle className="h-4 w-4 text-yellow-500" /> {driver}
                         </li>
                       ))}
                    </ul>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-primary" />Announcement History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stock.announcementHistory?.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                    </div>
                    <Badge variant={getRiskBadgeVariant(item.reactionScore)}>{item.reactionScore}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Market Data</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              {overviewStats.map(stat => (
                <div key={stat.label}>
                  <p className="text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

       <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5"/>
            <span>Analysis based on statistical market reaction indicators. Not investment advice.</span>
      </div>
    </div>
  );
}
