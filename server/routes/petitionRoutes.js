import express from 'express';
import {
  getPetitions,
  createPetition,
  updatePetition,
  deletePetition,
  signPetition,
  getPetitionSignatures
} from '../controllers/petitionController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createPetitionSchema, updatePetitionSchema } from '../validators/petitionValidator.js';
import rateLimit from 'express-rate-limit';

const signLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.route('/')
  .get(getPetitions)
  .post(protect, role(['admin']), validate(createPetitionSchema), createPetition);

router.route('/:id')
  .put(protect, role(['admin']), validate(updatePetitionSchema), updatePetition)
  .delete(protect, role(['admin']), deletePetition);

router.route('/:id/sign')
  .post(signLimiter, signPetition);

router.route('/:id/signatures')
  .get(protect, role(['admin']), getPetitionSignatures);

export default router;
