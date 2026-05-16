import { Router } from 'express';
import * as ctrl from '../controllers/upload.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { uploadImage, uploadFile } from '../config/cloudinary.js';

const router = Router();
router.post('/image', protect, adminOnly, uploadImage.single('file'), ctrl.uploadSingle);
router.post('/images', protect, adminOnly, uploadImage.array('files', 10), ctrl.uploadMultiple);
router.post('/file', protect, adminOnly, uploadFile.single('file'), ctrl.uploadSingle);
router.delete('/', protect, adminOnly, ctrl.deleteUpload);

export default router;
