import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { Project } from '../models/Project.js';
import { Blog } from '../models/Blog.js';
import { Skill } from '../models/Skill.js';
import { Service } from '../models/Service.js';
import { Experience } from '../models/Experience.js';
import { Testimonial } from '../models/Testimonial.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { Subscriber } from '../models/Subscriber.js';

export const getStats = asyncHandler(async (_req, res) => {
  const [
    projectCount,
    blogCount,
    skillCount,
    serviceCount,
    experienceCount,
    testimonialCount,
    messageCount,
    unreadMessages,
    subscriberCount,
    projectViews,
    blogViews,
  ] = await Promise.all([
    Project.countDocuments(),
    Blog.countDocuments(),
    Skill.countDocuments(),
    Service.countDocuments(),
    Experience.countDocuments(),
    Testimonial.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: 'unread' }),
    Subscriber.countDocuments({ isActive: true }),
    Project.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]).then(
      (r) => r[0]?.total || 0
    ),
    Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]).then(
      (r) => r[0]?.total || 0
    ),
  ]);

  // Last 7 days message activity for the chart
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const recentActivity = await ContactMessage.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill missing days with 0
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = recentActivity.find((r) => r._id === key);
    days.push({ date: key, count: found?.count || 0 });
  }

  const recentMessages = await ContactMessage.find()
    .sort('-createdAt')
    .limit(5)
    .select('name email subject status createdAt');

  const recentProjects = await Project.find()
    .sort('-createdAt')
    .limit(5)
    .select('title slug thumbnail category createdAt');

  return ok(res, {
    counts: {
      projects: projectCount,
      blogs: blogCount,
      skills: skillCount,
      services: serviceCount,
      experiences: experienceCount,
      testimonials: testimonialCount,
      messages: messageCount,
      unreadMessages,
      subscribers: subscriberCount,
      projectViews,
      blogViews,
    },
    activity: days,
    recentMessages,
    recentProjects,
  });
});
