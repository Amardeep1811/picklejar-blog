import asyncHandler from '../utils/asyncHandler.js';
import { getCached, setCached } from '../utils/simpleCache.js';
import axios from 'axios';

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
  const cacheKey = 'market_ticker';
  const cachedData = getCached(cacheKey);

  if (cachedData) {
    return res.status(200).json({ success: true, data: cachedData });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ success: true, data: DEFAULT_TICKER_DATA });
  }

  try {
    // Reduced to 2 symbols to save API calls
    const symbols = ['SPY', 'QQQ'];
    const tickerData = [];

    for (const sym of symbols) {
      try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${apiKey}`);
        const quote = response.data['Global Quote'];
        
        // If rate limited, Alpha Vantage returns an "Information" key and no "Global Quote", so quote is undefined
        if (quote && quote['10. change percent']) {
          const changeStr = quote['10. change percent'];
          const changeFloat = parseFloat(changeStr);
          tickerData.push({
            symbol: sym,
            change: (changeFloat > 0 ? '+' : '') + changeFloat.toFixed(1) + '%',
            up: changeFloat >= 0
          });
        }
      } catch (err) {
        console.error(`Failed to fetch Alpha Vantage data for ${sym}`, err);
      }
    }

    // If all requests failed, fallback to default
    let finalData = DEFAULT_TICKER_DATA;
    if (tickerData.length > 0) {
      finalData = [
        tickerData.find(t => t.symbol === 'SPY') || { symbol: 'SPY', change: '0.0%', up: true },
        { symbol: 'MARKET UPDATES', change: 'LIVE', up: true, isStatic: true },
        tickerData.find(t => t.symbol === 'QQQ') || { symbol: 'QQQ', change: '0.0%', up: true },
        { symbol: 'LATEST STORIES', change: 'NEW', up: true, isStatic: true },
        { symbol: '14 NEW POSTS TODAY', change: 'READ', up: true, isStatic: true },
        { symbol: 'EXPERT ANALYSIS', change: 'DAILY', up: true, isStatic: true }
      ];
    }
    
    // Cache for 4 hours (14400 seconds) to heavily conserve API calls
    setCached(cacheKey, finalData, 14400);

    res.status(200).json({ success: true, data: finalData });
  } catch (error) {
    console.error('Market ticker fetch error', error);
    res.status(200).json({ success: true, data: DEFAULT_TICKER_DATA });
  }
});
