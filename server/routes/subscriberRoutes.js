import express from 'express';
import rateLimit from 'express-rate-limit';
const router = express.Router();
import { subscribe, getSubscribers } from '../controllers/subscriberController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { subscriberSchema } from '../validators/subscriberValidator.js';

const subscriberLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many subscription attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.route('/').post(subscriberLimiter, validate(subscriberSchema), subscribe).get(protect, role(['admin']), getSubscribers);
export default router;