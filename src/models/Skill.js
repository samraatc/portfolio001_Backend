import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Tools', 'Other'],
      default: 'Other',
      index: true,
    },
    proficiency: { type: Number, required: true, min: 0, max: 100, default: 70 },
    icon: { type: String, default: '' }, // lucide name or image URL
    // Cloudinary publicId for the uploaded icon (empty when icon is a
    // lucide name or an external URL). Stored so we can delete the asset
    // when the skill is removed or its icon is replaced.
    iconPublicId: { type: String, default: '' },
    iconColor: { type: String, default: '#6366f1' },
    description: { type: String, trim: true, maxlength: 500 },
    yearsOfExperience: { type: Number, min: 0, default: 0 },
    order: { type: Number, default: 0, index: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

skillSchema.index({ name: 'text', description: 'text' });

export const Skill = mongoose.model('Skill', skillSchema);
