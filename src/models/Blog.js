import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 320 },
    content: { type: String, required: true }, // rich text / HTML or markdown
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    category: { type: String, required: true, trim: true, index: true, default: 'General' },
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    author: {
      name: { type: String, trim: true, default: '' },
      avatar: { type: String, default: '' },
    },
    readTime: { type: Number, min: 1, default: 5 }, // minutes
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

blogSchema.pre('validate', function generateSlug(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Blog = mongoose.model('Blog', blogSchema);
