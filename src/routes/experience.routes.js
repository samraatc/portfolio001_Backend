import { Router } from 'express';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Achievement } from '../models/Achievement.js';
import { crudController } from '../controllers/crud.factory.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

const make = (Model, opts) => {
  const ctrl = crudController(Model, opts);
  const r = Router();
  r.get('/', ctrl.list);
  r.get('/:idOrSlug', ctrl.getOne);
  r.post('/', protect, adminOnly, ctrl.createOne);
  r.patch('/:id', protect, adminOnly, ctrl.updateOne);
  r.delete('/:id', protect, adminOnly, ctrl.deleteOne);
  return r;
};

router.use('/work', make(Experience, {
  searchFields: ['company', 'role'],
  defaultSort: 'order -startDate',
}));

router.use('/education', make(Education, {
  searchFields: ['institution', 'degree', 'fieldOfStudy'],
  defaultSort: 'order -startDate',
}));

router.use('/achievements', make(Achievement, {
  searchFields: ['title', 'issuer'],
  defaultSort: 'order -date',
}));

export default router;
