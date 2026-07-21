import express from 'express';
import {
  getPetitions,
  createPetition,
  updatePetition,
  deletePetition
} from '../controllers/petitionController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createPetitionSchema, updatePetitionSchema } from '../validators/petitionValidator.js';

const router = express.Router();

router.route('/')
  .get(getPetitions)
  .post(protect, role(['admin']), validate(createPetitionSchema), createPetition);

router.route('/:id')
  .put(protect, role(['admin']), validate(updatePetitionSchema), updatePetition)
  .delete(protect, role(['admin']), deletePetition);

export default router;
