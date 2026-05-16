import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me', protect, ctrl.getMe);
router.patch('/me', protect, ctrl.updateMe);
router.post('/change-password', protect, validate(changePasswordSchema), ctrl.changePassword);

// Password reset (public, rate-limited to prevent abuse)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword);
router.get('/reset-password/:token', ctrl.verifyResetToken);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), ctrl.resetPassword);

// Only admins can create more users
router.post('/register', protect, adminOnly, validate(registerSchema), ctrl.register);

export default router;
