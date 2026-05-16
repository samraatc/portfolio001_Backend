/* eslint-disable no-console */
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { Skill } from '../models/Skill.js';
import { Project } from '../models/Project.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { Achievement } from '../models/Achievement.js';
import { Service } from '../models/Service.js';
import { Blog } from '../models/Blog.js';
import { Testimonial } from '../models/Testimonial.js';
import { Settings } from '../models/Settings.js';

const placeholder = (w, h, label = 'image') =>
  `https://placehold.co/${w}x${h}/6366f1/ffffff?text=${encodeURIComponent(label)}`;

const seed = async () => {
  await connectDB();
  console.log('[seed] Wiping collections...');
  await Promise.all([
    User.deleteMany(),
    Profile.deleteMany(),
    Skill.deleteMany(),
    Project.deleteMany(),
    Experience.deleteMany(),
    Education.deleteMany(),
    Achievement.deleteMany(),
    Service.deleteMany(),
    Blog.deleteMany(),
    Testimonial.deleteMany(),
    Settings.deleteMany(),
  ]);

  console.log('[seed] Creating admin user...');
  await User.create({
    name: env.seed.name,
    email: env.seed.email,
    password: env.seed.password,
    role: 'admin',
  });
  console.log(`[seed] Admin: ${env.seed.email} / ${env.seed.password}`);

  console.log('[seed] Profile...');
  await Profile.create({
    fullName: 'Bishnu Chaudhary',
    title: 'Full-Stack Developer & DevOps Engineer',
    tagline: 'I build beautiful, scalable web experiences.',
    typingRoles: ['Full-Stack Developer', 'DevOps Engineer', 'Node.js Specialist', 'MERN Stack Expert'],
    bio: 'I am a passionate full-stack engineer with 1.5+ years of experience building modern web applications using the MERN stack Vibe coding. I love crafting interfaces that delight users and architecting systems that scale.',
    shortBio: 'Full-stack developer focused on the MERN stack, scalable architectures, and DevOps practices.',
    email: 'bishnu@example.com',
    phone: '9863471657',
    location: 'Kathmandu, Nepal',
    avatar: placeholder(400, 400, 'AM'),
    yearsOfExperience: 6,
    projectsCompleted: 48,
    happyClients: 32,
    awards: 7,
    socials: [
      { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
      { platform: 'Dribbble', url: 'https://dribbble.com', icon: 'dribbble' },
    ],
    isPrimary: true,
  });

  console.log('[seed] Skills...');
  await Skill.insertMany([
    { name: 'React', category: 'Frontend', proficiency: 95, icon: 'react', iconColor: '#61dafb', order: 1, isFeatured: true },
    { name: 'Next.js', category: 'Frontend', proficiency: 90, icon: 'nextjs', iconColor: '#000000', order: 2, isFeatured: true },
    { name: 'TypeScript', category: 'Frontend', proficiency: 88, icon: 'typescript', iconColor: '#3178c6', order: 3, isFeatured: true },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, icon: 'tailwind', iconColor: '#06b6d4', order: 4 },
    { name: 'Framer Motion', category: 'Frontend', proficiency: 85, icon: 'framer', iconColor: '#0055ff', order: 5 },
    { name: 'Node.js', category: 'Backend', proficiency: 92, icon: 'node', iconColor: '#339933', order: 6, isFeatured: true },
    { name: 'Express.js', category: 'Backend', proficiency: 90, icon: 'express', iconColor: '#000000', order: 7 },
    { name: 'GraphQL', category: 'Backend', proficiency: 78, icon: 'graphql', iconColor: '#e10098', order: 8 },
    { name: 'MongoDB', category: 'Database', proficiency: 88, icon: 'mongodb', iconColor: '#47A248', order: 9, isFeatured: true },
    { name: 'PostgreSQL', category: 'Database', proficiency: 82, icon: 'postgres', iconColor: '#336791', order: 10 },
    // { name: 'Redis', category: 'Database', proficiency: 75, icon: 'redis', iconColor: '#dc382d', order: 11 },
    { name: 'Docker', category: 'DevOps', proficiency: 80, icon: 'docker', iconColor: '#2496ed', order: 12 },
    { name: 'AWS', category: 'DevOps', proficiency: 75, icon: 'aws', iconColor: '#ff9900', order: 13 },
    { name: 'Figma', category: 'Design', proficiency: 85, icon: 'figma', iconColor: '#f24e1e', order: 14 },
  ]);

  console.log('[seed] Projects...');
  await Project.insertMany([
    {
      title: 'Nova SaaS Dashboard',
      shortDescription: 'A premium analytics dashboard for SaaS teams with real-time charts and white-labelling.',
      description: 'Nova is a fully-featured SaaS analytics platform I built end-to-end. It includes a real-time event ingestion pipeline, fine-grained role-based access control, customisable dashboards, and a white-label theming system. The frontend is built on React 18 with a Vite + TanStack Query setup and Tailwind for styling. The backend runs on Node.js with a Postgres warehouse for events and Mongo for application data.',
      category: 'Web App',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      thumbnail: placeholder(1200, 720, 'Nova+Dashboard'),
      githubUrl: 'https://github.com/example/nova',
      liveUrl: 'https://example.com/nova',
      isFeatured: true,
      isPublished: true,
      order: 1,
    },
    {
      title: 'Pulse Booking Platform',
      shortDescription: 'Multi-tenant booking platform for service businesses, with Stripe payments and SMS reminders.',
      description: 'Pulse is a B2B SaaS booking platform supporting recurring appointments, calendar sync, Stripe Connect payouts, and SMS reminders via Twilio. I led the architecture and built the entire MERN stack myself, including a Next.js storefront, an Express API, and an admin dashboard.',
      category: 'Web App',
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Twilio'],
      thumbnail: placeholder(1200, 720, 'Pulse'),
      githubUrl: 'https://github.com/example/pulse',
      liveUrl: 'https://example.com/pulse',
      isFeatured: true,
      isPublished: true,
      order: 2,
    },
    {
      title: 'Lumen Design System',
      shortDescription: 'Open-source React component library with 60+ themable components and accessibility built in.',
      description: 'Lumen is an open-source React component library I built and maintain. It ships 60+ accessible components with a token-driven theming system, Storybook docs, and full TypeScript support. Used by 12k+ developers monthly.',
      category: 'Open Source',
      technologies: ['React', 'TypeScript', 'Storybook', 'Vite'],
      thumbnail: placeholder(1200, 720, 'Lumen+UI'),
      githubUrl: 'https://github.com/example/lumen',
      isPublished: true,
      order: 3,
    },
    {
      title: 'Echo Mobile App',
      shortDescription: 'Cross-platform podcast app with offline downloads and AI-generated chapter summaries.',
      description: 'Echo is a cross-platform podcast app built in React Native. Highlights include offline downloads with background sync, AI-generated chapter summaries, and adaptive playback speed.',
      category: 'Mobile App',
      technologies: ['React Native', 'Expo', 'Node.js', 'OpenAI'],
      thumbnail: placeholder(1200, 720, 'Echo+App'),
      isPublished: true,
      order: 4,
    },
    {
      title: 'Mosaic Portfolio API',
      shortDescription: 'A headless CMS-style API for developer portfolios, built on Express + Mongo.',
      description: 'Mosaic is the API powering this very portfolio template. It exposes REST endpoints for every section of the site and supports media uploads, role-based auth, and full-text search.',
      category: 'API',
      technologies: ['Node.js', 'Express', 'MongoDB', 'Cloudinary'],
      thumbnail: placeholder(1200, 720, 'Mosaic+API'),
      githubUrl: 'https://github.com/example/mosaic',
      isPublished: true,
      order: 5,
    },
    {
      title: 'Drift Marketing Site',
      shortDescription: 'High-converting marketing site for a YC-backed startup, scored 100/100 on Lighthouse.',
      description: 'A high-conversion marketing website I designed and built for a YC-backed startup. Hit perfect Lighthouse scores across all four categories.',
      category: 'UI/UX',
      technologies: ['Next.js', 'Tailwind', 'Framer Motion'],
      thumbnail: placeholder(1200, 720, 'Drift'),
      liveUrl: 'https://example.com/drift',
      isPublished: true,
      order: 6,
    },
  ]);

  console.log('[seed] Experience...');
  await Experience.insertMany([
    {
      company: 'Stripe',
      role: 'Senior Software Engineer',
      employmentType: 'Full-time',
      location: 'San Francisco, CA',
      locationType: 'Hybrid',
      description: 'Working on the merchant-facing dashboard used by 4M+ businesses worldwide. Leading the design system migration and building accessibility tooling.',
      responsibilities: [
        'Led migration of the legacy dashboard to a token-driven design system, cutting CSS bundle size by 38%.',
        'Built a real-time collaboration layer for the invoicing UI using WebSockets and CRDTs.',
        'Mentored 4 junior engineers and ran the team\'s frontend hiring loop.',
      ],
      technologies: ['React', 'TypeScript', 'GraphQL', 'Ruby on Rails'],
      startDate: new Date('2023-03-01'),
      isCurrent: true,
      order: 1,
    },
    {
      company: 'Vercel',
      role: 'Software Engineer',
      employmentType: 'Full-time',
      locationType: 'Remote',
      description: 'Shipped features for Next.js Conf 2022 and built tooling for the Vercel deployment dashboard.',
      responsibilities: [
        'Designed and shipped the new project analytics page from scratch.',
        'Optimised cold-start times on the API gateway by 22%.',
      ],
      technologies: ['Next.js', 'Node.js', 'Edge Runtime'],
      startDate: new Date('2021-06-01'),
      endDate: new Date('2023-02-28'),
      order: 2,
    },
    {
      company: 'Freelance',
      role: 'Full-Stack Developer',
      employmentType: 'Freelance',
      locationType: 'Remote',
      description: 'Worked with 20+ early-stage startups on MVPs, marketing sites, and internal tools.',
      responsibilities: [
        'Delivered 30+ end-to-end projects across SaaS, e-commerce, and edtech.',
        'Built a reusable starter that reduced delivery time on new projects by 40%.',
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL'],
      startDate: new Date('2019-01-01'),
      endDate: new Date('2021-05-31'),
      order: 3,
    },
  ]);

  console.log('[seed] Education...');
  await Education.insertMany([
    {
      institution: 'Stanford University',
      degree: 'B.S. Computer Science',
      fieldOfStudy: 'Human-Computer Interaction',
      location: 'Stanford, CA',
      grade: 'GPA 3.8 / 4.0',
      description: 'Focused on systems, human-computer interaction, and distributed computing.',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-06-15'),
      order: 1,
    },
  ]);

  console.log('[seed] Achievements...');
  await Achievement.insertMany([
    {
      title: 'AWS Solutions Architect — Associate',
      issuer: 'Amazon Web Services',
      date: new Date('2023-08-12'),
      description: 'Certified cloud architecture and best-practices for AWS.',
      order: 1,
    },
    {
      title: 'Speaker — React Summit 2024',
      issuer: 'React Summit',
      date: new Date('2024-06-04'),
      description: 'Spoke about scaling design systems at 4M+ businesses.',
      order: 2,
    },
  ]);

  console.log('[seed] Services...');
  await Service.insertMany([
    {
      title: 'Web Application Development',
      shortDescription: 'End-to-end MERN applications, from architecture to deployment.',
      description: 'Production-grade web applications built on React, Node.js, and MongoDB, designed for scale and maintainability.',
      icon: 'code',
      features: ['MERN stack', 'TypeScript', 'CI/CD setup', 'Production-ready architecture', 'Security best practices'],
      priceLabel: 'From $5,000',
      price: 5000,
      pricingModel: 'fixed',
      isPopular: true,
      order: 1,
    },
    {
      title: 'UI / UX Design',
      shortDescription: 'Beautiful, accessible interfaces with a design-system mindset.',
      description: 'Modern, accessible UI design with Figma prototypes and a token-driven design system you can hand to engineering.',
      icon: 'palette',
      features: ['Figma designs', 'Design tokens', 'Component library', 'Accessibility audit'],
      priceLabel: 'From $2,500',
      price: 2500,
      pricingModel: 'fixed',
      order: 2,
    },
    {
      title: 'API Development',
      shortDescription: 'Robust, well-documented REST and GraphQL APIs.',
      description: 'Clean, RESTful APIs with OpenAPI documentation, role-based access, and rate limiting baked in.',
      icon: 'server',
      features: ['REST or GraphQL', 'OpenAPI docs', 'JWT auth', 'Rate limiting', 'Tests included'],
      priceLabel: 'From $3,000',
      price: 3000,
      pricingModel: 'fixed',
      order: 3,
    },
    {
      title: 'Performance Audit',
      shortDescription: 'Get to 100/100 on Lighthouse — fast.',
      description: 'I will audit your existing site or app and deliver a prioritised list of performance, accessibility, and SEO improvements.',
      icon: 'gauge',
      features: ['Lighthouse audit', 'Core Web Vitals report', 'Prioritised fixes', 'Implementation help'],
      priceLabel: '$1,200',
      price: 1200,
      pricingModel: 'fixed',
      order: 4,
    },
  ]);

  console.log('[seed] Blogs...');
  await Blog.insertMany([
    {
      title: 'Designing Scalable React Architecture in 2026',
      excerpt: 'How I structure large React codebases for long-term maintainability — folder layout, state, and data fetching patterns.',
      content: '<p>React has matured enormously. Here is the architecture I reach for when starting a serious project in 2026.</p><h2>Folder structure</h2><p>Group by feature, not by file type. Each feature owns its components, hooks, and tests.</p><h2>State</h2><p>Server state belongs in TanStack Query, UI state in <code>useState</code>, and global UI state in Zustand.</p>',
      category: 'Engineering',
      tags: ['react', 'architecture'],
      thumbnail: placeholder(1200, 630, 'React+Architecture'),
      isPublished: true,
      isFeatured: true,
      readTime: 8,
      author: { name: 'Alex Morgan' },
    },
    {
      title: 'A Pragmatic Guide to MongoDB Schema Design',
      excerpt: 'Embedding vs. referencing, indexing, and the patterns that hold up at scale.',
      content: '<p>MongoDB lets you model your data in ways relational databases do not. Here is how to think about it.</p>',
      category: 'Engineering',
      tags: ['mongodb', 'databases'],
      thumbnail: placeholder(1200, 630, 'MongoDB+Schema'),
      isPublished: true,
      readTime: 12,
      author: { name: 'Alex Morgan' },
    },
    {
      title: 'Building Animations That Feel Right',
      excerpt: 'Easing curves, durations, and the small details that separate decent animation from great.',
      content: '<p>Animation is a craft. These are the rules I keep coming back to.</p>',
      category: 'Design',
      tags: ['animation', 'ux'],
      thumbnail: placeholder(1200, 630, 'Animations'),
      isPublished: true,
      readTime: 5,
      author: { name: 'Alex Morgan' },
    },
  ]);

  console.log('[seed] Testimonials...');
  await Testimonial.insertMany([
    {
      clientName: 'Sara Chen',
      clientRole: 'CTO',
      clientCompany: 'Drift',
      clientImage: placeholder(200, 200, 'SC'),
      message: 'Alex shipped our entire marketing site in two weeks and it converts better than anything we had before. Easy 10/10.',
      rating: 5,
      isFeatured: true,
      order: 1,
    },
    {
      clientName: 'Marcus Olsen',
      clientRole: 'Founder',
      clientCompany: 'Pulse',
      clientImage: placeholder(200, 200, 'MO'),
      message: 'Phenomenal engineer. The architecture has held up perfectly as we have scaled from 0 to 50k MAU.',
      rating: 5,
      isFeatured: true,
      order: 2,
    },
    {
      clientName: 'Priya Singh',
      clientRole: 'Head of Product',
      clientCompany: 'Lumen',
      clientImage: placeholder(200, 200, 'PS'),
      message: 'A rare combo: a developer who writes great code AND has real design taste.',
      rating: 5,
      isFeatured: true,
      order: 3,
    },
  ]);

  console.log('[seed] Settings...');
  await Settings.create({
    siteName: 'Alex Morgan',
    tagline: 'Full-Stack Developer & UI Engineer',
    themeMode: 'dark',
    primaryColor: '#6366f1',
    accentColor: '#a855f7',
    seo: {
      metaTitle: 'Alex Morgan — Full-Stack Developer',
      metaDescription: 'Portfolio of Alex Morgan, full-stack developer specialising in the MERN stack.',
      keywords: ['portfolio', 'developer', 'react', 'node.js'],
    },
    socials: [
      { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
    ],
    contact: {
      email: 'hello@example.com',
      phone: '+1 (555) 010-1234',
      address: 'San Francisco, CA',
    },
    footer: {
      copyrightText: '© 2026 Alex Morgan. All rights reserved.',
      description: 'Building beautiful, scalable web experiences.',
    },
  });

  console.log('[seed] Done.');
  await disconnectDB();
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
