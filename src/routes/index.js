import { Router } from 'express';

import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import skillRoutes from './skill.routes.js';
import projectRoutes from './project.routes.js';
import experienceRoutes from './experience.routes.js';
import serviceRoutes from './service.routes.js';
import blogRoutes from './blog.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import contactRoutes from './contact.routes.js';
import settingsRoutes from './settings.routes.js';
import uploadRoutes from './upload.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'Portfolio API',
    version: '1.0.0',
    docs: '/api/v1',
    routes: [
      'auth', 'profile', 'skills', 'projects', 'experience',
      'services', 'blogs', 'testimonials', 'contact',
      'settings', 'uploads', 'dashboard',
    ],
  });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/experience', experienceRoutes);
router.use('/services', serviceRoutes);
router.use('/blogs', blogRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
