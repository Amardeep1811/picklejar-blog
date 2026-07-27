import cron from 'node-cron';
import { computeTrending } from '../utils/computeTrending.js';
import TrendingSnapshot from '../models/TrendingSnapshot.js';

export const initTrendingJob = async () => {
  try {
    // Check if we need to run an initial computation
    const existingSnapshot = await TrendingSnapshot.findOne();
    if (!existingSnapshot) {
      console.log('[Trending] No existing snapshot found. Running initial computation...');
      await computeTrending();
    }

    // Schedule job to run every 3 hours
    // '0 */3 * * *'
    // cron.schedule('0 */3 * * *', async () => {
    //   console.log('[Trending] Running scheduled trending computation...');
    //   await computeTrending();
    // });

    console.log('[Trending] Cron job initialized (runs every 3 hours)');
  } catch (error) {
    console.error('[Trending] Failed to initialize trending job:', error);
  }
};
