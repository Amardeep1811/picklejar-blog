import cron from 'node-cron';
import Ad from '../models/Ad.js';

export const initExpiredAdsJob = async () => {
  try {
    const now = new Date();
    const result = await Ad.deleteMany({ endDate: { $lt: now } });
    
    if (result.deletedCount > 0) {
      console.log(`[Ads Cleanup] Removed ${result.deletedCount} expired ads on startup.`);
    }

    cron.schedule('0 * * * *', async () => {
      const currentNow = new Date();
      const res = await Ad.deleteMany({ endDate: { $lt: currentNow } });
      if (res.deletedCount > 0) {
        console.log(`[Ads Cleanup] Removed ${res.deletedCount} expired ads.`);
      }
    });

    console.log('[Ads Cleanup] Cron job initialized (runs every hour)');
  } catch (error) {
    console.error('[Ads Cleanup] Failed to initialize expired ads job:', error);
  }
};
