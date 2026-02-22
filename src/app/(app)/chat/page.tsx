import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Intelligence Chat</h1>
        <p className="text-muted-foreground">
          Ask questions about market movements and announcements.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The chat interface will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
