import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    shortDescription: { type: String, trim: true, maxlength: 240 },
    icon: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    features: [{ type: String, trim: true }],
    priceLabel: { type: String, default: 'Contact for pricing' },
    price: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    pricingModel: {
      type: String,
      enum: ['hourly', 'fixed', 'monthly', 'custom'],
      default: 'custom',
    },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0, index: true },
    ctaLabel: { type: String, default: 'Get Started' },
    ctaUrl: { type: String, default: '/contact' },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);
