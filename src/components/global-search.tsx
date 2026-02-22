'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Newspaper, FileText, Loader2 } from 'lucide-react';
import { announcementsData, newsData, portfolioData } from '@/lib/data';
import Link from 'next/link';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

interface SearchResult {
  stocks: any[];
  announcements: any[];
  news: any[];
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback((currentQuery: string): SearchResult => {
    if (!currentQuery) {
      return { stocks: [], announcements: [], news: [] };
    }
    const lowerCaseQuery = currentQuery.toLowerCase();
    
    const stocks = portfolioData.holdings.filter(
      (h) =>
        h.symbol.toLowerCase().includes(lowerCaseQuery) ||
        h.name.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5);

    const announcements = announcementsData.filter(
        (a) => a.companyName.toLowerCase().includes(lowerCaseQuery) || a.fullText.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5);

    const news = newsData.filter(
        (n) => n.headline.toLowerCase().includes(lowerCaseQuery) || n.relatedCompany.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5);

    return { stocks, announcements, news };
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      const searchResults = performSearch(debouncedQuery);
      setResults(searchResults);
      setIsLoading(false);
    } else {
      setResults(null);
    }
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setIsFocused(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);


  const hasResults = results && (results.stocks.length > 0 || results.announcements.length > 0 || results.news.length > 0);

  return (
    <div className="relative w-full md:w-[200px] lg:w-[336px]" ref={searchRef}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search stocks, news, entities..."
        className="w-full rounded-lg bg-background pl-8"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && (query.length > 0) && (
        <Card className="absolute top-full mt-2 w-full max-h-[60vh] overflow-y-auto z-50">
           <div className='p-4'>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : hasResults ? (
                <div className='space-y-4'>
                    {results.stocks.length > 0 && (
                        <div>
                            <h4 className='text-xs font-semibold text-muted-foreground px-2 mb-2'>Stocks</h4>
                             {results.stocks.map((stock) => (
                                <Link key={stock.id} href={`/stock/${stock.symbol}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted" onClick={() => setIsFocused(false)}>
                                    <div className="bg-muted p-2 rounded-md"><TrendingUp className="h-4 w-4" /></div>
                                    <div>
                                        <p className="text-sm font-semibold">{stock.symbol}</p>
                                        <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                                    </div>
                                    <div className='ml-auto text-right'>
                                        <p className={cn("text-sm font-semibold", stock.dayChange >= 0 ? "text-green-600" : "text-red-600")}>
                                            {stock.dayChangePercentage.toFixed(2)}%
                                        </p>
                                        <p className='text-xs text-muted-foreground'>Risk: {stock.riskScore}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                     {results.announcements.length > 0 && (
                        <div>
                            <h4 className='text-xs font-semibold text-muted-foreground px-2 mb-2'>Announcements</h4>
                             {results.announcements.map((item) => (
                                <Link key={item.id} href={`/stock/${item.symbol}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted" onClick={() => setIsFocused(false)}>
                                    <div className="bg-muted p-2 rounded-md"><FileText className="h-4 w-4" /></div>
                                    <div>
                                        <p className="text-sm font-semibold truncate line-clamp-1">{item.companyName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{item.fullText}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {results.news.length > 0 && (
                        <div>
                            <h4 className='text-xs font-semibold text-muted-foreground px-2 mb-2'>News</h4>
                             {results.news.map((item) => (
                                <Link key={item.id} href={`/stock/${item.symbol}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted" onClick={() => setIsFocused(false)}>
                                    <div className="bg-muted p-2 rounded-md"><Newspaper className="h-4 w-4" /></div>
                                    <div>
                                        <p className="text-sm font-semibold truncate">{item.headline}</p>
                                        <p className="text-xs text-muted-foreground">{item.source}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-sm text-muted-foreground p-4">
                    No results for &quot;{debouncedQuery}&quot;
                </div>
            )}
           </div>
        </Card>
      )}
    </div>
  );
}
