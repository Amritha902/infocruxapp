import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';

export default function VerifyPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Verify Content</h1>
        <p className="text-muted-foreground">
          Analyze shared links or text for market reaction insights.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Market Reaction Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The content verification summary will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
