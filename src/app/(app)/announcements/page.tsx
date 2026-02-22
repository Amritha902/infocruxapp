import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { announcementsData } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

function getRiskBadgeVariant(score: number): "default" | "destructive" | "secondary" {
    if (score > 60) return "destructive";
    if (score > 30) return "secondary";
    return "default";
}

function getRiskCategory(score: number): string {
    if (score > 60) return "High Abnormal Reaction";
    if (score > 30) return "Moderate Reaction";
    return "Normal Reaction";
}

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Announcement Intelligence</h1>
            <p className="text-muted-foreground">
                Today's top corporate announcements by market reaction severity.
            </p>
        </div>
      <div className="grid gap-4">
        {announcementsData.sort((a,b) => b.riskScore - a.riskScore).map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>
                    <Link href={`/stock/${announcement.symbol}`} className="hover:underline">
                      {announcement.companyName} ({announcement.symbol})
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {announcement.fullText}
                  </CardDescription>
                </div>
                <Badge variant={getRiskBadgeVariant(announcement.riskScore)} className="whitespace-nowrap">
                  Risk Score: {announcement.riskScore}
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="flex w-full items-center justify-between">
                <span>{getRiskCategory(announcement.riskScore)}</span>
                <span>
                  {formatDistanceToNow(new Date(announcement.timestamp), { addSuffix: true })}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
