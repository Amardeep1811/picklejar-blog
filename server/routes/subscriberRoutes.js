import express from 'express';
const router = express.Router();
import { subscribe, getSubscribers } from '../controllers/subscriberController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { subscriberSchema } from '../validators/subscriberValidator.js';
router.route('/').post(validate(subscriberSchema), subscribe).get(protect, role(['admin']), getSubscribers);
export default router;