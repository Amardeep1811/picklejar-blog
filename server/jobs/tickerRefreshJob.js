import cron from 'node-cron';
import axios from 'axios';
import TickerSnapshot from '../models/TickerSnapshot.js';

export const fetchTickerBatch = async () => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.warn('[TickerRefresh] ALPHA_VANTAGE_API_KEY is not set. Skipping batch fetch.');
    return;
  }

  const symbols = [
    'SPY', 'QQQ', 'DIA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META',
    'BRK.B', 'JPM', 'V', 'WMT', 'JNJ', 'PG', 'MA', 'HD', 'CVX', 'ABBV'
  ];
  const fetchedData = [];

  console.log(`[TickerRefresh] Fetching ticker batch of ${symbols.length} symbols...`);

  for (const sym of symbols) {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${sym}&apikey=${apiKey}`);
      
      if (response.data.Information) {
        console.warn(`[TickerRefresh] Alpha Vantage rate limit hit during fetch for ${sym}. Stopping batch gracefully.`);
        break;
      }

      const quote = response.data['Global Quote'];
      if (quote && quote['10. change percent']) {
        const changeStr = quote['10. change percent'];
        const changeFloat = parseFloat(changeStr);
        fetchedData.push({
          symbol: sym,
          change: (changeFloat > 0 ? '+' : '') + changeFloat.toFixed(1) + '%',
          up: changeFloat >= 0,
          isStatic: false
        });
      }
    } catch (err) {
      console.error(`[TickerRefresh] Failed to fetch Alpha Vantage data for ${sym}`, err);
    }
  }

  if (fetchedData.length > 0) {
    // Add static items to mix them in, similar to default ticker data
    const finalData = [
      fetchedData.find(t => t.symbol === 'SPY') || { symbol: 'SPY', change: '0.0%', up: true },
      { symbol: 'MARKET UPDATES', change: 'LIVE', up: true, isStatic: true },
      fetchedData.find(t => t.symbol === 'QQQ') || { symbol: 'QQQ', change: '0.0%', up: true },
      { symbol: 'LATEST STORIES', change: 'NEW', up: true, isStatic: true }
    ];

    // Append the rest of the successfully fetched symbols that aren't SPY/QQQ
    for (const data of fetchedData) {
      if (data.symbol !== 'SPY' && data.symbol !== 'QQQ') {
        finalData.push(data);
      }
    }

    finalData.push({ symbol: 'EXPERT ANALYSIS', change: 'DAILY', up: true, isStatic: true });

    await TickerSnapshot.create({ data: finalData });
    console.log(`[TickerRefresh] Successfully fetched and stored ${fetchedData.length} symbols.`);
  } else {
    console.log('[TickerRefresh] No data was fetched successfully. Not updating TickerSnapshot.');
  }
};

export const initTickerRefreshJob = async () => {
  try {
    // Run once on startup if no snapshot exists
    const existingSnapshot = await TickerSnapshot.findOne();
    if (!existingSnapshot) {
      console.log('[TickerRefresh] No existing snapshot found. Running initial batch fetch...');
      await fetchTickerBatch();
    }

    // Schedule job to run every morning at 6:00 AM
    cron.schedule('0 6 * * *', async () => {
      console.log('[TickerRefresh] Running scheduled ticker batch fetch...');
      await fetchTickerBatch();
    });

    console.log('[TickerRefresh] Cron job initialized (runs daily at 6:00 AM)');
  } catch (error) {
    console.error('[TickerRefresh] Failed to initialize ticker refresh job:', error);
  }
};
