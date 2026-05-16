import { Router } from 'express';
import * as ctrl from '../controllers/settings.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', ctrl.getSettings);
router.put('/', protect, adminOnly, ctrl.updateSettings);

export default router;
