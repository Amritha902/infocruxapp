'use client';
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import Balancer from 'react-wrap-balancer';
import { Bot, User, TrendingUp, FileText, Building, Globe, User as UserIcon, Link as LinkIcon, Landmark, Building2, BrainCircuit } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function getRiskBadgeVariant(score: number): 'default' | 'destructive' | 'secondary' {
  if (score > 60) return 'destructive';
  if (score > 30) return 'secondary';
  return 'default';
}

const entityIcons: { [key: string]: React.ElementType } = {
    'Company': Building,
    'Subsidiary': Building2,
    'Counterparty': Landmark,
    'Financial Backer': Landmark,
    'Bank': Landmark,
    'Individual': UserIcon,
    'default': Globe,
};


const ExtractedEntities = ({ entities }: { entities: {name: string, type: string}[] | undefined }) => {
    if (!entities || entities.length === 0) return null;

    return (
        <div className="bg-background/50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><BrainCircuit className="w-4 h-4"/>Entities Involved</h3>
            <div className="space-y-2">
                {entities.map(entity => {
                    const Icon = entityIcons[entity.type] || entityIcons.default;
                    return (
                    <div key={entity.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{entity.name}</span>
                        </div>
                        <Badge variant="outline" className="font-normal">{entity.type}</Badge>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}

const WebSources = ({ sources }: { sources: string[] | undefined }) => {
    if (!sources || sources.length === 0) return null;

    return (
         <div className="bg-background/50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><LinkIcon className="w-4 h-4"/>Sources</h3>
            <div className="space-y-2">
                {sources.map((source, i) => (
                    <a href={source} key={i} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">
                        {source}
                    </a>
                ))}
            </div>
        </div>
    )
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
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" alt="User" data-ai-hint="person face" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      );
    }

  return (
    <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 bg-primary/10 border border-primary/20">
             <Bot className="w-5 h-5 text-primary m-1.5"/>
        </Avatar>
        <div className="flex-1 max-w-2xl">
            {isLoading ? (
                 <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                </div>
            ) : ui ? (
                <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
                    <CardHeader className="pb-4">
                        {ui.marketAnalysis?.marketSummary && (
                            <CardTitle className="text-base tracking-normal">
                                {ui.marketAnalysis.marketSummary}
                            </CardTitle>
                        )}
                         {ui.generalResponse?.summary && !ui.marketAnalysis?.marketSummary && (
                            <CardTitle className="text-base tracking-normal">
                                {ui.generalResponse.summary}
                            </CardTitle>
                        )}
                        {ui.marketAnalysis?.riskScore && (
                             <Badge variant={getRiskBadgeVariant(ui.marketAnalysis.riskScore)} className="w-fit">
                                {ui.marketAnalysis.riskCategory} Risk
                            </Badge>
                        )}
                    </CardHeader>
                   
                    <CardContent className="space-y-4 pt-0">
                         {ui.marketAnalysis && (
                            <div className="bg-background/50 p-3 rounded-lg">
                                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm"><TrendingUp className="w-4 h-4"/>Market Reaction</h3>
                                <p className="text-xs text-muted-foreground mb-3">{ui.marketAnalysis.explanation}</p>
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
                             <div className="bg-background/50 p-3 rounded-lg">
                                <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm"><FileText className="w-4 h-4"/>Announcement Summary</h3>
                                <p className="text-xs text-muted-foreground line-clamp-4">{ui.announcementAnalysis.summary}</p>
                            </div>
                        )}

                        <ExtractedEntities entities={ui.announcementAnalysis?.extractedEntities} />
                        <WebSources sources={ui.generalResponse?.sources} />

                         {ui.followUpSuggestions && ui.followUpSuggestions.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2 text-sm">Follow-up Questions</h3>
                                <div className="flex flex-col items-start gap-2">
                                    {ui.followUpSuggestions.map((suggestion, i) => (
                                        <Button key={i} variant="outline" size="sm" className="text-xs h-auto py-1.5 bg-background/50">
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

    