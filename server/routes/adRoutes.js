import express from 'express';
const router = express.Router();
import { getAds, createAd } from '../controllers/adController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { adSchema } from '../validators/adValidator.js';
router.route('/').get(getAds).post(protect, role(['admin']), validate(adSchema), createAd);
export default router;