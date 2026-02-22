import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { announcementsData } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { Filter, Clock, ChevronDown, TrendingUp, TrendingDown, ShieldCheck, Percent, Layers, Briefcase, BarChart, FileText, AlertTriangle, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function getRiskBadgeVariant(score: number): "destructive" | "secondary" | "default" {
    if (score >= 70) return "destructive";
    if (score >= 40) return "secondary";
    return "default";
}

function getRiskCategory(score: number): string {
    if (score >= 70) return "High Reaction";
    if (score >= 40) return "Moderate Reaction";
    return "Normal Reaction";
}

const tagColors: { [key: string]: string } = {
    'M&A': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'Earnings': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Regulatory': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'Fundraising': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
}

export default function AnnouncementsPage() {
    const highReactionCount = announcementsData.filter(a => a.riskScore >= 70).length;
    const moderateReactionCount = announcementsData.filter(a => a.riskScore >= 40 && a.riskScore < 70).length;
    const portfolioImpactingCount = announcementsData.filter(a => a.portfolioImpact).length;

    const summaryCards = [
        { title: "High Reaction", value: highReactionCount, Icon: AlertTriangle, color: "text-destructive" },
        { title: "Moderate Reaction", value: moderateReactionCount, Icon: AlertTriangle, color: "text-yellow-500" },
        { title: "Portfolio Impact", value: portfolioImpactingCount, Icon: Briefcase, color: "text-primary" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Announcement Intelligence</h1>
                <p className="text-muted-foreground">
                    Today's corporate disclosures ranked by statistical market reaction.
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                {summaryCards.map(card => (
                     <Card key={card.title}>
                        <CardHeader className='pb-2'>
                            <CardTitle className={cn("text-sm font-medium flex items-center gap-2", card.color)}>
                                <card.Icon className="h-4 w-4" />
                                {card.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6">
                {announcementsData.sort((a,b) => b.riskScore - a.riskScore).map((ann) => (
                    <Card key={ann.id}>
                        <CardHeader>
                            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                                <div className='space-y-1'>
                                    <CardTitle>
                                        <Link href={`/stock/${ann.symbol}`} className="hover:underline">
                                            {ann.companyName} ({ann.symbol})
                                        </Link>
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant={getRiskBadgeVariant(ann.riskScore)}>
                                            {getRiskCategory(ann.riskScore)}: {ann.riskScore}
                                        </Badge>
                                        <Separator orientation='vertical' className='h-4' />
                                        <Badge variant="outline" className={cn("font-normal border", tagColors[ann.category] || '')}>{ann.category}</Badge>
                                        <Separator orientation='vertical' className='h-4' />
                                        <div className='flex items-center gap-1.5'>
                                            <Clock className="h-3.5 w-3.5" />
                                            {formatDistanceToNow(new Date(ann.timestamp), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm rounded-lg bg-muted/50 p-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">Abnormal Return</span>
                                    <span className={cn("font-bold text-lg flex items-center", ann.abnormalReturn > 0 ? "text-green-600" : "text-red-600")}>
                                        {ann.abnormalReturn > 0 ? <TrendingUp className="h-4 w-4 mr-1"/> : <TrendingDown className="h-4 w-4 mr-1"/>}
                                        {ann.abnormalReturn}%
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">Index Adj. Return</span>
                                    <span className={cn("font-bold text-lg flex items-center", ann.indexAdjustedReturn > 0 ? "text-green-600" : "text-red-600")}>
                                       {ann.indexAdjustedReturn.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">Volume Spike</span>
                                    <span className="font-bold text-lg flex items-center">
                                       {ann.volumeSpikeRatio.toFixed(1)}x
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">Volatility</span>
                                    <span className="font-bold text-lg flex items-center">
                                       +{ann.volatilityExpansion}%
                                    </span>
                                </div>
                            </div>

                            <Collapsible>
                                <CollapsibleContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm">{ann.fullText}</p>
                                </CollapsibleContent>
                                <CollapsibleTrigger asChild>
                                    <Button variant="link" className="p-0 h-auto text-xs">
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                        View Full Disclosure
                                    </Button>
                                </CollapsibleTrigger>
                            </Collapsible>
                            
                            <Separator />

                            <div>
                                <h4 className="font-semibold text-sm mb-2">Key Drivers (ML Explanation)</h4>
                                <div className="space-y-2 text-sm">
                                    {ann.drivers.map((driver, i) => (
                                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                                            <ChevronsRight className="h-4 w-4 text-primary" />
                                            <span>{driver}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <Separator />

                            <div className="flex items-center justify-between text-sm">
                               <div className="flex items-center gap-2 font-medium text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                    Disclosure Verification
                               </div>
                                <span className='text-xs'>Official exchange filing confirmed</span>
                            </div>

                            {ann.portfolioImpact && ann.portfolioExposure && (
                                <>
                                 <Separator />
                                <Card className='bg-primary/5 dark:bg-primary/10 border-primary/20'>
                                    <CardContent className='pt-4'>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Briefcase className='w-4 h-4'/>Your Portfolio Impact</h4>
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <div className='text-xs text-muted-foreground'>Portfolio Exposure</div>
                                                <div className='font-bold'>{ann.portfolioExposure}%</div>
                                            </div>
                                             <div>
                                                <div className='text-xs text-muted-foreground'>Today's Impact</div>
                                                <div className={cn('font-bold', ann.portfolioImpact > 0 ? "text-green-600" : "text-red-600")}>{ann.portfolioImpact}%</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}