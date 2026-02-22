'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Search, Link as LinkIcon, FileText, Building, Landmark, Loader2, Sparkles, X, History, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const suggestionChips = [
  'ABC Ltd enters partnership with XYZ',
  'XYZ shares fall 5% after results',
  'Rumor about a merger between A and B',
  'Earnings announcement impact for INFY.NS'
];

// Mock data for the analysis result
const mockResult = {
  company: {
    name: 'RELIANCE.NS',
    isin: 'INE002A01018',
  },
  disclosure: {
    found: true,
  },
  reaction: {
    status: 'High Abnormal Reaction',
    riskScore: 78,
  },
  metrics: {
    abnormalReturn: -5.8,
    indexAdjustedReturn: -6.2,
    volumeSpike: 3.7,
    volatilityExpansion: 140,
  },
  drivers: [
    'Price moved opposite market direction',
    'Volume significantly above 30-day average',
    'Liquidity imbalance detected',
  ],
  entities: {
    issuer: 'Reliance Industries Ltd',
    counterparties: ['ABC Infra Pvt Ltd'],
    financialInstitutions: ['DEF Capital'],
    websiteDeclared: true,
  },
  relatedNews: [
    { id: 1, headline: 'Reliance Retail to acquire 51% stake in Ed-a-Mamma', riskScore: 78 },
    { id: 2, headline: 'RIL AGM: JioAirFiber, new energy investments announced', riskScore: 45 },
  ],
};

type AnalysisResult = typeof mockResult | null;
type ProcessingStep = { text: string; status: 'pending' | 'running' | 'complete' };

const processingStepsTemplate: ProcessingStep[] = [
    { text: 'Detecting referenced companies', status: 'pending' },
    { text: 'Checking official announcements', status: 'pending' },
    { text: 'Analyzing intraday market movement', status: 'pending' },
    { text: 'Generating anomaly score', status: 'pending' },
];

function getRiskInfo(score: number): { text: string; color: string; Icon: React.ElementType } {
  if (score > 60) return { text: 'High Abnormal Reaction', color: 'text-destructive', Icon: AlertCircle };
  if (score > 30) return { text: 'Elevated Movement', color: 'text-yellow-500', Icon: AlertCircle };
  return { text: 'Normal', color: 'text-green-500', Icon: CheckCircle };
}


export default function VerifyPage() {
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);

  const handleAnalyze = () => {
    if (!input.trim()) return;

    startTransition(() => {
      setAnalysisResult(null);
      
      const steps: ProcessingStep[] = JSON.parse(JSON.stringify(processingStepsTemplate));
      setProcessingSteps(steps);

      let currentStep = 0;
      const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].status = 'complete';
            currentStep++;
        }
        if (currentStep < steps.length) {
          steps[currentStep].status = 'running';
          setProcessingSteps([...steps]);
        } else {
          clearInterval(stepInterval);
          setAnalysisResult(mockResult);
          setProcessingSteps([]);
        }
      }, 700);

      steps[0].status = 'running';
      setProcessingSteps([...steps]);
    });
  };
  
  const handleClear = () => {
    setInput('');
    setAnalysisResult(null);
    setProcessingSteps([]);
  };

  const renderResultCard = () => {
    if (!analysisResult) return null;

    const riskInfo = getRiskInfo(analysisResult.reaction.riskScore);

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    Market Reaction Analysis Summary
                </CardTitle>
                <div className="flex items-baseline gap-4 pt-2">
                    <div className="text-lg font-bold">{analysisResult.company.name}</div>
                    <div className="text-xs text-muted-foreground">ISIN: {analysisResult.company.isin}</div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground">Official Disclosure Check</h3>
                        <div className={`flex items-center gap-2 ${analysisResult.disclosure.found ? 'text-green-500' : 'text-yellow-500'}`}>
                            {analysisResult.disclosure.found ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            <span className="font-medium">{analysisResult.disclosure.found ? 'Official announcement exists' : 'No matching official announcement found'}</span>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground">Market Reaction Status</h3>
                        <div className={`flex items-center gap-2 ${riskInfo.color}`}>
                            <riskInfo.Icon className="h-5 w-5" />
                            <span className="font-medium">{riskInfo.text}</span>
                        </div>
                    </div>
                </div>

                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground">Reaction Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-sm">
                                <div className="text-muted-foreground">Abnormal Return</div>
                                <div className="font-bold text-lg">{analysisResult.metrics.abnormalReturn}%</div>
                            </div>
                            <div className="text-sm">
                                <div className="text-muted-foreground">Index Adjusted</div>
                                <div className="font-bold text-lg">{analysisResult.metrics.indexAdjustedReturn}%</div>
                            </div>
                            <div className="text-sm">
                                <div className="text-muted-foreground">Volume Spike</div>
                                <div className="font-bold text-lg">{analysisResult.metrics.volumeSpike}x</div>
                            </div>
                             <div className="text-sm">
                                <div className="text-muted-foreground">Volatility</div>
                                <div className="font-bold text-lg">+{analysisResult.metrics.volatilityExpansion}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground">Risk Score</h3>
                        <div className="flex items-baseline justify-center bg-muted/50 rounded-lg p-4">
                            <span className="text-4xl font-bold text-destructive">{analysisResult.reaction.riskScore}</span>
                            <span className="text-lg text-muted-foreground">/ 100</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">Explanation Drivers</h3>
                    <div className="space-y-2">
                        {analysisResult.drivers.map((driver, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                <span>{driver}</span>
                            </div>
                        ))}
                    </div>
                </div>

                 <Button className="w-full" asChild>
                    <Link href={`/stock/${analysisResult.company.name}`}>View Full Stock Page</Link>
                </Button>

            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Entities Detected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Building className="h-4 w-4"/>Issuer</div>
                    <div className="font-semibold">{analysisResult.entities.issuer}</div>
                </div>
                 <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Landmark className="h-4 w-4"/>Counterparties</div>
                    <div className="font-semibold">{analysisResult.entities.counterparties.join(', ')}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Landmark className="h-4 w-4"/>Financial Institutions</div>
                    <div className="font-semibold">{analysisResult.entities.financialInstitutions.join(', ')}</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4"/>Website Declared</div>
                    <Badge variant={analysisResult.entities.websiteDeclared ? 'outline': 'secondary'}>{analysisResult.entities.websiteDeclared ? 'Yes': 'No'}</Badge>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Related Recent News</CardTitle>
            </CardHeader>
             <CardContent className="space-y-3">
                {analysisResult.relatedNews.map((news) => (
                    <div key={news.id} className="flex justify-between items-center text-sm">
                        <p className="line-clamp-1">{news.headline}</p>
                        <Badge variant={getRiskInfo(news.riskScore).text === 'Normal' ? 'default' : 'destructive'}>Risk: {news.riskScore}</Badge>
                    </div>
                ))}
             </CardContent>
        </Card>

        </>
    );
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Verify Content</h1>
        <p className="text-muted-foreground">
          Analyze news, links, or text for market reaction intelligence.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste news text, a link, a tweet, or a forwarded message here..."
              className="pr-10 h-32 text-base"
              maxLength={5000}
              disabled={isPending}
            />
            {input && (
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground" onClick={handleClear}>
                    <X className="h-4 w-4" />
                </Button>
            )}
            <div className="text-xs text-muted-foreground mt-1 text-right">{input.length} / 5000</div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {suggestionChips.map(s => (
                <Button key={s} variant="outline" size="sm" className="text-xs" onClick={() => setInput(s)} disabled={isPending}>{s}</Button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
             <Button onClick={handleAnalyze} disabled={!input.trim() || isPending} className="flex-1">
                {isPending ? <Loader2 className="animate-spin" /> : <Search />}
                <span>Analyze</span>
            </Button>
            <Button variant="secondary" disabled={isPending}><LinkIcon />Paste Link</Button>
          </div>
        </CardContent>
      </Card>
      
        {isPending && (
            <Card>
                <CardHeader>
                    <CardTitle>Processing...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {processingSteps.map((step, index) => (
                        <div key={index} className={cn("flex items-center gap-3 text-sm transition-opacity", step.status === 'pending' ? 'opacity-40' : 'opacity-100')}>
                            {step.status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>}
                            {step.status === 'running' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                            {step.status === 'complete' && <CheckCircle className="h-5 w-5 text-green-500" />}
                            <span className={cn(step.status === 'complete' && 'line-through text-muted-foreground')}>{step.text}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}

      {analysisResult && renderResultCard()}

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><History/> Recent Verifications</CardTitle>
            <CardDescription>Your last 10 verification checks.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground text-sm space-y-2">
            <p>Verification history will be shown here.</p>
            <p>(Backend connection required)</p>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 justify-center">
        <AlertCircle className="w-3.5 h-3.5"/>
        <span>Analysis based on statistical market reaction indicators. Not investment advice.</span>
      </div>

    </div>
  );
}