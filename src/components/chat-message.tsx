'use client';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import Balancer from 'react-wrap-balancer';
import { Bot, User, TrendingUp, TrendingDown, AlertCircle, FileText, Building, Globe } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

function getRiskBadgeVariant(score: number): 'default' | 'destructive' | 'secondary' {
  if (score > 60) return 'destructive';
  if (score > 30) return 'secondary';
  return 'default';
}

export function ChatMessage({ message, isLoading }: { message: Message, isLoading: boolean }) {
    const { role, content, ui } = message;
    const isUser = role === 'user';
  
    if (isUser) {
      return (
        <div className="flex items-start gap-3 justify-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl max-w-lg">
            <Balancer>{content}</Balancer>
          </div>
          <div className="bg-muted rounded-full p-2">
            <User className="w-5 h-5 text-muted-foreground"/>
          </div>
        </div>
      );
    }

  return (
    <div className="flex items-start gap-3">
        <div className="bg-muted rounded-full p-2">
            <Bot className="w-5 h-5 text-primary"/>
        </div>
        <div className="flex-1 max-w-2xl">
            {isLoading ? (
                 <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                </div>
            ) : ui ? (
                <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
                    <CardHeader>
                        {ui.marketAnalysis?.marketSummary && (
                            <CardTitle className="text-base tracking-normal">
                                {ui.marketAnalysis.marketSummary}
                            </CardTitle>
                        )}
                        {ui.marketAnalysis?.riskScore && (
                             <Badge variant={getRiskBadgeVariant(ui.marketAnalysis.riskScore)} className="w-fit">
                                {ui.marketAnalysis.riskCategory} Risk
                            </Badge>
                        )}
                    </CardHeader>
                    {(ui.marketAnalysis || ui.announcementAnalysis) && <Separator className="mx-6 w-auto" />}
                    <CardContent className="space-y-4">
                        {ui.marketAnalysis && (
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4"/>Market Reaction</h3>
                                <p className="text-sm text-muted-foreground mb-3">{ui.marketAnalysis.explanation}</p>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                     <div className="p-2 bg-background/50 rounded-md">
                                        <div className="font-bold text-sm">{ui.marketAnalysis.riskScore}</div>
                                        <div className="text-muted-foreground">Risk Score</div>
                                    </div>
                                    <div className="p-2 bg-background/50 rounded-md">
                                        <div className={cn("font-bold text-sm", (ui.marketAnalysis.abnormalReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600')}>{ui.marketAnalysis.abnormalReturn}%</div>
                                        <div className="text-muted-foreground">Abnormal Return</div>
                                    </div>
                                     <div className="p-2 bg-background/50 rounded-md">
                                        <div className="font-bold text-sm">{ui.marketAnalysis.volumeSpikeRatio}x</div>
                                        <div className="text-muted-foreground">Volume Spike</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {ui.announcementAnalysis && (
                             <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="w-4 h-4"/>Announcement Summary</h3>
                                <p className="text-sm text-muted-foreground line-clamp-4">{ui.announcementAnalysis.summary}</p>
                            </div>
                        )}
                         {ui.followUpSuggestions && ui.followUpSuggestions.length > 0 && (
                             <div>
                                <h3 className="font-semibold mb-2">Follow-up Questions</h3>
                                <div className="flex flex-col items-start gap-2">
                                    {ui.followUpSuggestions.map((suggestion, i) => (
                                        <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1.5">
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="bg-muted p-3 rounded-xl max-w-lg">
                    <Balancer>{content}</Balancer>
                </div>
            )}
        </div>
    </div>
  );
}
