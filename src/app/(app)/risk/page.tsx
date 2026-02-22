import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RiskAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Risk Analytics</h1>
        <p className="text-muted-foreground">
          An overview of portfolio risk and market anomalies.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Risk Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Risk analytics content will be displayed here once the backend is connected.</p>
        </CardContent>
      </Card>
    </div>
  );
}
