import express from 'express';
const router = express.Router();
import { getMarketTicker } from '../controllers/marketController.js';

router.route('/ticker').get(getMarketTicker);

export default router;
