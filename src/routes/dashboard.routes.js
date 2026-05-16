import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/stats', protect, adminOnly, ctrl.getStats);

export default router;
