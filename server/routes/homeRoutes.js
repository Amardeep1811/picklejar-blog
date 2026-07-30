import express from 'express';
import { getHomeData } from '../controllers/homeController.js';

const router = express.Router();

router.route('/').get(getHomeData);

export default router;
