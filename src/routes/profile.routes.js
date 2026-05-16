import { Router } from 'express';
import * as ctrl from '../controllers/profile.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { uploadImage, uploadFile } from '../config/cloudinary.js';

const router = Router();

// Public
router.get('/', ctrl.getProfile);

// Admin
router.put('/', protect, adminOnly, ctrl.updateProfile);
router.post('/avatar', protect, adminOnly, uploadImage.single('avatar'), ctrl.uploadAvatar);
router.post('/resume', protect, adminOnly, uploadFile.single('resume'), ctrl.uploadResume);

export default router;
