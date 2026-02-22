import Link from 'next/link';
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
import { watchlistData } from '@/lib/data';
import { cn } from '@/lib/utils';

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

function getRiskBadgeLabel(score: number): string {
    if (score > 60) return "High";
    if (score > 30) return "Medium";
    return "Low";
}

export default function WatchlistPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>Your curated list of stocks to watch.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">% Change</TableHead>
              <TableHead className="text-center">Anomaly Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchlistData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                    <Link href={`/stock/${item.symbol}`} className="font-medium text-primary hover:underline">{item.symbol}</Link>
                    <div className="text-xs text-muted-foreground">{item.name}</div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                <TableCell className={cn('text-right', item.change >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {item.change.toFixed(2)}
                </TableCell>
                <TableCell className={cn('text-right', item.change >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {item.changePercentage.toFixed(2)}%
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getRiskBadgeVariant(item.riskScore)}>
                    {getRiskBadgeLabel(item.riskScore)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
