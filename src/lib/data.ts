import type { Portfolio, WatchlistItem, Announcement, SectorAllocation, NewsItem, LiveRiskData } from './types';

export const portfolioData: Portfolio = {
  totalInvested: 155500,
  currentValue: 162750,
  totalPnl: 7250,
  totalPnlPercentage: 4.66,
  dayPnl: 1250,
  dayPnlPercentage: 0.77,
  holdings: [
    {
      id: '1',
      symbol: 'RELIANCE.NS',
      name: 'Reliance Industries',
      quantity: 10,
      avgPrice: 2850,
      ltp: 2950,
      sector: 'Energy',
      invested: 28500,
      currentValue: 29500,
      pnl: 1000,
      dayPnl: 250,
      dayChange: 25,
      dayChangePercentage: 0.85,
      riskScore: 78,
      lastEvent: 'High abnormal reaction'
    },
    {
      id: '2',
      symbol: 'TCS.NS',
      name: 'Tata Consultancy Services',
      quantity: 15,
      avgPrice: 3800,
      ltp: 3850,
      sector: 'Information Technology',
      invested: 57000,
      currentValue: 57750,
      pnl: 750,
      dayPnl: 300,
      dayChange: 20,
      dayChangePercentage: 0.52,
      riskScore: 25,
      lastEvent: 'Earnings announced 4h ago'
    },
    {
      id: '3',
      symbol: 'HDFCBANK.NS',
      name: 'HDFC Bank',
      quantity: 20,
      avgPrice: 1500,
      ltp: 1525,
      sector: 'Financials',
      invested: 30000,
      currentValue: 30500,
      pnl: 500,
      dayPnl: 100,
      dayChange: 5,
      dayChangePercentage: 0.33,
      riskScore: 45,
      lastEvent: 'Elevated movement'
    },
    {
      id: '4',
      symbol: 'INFY.NS',
      name: 'Infosys',
      quantity: 25,
      avgPrice: 1600,
      ltp: 1800,
      sector: 'Information Technology',
      invested: 40000,
      currentValue: 45000,
      pnl: 5000,
      dayPnl: 600,
      dayChange: 24,
      dayChangePercentage: 1.35,
      riskScore: 15,
      lastEvent: 'Normal trading day'
    },
  ],
};

export const sectorAllocations: SectorAllocation[] = [
  { sector: 'Information Technology', value: 102750, riskLevel: 'Normal' },
  { sector: 'Energy', value: 29500, riskLevel: 'High' },
  { sector: 'Financials', value: 30500, riskLevel: 'Elevated' },
];

export const watchlistData: WatchlistItem[] = [
  { id: '1', symbol: 'RELIANCE.NS', name: 'Reliance', price: 2950.00, change: 25.50, changePercentage: 0.87, riskScore: 78 },
  { id: '2', symbol: 'TCS.NS', name: 'TCS', price: 3850.20, change: 15.10, changePercentage: 0.39, riskScore: 25 },
  { id: '3', symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1525.80, change: -5.40, changePercentage: -0.35, riskScore: 45 },
  { id: '4', symbol: 'INFY.NS', name: 'Infosys', price: 1800.00, change: 24.00, changePercentage: 1.35, riskScore: 15 },
  { id: '5', symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1100.50, change: 10.20, changePercentage: 0.93, riskScore: 10 },
  { id: '6', symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', price: 1205.00, change: -8.10, changePercentage: -0.67, riskScore: 55 },
];


export const announcementsData: Announcement[] = [
    {
      id: '1',
      symbol: 'RELIANCE.NS',
      companyName: 'Reliance Industries',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      fullText: 'Reliance Industries Limited is pleased to announce a strategic partnership with ABC Infra Pvt Ltd, a leader in renewable energy solutions. This collaboration, backed by DEF Capital, aims to develop 5GW of solar capacity in Rajasthan. This move strengthens our commitment to sustainable energy and is expected to generate significant value for our shareholders.',
      riskScore: 78,
      abnormalReturn: -4.8,
      volumeSpikeRatio: 3.6,
      category: 'M&A',
      indexAdjustedReturn: -5.3,
      volatilityExpansion: 140,
      drivers: ['Significant divergence from sector', 'Elevated trade intensity', 'Liquidity imbalance detected'],
      isVerified: true,
      portfolioExposure: 18.13,
      portfolioImpact: -0.87
    },
    {
      id: '2',
      symbol: 'TCS.NS',
      companyName: 'Tata Consultancy Services',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      fullText: 'TCS has secured a multi-year, multi-million dollar deal with a leading European bank to transform its digital core. This partnership will leverage TCS\'s expertise in cloud and AI to enhance customer experience and operational efficiency.',
      riskScore: 25,
      abnormalReturn: 0.8,
      volumeSpikeRatio: 1.2,
      category: 'Regulatory',
      indexAdjustedReturn: 0.5,
      volatilityExpansion: 25,
      drivers: ['Normal market reaction', 'Volume within historical range'],
      isVerified: true,
      portfolioExposure: 35.48,
      portfolioImpact: 0.18
    },
    {
        id: '3',
        symbol: 'HDFCBANK.NS',
        companyName: 'HDFC Bank',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        fullText: 'The Board of Directors of HDFC Bank will meet on Friday, 26th July 2024, to consider and approve the unaudited financial results for the quarter ending June 30, 2024.',
        riskScore: 45,
        abnormalReturn: -2.1,
        volumeSpikeRatio: 2.5,
        category: 'Earnings',
        indexAdjustedReturn: -2.5,
        volatilityExpansion: 60,
        drivers: ['Elevated volume ahead of results', 'Price underperforming the banking index'],
        isVerified: true,
    },
    {
        id: '4',
        symbol: 'BHARTIARTL.NS',
        companyName: 'Bharti Airtel',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        fullText: 'Bharti Airtel announced a revision in its prepaid tariff plans, effective from July 3rd, 2024. The company stated this is to improve ARPU and invest in network expansion. The base plan will see an increase of approximately 15%.',
        riskScore: 55,
        abnormalReturn: -3.2,
        volumeSpikeRatio: 3.0,
        category: 'Fundraising',
        indexAdjustedReturn: -3.0,
        volatilityExpansion: 90,
        drivers: ['Negative reaction to price hike news', 'Volume 3x baseline'],
        isVerified: true,
    }
];

export const liveRiskMonitorData: LiveRiskData[] = [
    {
      id: '1',
      symbol: 'ADANIENT.NS',
      name: 'Adani Enterprises',
      riskScore: 89,
      confidence: 0.92,
      lastHourTrend: [80, 82, 85, 89],
      drivers: { text: 'Volume 5.2x baseline', type: 'volume' },
      marketDivergence: { stockReturn: -7.2, indexReturn: 1.1 },
      volumeRatio: 5.2,
      timeSinceTrigger: '12 min ago',
      trend: 'increasing',
      hasDisclosure: false,
      preDisclosureMovement: false,
      isCooling: false,
    },
    {
      id: '2',
      symbol: 'RELIANCE.NS',
      name: 'Reliance Industries',
      riskScore: 78,
      confidence: 0.85,
      lastHourTrend: [70, 72, 75, 78],
      drivers: { text: 'Unusual options activity', type: 'volatility' },
      marketDivergence: { stockReturn: -4.8, indexReturn: 1.1 },
      volumeRatio: 3.6,
      timeSinceTrigger: '45 min ago',
      trend: 'increasing',
      hasDisclosure: true,
      preDisclosureMovement: true,
      isCooling: false,
      portfolioExposure: 18.13,
    },
    {
      id: '3',
      symbol: 'YESBANK.NS',
      name: 'Yes Bank',
      riskScore: 72,
      confidence: 0.77,
      lastHourTrend: [75, 74, 73, 72],
      drivers: { text: 'High intraday volatility', type: 'volatility' },
      marketDivergence: { stockReturn: 6.1, indexReturn: 1.2 },
      volumeRatio: 4.1,
      timeSinceTrigger: '1.2 hr ago',
      trend: 'decreasing',
      hasDisclosure: false,
      preDisclosureMovement: false,
      isCooling: true,
    },
    {
      id: '4',
      symbol: 'BHARTIARTL.NS',
      name: 'Bharti Airtel',
      riskScore: 55,
      confidence: 0.88,
      lastHourTrend: [50, 52, 53, 55],
      drivers: { text: 'Price moved opposite to sector', type: 'price' },
      marketDivergence: { stockReturn: -3.2, indexReturn: 1.2 },
      volumeRatio: 2.1,
      timeSinceTrigger: '3 hr ago',
      trend: 'stable',
      hasDisclosure: true,
      preDisclosureMovement: false,
      isCooling: false,
    }
  ];

export const newsData: NewsItem[] = [
  {
    id: '1',
    headline: 'Reliance Retail to acquire 51% stake in Ed-a-Mamma, a kid and maternity-wear brand',
    source: 'Moneycontrol',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    relatedCompany: 'Reliance Industries',
    symbol: 'RELIANCE.NS',
    tags: ['M&A'],
    impact: {
      status: 'High abnormal reaction',
      riskScore: 78,
    },
  },
  {
    id: '2',
    headline: 'TCS partners with Bank of America for core banking transformation',
    source: 'Livemint',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    relatedCompany: 'TCS',
    symbol: 'TCS.NS',
    tags: ['Regulatory'],
    impact: {
      status: 'No abnormal reaction',
    },
  },
  {
    id: '3',
    headline: 'HDFC Bank board to consider fundraising via bonds in upcoming meeting',
    source: 'Reuters',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    relatedCompany: 'HDFC Bank',
    symbol: 'HDFCBANK.NS',
    tags: ['Fundraising', 'Management change'],
    impact: {
      status: 'Elevated movement',
      riskScore: 45,
    },
  },
  {
    id: '4',
    headline: 'Infosys Q2 earnings preview: Margins likely to improve, but revenue growth may be soft',
    source: 'Economic Times',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    relatedCompany: 'Infosys',
    symbol: 'INFY.NS',
    tags: ['Earnings'],
    impact: {
      status: 'No abnormal reaction',
    },
  },
    {
    id: '5',
    headline: 'Airtel hits 50 million unique 5G users, network covers all districts in India',
    source: 'Business Standard',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    relatedCompany: 'Bharti Airtel',
    symbol: 'BHARTIARTL.NS',
    tags: ['Regulatory'],
    impact: {
      status: 'Elevated movement',
      riskScore: 55,
    },
  },
];


export const getStockData = (symbol: string) => {
    const holding = portfolioData.holdings.find(h => h.symbol === symbol);
    if(holding) {
      const { ltp, ...rest } = holding;
      return { ...rest, price: ltp, ltp };
    }

    const watchlistItem = watchlistData.find(w => w.symbol === symbol);
    if(watchlistItem) return {
      ...watchlistItem,
      ltp: watchlistItem.price
    };
    
    const liveItem = liveRiskMonitorData.find(w => w.symbol === symbol);
    if(liveItem) return {
      id: liveItem.id,
      symbol: liveItem.symbol,
      name: liveItem.name,
      price: 0, // LTP not available in this data source
      ltp: 0,
      change: 0,
      changePercentage: 0,
      riskScore: liveItem.riskScore,
    };

    return null;
}

export const getAnnouncementForStock = (symbol: string) => {
    return announcementsData.find(a => a.symbol === symbol);
}
