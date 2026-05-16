import mongoose from 'mongoose';
import slugify from 'slugify';

const projectImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, index: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 280 },
    description: { type: String, required: true }, // markdown / rich text
    category: {
      type: String,
      enum: ['Web App', 'Mobile App', 'UI/UX', 'API', 'Open Source', 'Other'],
      default: 'Web App',
      index: true,
    },
    technologies: [{ type: String, trim: true }],
    thumbnail: { type: String, required: true },
    thumbnailPublicId: { type: String, default: '' },
    gallery: [projectImageSchema],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    role: { type: String, trim: true },
    client: { type: String, trim: true },
    startedAt: { type: Date },
    completedAt: { type: Date },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', shortDescription: 'text', technologies: 'text' });

projectSchema.pre('validate', function generateSlug(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Project = mongoose.model('Project', projectSchema);
