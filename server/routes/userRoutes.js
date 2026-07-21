import express from 'express';
const router = express.Router();
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { userCreateSchema, userUpdateSchema } from '../validators/userValidator.js';

router.route('/')
  .post(protect, role(['admin']), validate(userCreateSchema), createUser)
  .get(protect, role(['admin']), getUsers);

router.route('/:id')
  .put(protect, role(['admin']), validate(userUpdateSchema), updateUser)
  .delete(protect, role(['admin']), deleteUser);

export default router;