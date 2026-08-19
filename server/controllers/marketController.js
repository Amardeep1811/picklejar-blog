import asyncHandler from '../utils/asyncHandler.js';
import TickerSnapshot from '../models/TickerSnapshot.js';

// Default fallback data matching the old hardcoded ticker content
const DEFAULT_TICKER_DATA = [
  { symbol: 'SPY', change: '+1.2%', up: true },
  { symbol: 'MARKET UPDATES', change: 'LIVE', up: true, isStatic: true },
  { symbol: 'QQQ', change: '-0.4%', up: false },
  { symbol: 'LATEST STORIES', change: 'NEW', up: true, isStatic: true },
  { symbol: 'BTC', change: '+5.7%', up: true },
  { symbol: 'EXPERT ANALYSIS', change: 'READ', up: true, isStatic: true },
];

export const getMarketTicker = asyncHandler(async (req, res) => {
  try {
    const snapshot = await TickerSnapshot.findOne().sort({ fetchedAt: -1 });
    
    if (snapshot && snapshot.data && snapshot.data.length > 0) {
      return res.status(200).json({ success: true, data: snapshot.data });
    }

    res.status(200).json({ success: true, data: DEFAULT_TICKER_DATA });
  } catch (error) {
    console.error('Market ticker fetch error', error);
    res.status(200).json({ success: true, data: DEFAULT_TICKER_DATA });
  }
});
