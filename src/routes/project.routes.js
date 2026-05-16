import { Router } from 'express';
import { Project } from '../models/Project.js';
import { crudController } from '../controllers/crud.factory.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { uploadImage } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';

const ctrl = crudController(Project, {
  searchFields: ['title', 'shortDescription'],
  filterFields: ['category', 'isFeatured', 'isPublished'],
  booleanFields: ['isFeatured', 'isPublished'],
  defaultSort: 'order -createdAt',
});

const router = Router();

router.get('/', ctrl.list);
router.get('/:idOrSlug', ctrl.getOne);

// Increment view count (public)
router.post('/:id/view', asyncHandler(async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  return ok(res, null, 'View recorded');
}));

router.post('/', protect, adminOnly, ctrl.createOne);
router.patch('/:id', protect, adminOnly, ctrl.updateOne);
router.delete('/:id', protect, adminOnly, ctrl.deleteOne);

router.post(
  '/:id/gallery',
  protect,
  adminOnly,
  uploadImage.array('images', 8),
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return ok(res, null, 'Project not found');
    const images = (req.files || []).map((f) => ({
      url: f.path,
      publicId: f.filename,
      alt: project.title,
    }));
    project.gallery.push(...images);
    await project.save();
    return ok(res, project, 'Gallery updated');
  })
);

export default router;
