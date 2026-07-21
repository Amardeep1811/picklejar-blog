import express from 'express';
import { getLatestTrending, recomputeTrending } from '../controllers/trendingController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getLatestTrending);

router.route('/recompute')
  .post(protect, role(['admin']), recomputeTrending);

export default router;
