import express from 'express';
const router = express.Router();
import { getVerticals, getFeaturedVerticals, createVertical, updateVertical, deleteVertical } from '../controllers/verticalController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { verticalSchema } from '../validators/verticalValidator.js';

router.route('/')
  .get(getVerticals)
  .post(protect, role(['admin']), validate(verticalSchema), createVertical);

router.route('/featured')
  .get(getFeaturedVerticals);

router.route('/:id')
  .put(protect, role(['admin']), validate(verticalSchema), updateVertical)
  .delete(protect, role(['admin']), deleteVertical);

export default router;