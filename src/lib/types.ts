import { IntelligenceChatOutput } from "./ai/flows/chat-flow";

export type Holding = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  ltp: number;
  sector: string;
  invested: number;
  currentValue: number;
  pnl: number;
  dayPnl: number;
  dayChange: number;
  dayChangePercentage: number;
};

export type Portfolio = {
  totalInvested: number;
  currentValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
  dayPnl: number;
  dayPnlPercentage: number;
  holdings: Holding[];
};

export type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercentage: number;
  riskScore: number;
};

export type Announcement = {
  id: string;
  symbol: string;
  companyName: string;
  timestamp: string;
  fullText: string;
  riskScore: number;
  abnormalReturn: number;
  volumeSpikeRatio: number;
  category: 'M&A' | 'Earnings' | 'Fundraising' | 'Regulatory';
  indexAdjustedReturn: number;
  volatilityExpansion: number;
  drivers: string[];
  isVerified: boolean;
  portfolioExposure?: number;
  portfolioImpact?: number;
};

export type SectorAllocation = {
  sector: string;
  value: number;
};

export type StockData = {
    id: string;
    symbol: string;
    name: string;
    price: number;
    ltp: number;
    change?: number;
    changePercentage?: number;
    riskScore?: number;
    quantity?: number;
    avgPrice?: number;
    sector?: string;
    invested?: number;
    currentValue?: number;
    pnl?: number;
    dayPnl?: number;
    dayChange?: number;
}

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  relatedCompany: string;
  symbol: string;
  tags: ('Earnings' | 'M&A' | 'Regulatory' | 'Rumor' | 'Fundraising' | 'Management change')[];
  impact: {
    status: 'No abnormal reaction' | 'Elevated movement' | 'High abnormal reaction';
    riskScore?: number;
  };
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ui?: IntelligenceChatOutput;
};
