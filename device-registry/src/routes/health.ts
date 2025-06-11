import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  res.json({
    appStatus: 'healthy',
    uptime: `${Math.floor(uptime)} seconds`,
    memoryUsage: {
      rss: memoryUsage.rss,
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
