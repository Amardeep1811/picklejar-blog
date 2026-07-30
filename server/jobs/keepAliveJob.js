import cron from 'node-cron';

export const initKeepAliveJob = async () => {
  const selfUrl = process.env.SELF_URL;
  if (!selfUrl) {
    console.warn('[KeepAlive] SELF_URL not set, skipping.');
    return;
  }

  cron.schedule('*/10 * * * *', async () => {
    try {
      const res = await fetch(`${selfUrl}/api/health`);
      console.log(`[KeepAlive] Ping ${res.status} at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('[KeepAlive] Ping failed:', err.message);
    }
  });
  console.log('[KeepAlive] Cron job initialized (runs every 10 minutes)');
};
