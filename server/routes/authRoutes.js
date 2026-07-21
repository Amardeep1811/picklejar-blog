import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { loginSchema } from '../validators/authValidator.js';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/authMiddleware.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});

const router = express.Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;