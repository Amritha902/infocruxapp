import { getStockData, getAnnouncementForStock } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockPriceChart } from "@/components/stock-price-chart";
import { Suspense } from "react";
import { AnnouncementIntelligence } from "@/components/announcement-intelligence";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value);
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

  const stats = [
    { label: "Open", value: formatCurrency(stock.ltp * 0.99) },
    { label: "High", value: formatCurrency(stock.ltp * 1.02) },
    { label: "Low", value: formatCurrency(stock.ltp * 0.98) },
    { label: "Prev. Close", value: formatCurrency(stock.ltp - change) },
    { label: "Volume", value: "5.2M" },
    { label: "Market Cap", value: "₹19.8L Cr" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">{stock.name} ({stock.symbol})</h1>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-bold">{formatCurrency(stock.ltp)}</p>
          <p className={cn("font-semibold", isPositive ? "text-green-600" : "text-red-600")}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercentage.toFixed(2)}%)
          </p>
        </div>
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
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              {stats.map(stat => (
                <div key={stat.label}>
                  <p className="text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
