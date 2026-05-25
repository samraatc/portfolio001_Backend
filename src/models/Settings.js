import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'My Portfolio', trim: true },
    tagline: { type: String, default: 'Crafting digital experiences', trim: true },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    themeMode: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#a855f7' },

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },

    socials: [
      {
        platform: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        icon: { type: String, default: '' },
        _id: false,
      },
    ],

    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      mapEmbedUrl: { type: String, default: '' },
    },

    newsletter: {
      isEnabled: { type: Boolean, default: true },
      provider: { type: String, default: '' },
      apiKey: { type: String, default: '' },
    },

    analytics: {
      googleAnalyticsId: { type: String, default: '' },
    },

    footer: {
      copyrightText: { type: String, default: '' },
      description: { type: String, default: '' },
    },

    // Toggle which public sections/pages are visible
    visibility: {
      blog: { type: Boolean, default: true },
      services: { type: Boolean, default: true },
      testimonials: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
    },

    // Public site "first-load" loader (Virgin-Galactic style).
    // Rendered by the frontend Layout on initial mount. Admin-configurable.
    loader: {
      enabled: { type: Boolean, default: true },
      logoUrl: { type: String, default: '', trim: true },
      tagline: {
        type: String,
        default: 'Turning the impossible into the inevitable…',
        trim: true,
        maxlength: 120,
      },
      ringColor: { type: String, default: '#cc44ff', trim: true },
      duration: { type: Number, default: 2.5, min: 0.4, max: 20 },
      showOncePerSession: { type: Boolean, default: false },
    },

    isSingleton: { type: Boolean, default: true, unique: true, sparse: true },
  },
  { timestamps: true }
);

settingsSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

export const Settings = mongoose.model('Settings', settingsSchema);
