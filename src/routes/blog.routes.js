import { Router } from 'express';
import { Blog } from '../models/Blog.js';
import { crudController } from '../controllers/crud.factory.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { createBlogSchema, updateBlogSchema } from '../validators/blog.validator.js';

const ctrl = crudController(Blog, {
  searchFields: ['title', 'excerpt', 'content'],
  filterFields: ['category', 'isPublished', 'isFeatured'],
  booleanFields: ['isPublished', 'isFeatured'],
  defaultSort: '-publishedAt -createdAt',
});

const router = Router();

router.get('/', ctrl.list);
router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const cats = await Blog.distinct('category', { isPublished: true });
    return ok(res, cats);
  })
);
router.get('/:idOrSlug', ctrl.getOne);

router.post('/:id/view', asyncHandler(async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  return ok(res, null, 'View recorded');
}));

router.post('/', protect, adminOnly, validate(createBlogSchema), ctrl.createOne);
router.patch('/:id', protect, adminOnly, validate(updateBlogSchema), ctrl.updateOne);
router.delete('/:id', protect, adminOnly, ctrl.deleteOne);

export default router;
