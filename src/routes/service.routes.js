import { Router } from 'express';
import { Service } from '../models/Service.js';
import { crudController } from '../controllers/crud.factory.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const ctrl = crudController(Service, {
  searchFields: ['title', 'description'],
  filterFields: ['isPopular', 'isActive'],
  booleanFields: ['isPopular', 'isActive'],
  defaultSort: 'order -createdAt',
});

const router = Router();
router.get('/', ctrl.list);
router.get('/:idOrSlug', ctrl.getOne);
router.post('/', protect, adminOnly, ctrl.createOne);
router.patch('/:id', protect, adminOnly, ctrl.updateOne);
router.delete('/:id', protect, adminOnly, ctrl.deleteOne);

export default router;
