import type { Portfolio, WatchlistItem, Announcement, SectorAllocation } from './types';

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
    },
  ],
};

export const sectorAllocations: SectorAllocation[] = [
  { sector: 'Information Technology', value: 102750 },
  { sector: 'Energy', value: 29500 },
  { sector: 'Financials', value: 30500 },
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
      timestamp: new Date().toISOString(),
      fullText: 'Reliance Industries Limited is pleased to announce a strategic partnership with ABC Infra Pvt Ltd, a leader in renewable energy solutions. This collaboration, backed by DEF Capital, aims to develop 5GW of solar capacity in Rajasthan. This move strengthens our commitment to sustainable energy and is expected to generate significant value for our shareholders.',
      riskScore: 78,
      abnormalReturn: -6.4,
      volumeSpikeRatio: 4.1
    },
    {
      id: '2',
      symbol: 'TCS.NS',
      companyName: 'Tata Consultancy Services',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      fullText: 'TCS has secured a multi-year, multi-million dollar deal with a leading European bank to transform its digital core. This partnership will leverage TCS\'s expertise in cloud and AI to enhance customer experience and operational efficiency.',
      riskScore: 25,
      abnormalReturn: 0.8,
      volumeSpikeRatio: 1.2
    },
    {
        id: '3',
        symbol: 'HDFCBANK.NS',
        companyName: 'HDFC Bank',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        fullText: 'The Board of Directors of HDFC Bank will meet on Friday, 26th July 2024, to consider and approve the unaudited financial results for the quarter ending June 30, 2024.',
        riskScore: 45,
        abnormalReturn: -2.1,
        volumeSpikeRatio: 2.5
    },
    {
        id: '4',
        symbol: 'BHARTIARTL.NS',
        companyName: 'Bharti Airtel',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        fullText: 'Bharti Airtel announced a revision in its prepaid tariff plans, effective from July 3rd, 2024. The company stated this is to improve ARPU and invest in network expansion. The base plan will see an increase of approximately 15%.',
        riskScore: 55,
        abnormalReturn: -3.2,
        volumeSpikeRatio: 3.0
    }
];

export const getStockData = (symbol: string) => {
    const holding = portfolioData.holdings.find(h => h.symbol === symbol);
    if(holding) return holding;

    const watchlistItem = watchlistData.find(w => w.symbol === symbol);
    if(watchlistItem) return {
      ...watchlistItem,
      ltp: watchlistItem.price
    };

    return null;
}

export const getAnnouncementForStock = (symbol: string) => {
    return announcementsData.find(a => a.symbol === symbol);
}
