import { Router } from 'express';
import * as ctrl from '../controllers/contact.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { contactLimiter } from '../middleware/rateLimit.middleware.js';
import { contactSchema, subscribeSchema } from '../validators/contact.validator.js';

const router = Router();

// Public
router.post('/', contactLimiter, validate(contactSchema), ctrl.submitMessage);
router.post('/subscribe', contactLimiter, validate(subscribeSchema), ctrl.subscribe);

// Admin
router.get('/', protect, adminOnly, ctrl.listMessages);
router.get('/subscribers', protect, adminOnly, ctrl.listSubscribers);
router.get('/:id', protect, adminOnly, ctrl.getMessage);
router.patch('/:id/read', protect, adminOnly, ctrl.markAsRead);
router.patch('/:id', protect, adminOnly, ctrl.updateMessage);
router.delete('/:id', protect, adminOnly, ctrl.deleteMessage);

export default router;
