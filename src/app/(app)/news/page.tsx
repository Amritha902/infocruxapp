import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { newsData, NewsItem } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function getImpactInfo(impact: NewsItem['impact']): {
  Icon: React.ElementType;
  color: string;
  badgeVariant: 'default' | 'destructive' | 'secondary';
} {
  switch (impact.status) {
    case 'High abnormal reaction':
      return { Icon: ShieldAlert, color: 'text-destructive', badgeVariant: 'destructive' };
    case 'Elevated movement':
      return { Icon: Shield, color: 'text-orange-500', badgeVariant: 'secondary' };
    default:
      return { Icon: ShieldCheck, color: 'text-green-500', badgeVariant: 'default' };
  }
}

const tagColors: { [key: string]: string } = {
    'M&A': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Earnings': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Regulatory': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Fundraising': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Management change': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    'Rumor': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
}

export default function NewsPage() {
  const breakingNews = newsData.filter(item => item.impact.riskScore && item.impact.riskScore > 50);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">News Intelligence</h1>
        <p className="text-muted-foreground">
          Your personalized, portfolio-linked, real-time news stream.
        </p>
      </div>

      {breakingNews.length > 0 && (
        <div className="relative flex overflow-x-hidden border-y bg-muted/50 text-muted-foreground">
            <div className="animate-marquee whitespace-nowrap py-3">
            {breakingNews.map(item => (
                <Link href={`/stock/${item.symbol}`} key={item.id} className="mx-4 text-sm hover:underline">
                    <span className="font-bold text-foreground">{item.symbol}</span>: {item.headline}
                </Link>
            ))}
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-3">
                {breakingNews.map(item => (
                <Link href={`/stock/${item.symbol}`} key={item.id} className="mx-4 text-sm hover:underline">
                    <span className="font-bold text-foreground">{item.symbol}</span>: {item.headline}
                </Link>
            ))}
            </div>
        </div>
      )}


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {newsData.map((item) => {
          const { Icon, color, badgeVariant } = getImpactInfo(item.impact);
          return (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-base line-clamp-3 leading-snug hover:underline">
                    <Link href={`/stock/${item.symbol}`}>{item.headline}</Link>
                </CardTitle>
                <CardDescription>
                  {item.source} • {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                        <Badge key={tag} variant="outline" className={cn("border font-normal", tagColors[tag] || '')}>{tag}</Badge>
                    ))}
                 </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/50 py-3 px-6">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="text-sm font-medium">{item.impact.status}</span>
                </div>
                {item.impact.riskScore && (
                  <Badge variant={badgeVariant}>Risk: {item.impact.riskScore}</Badge>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
