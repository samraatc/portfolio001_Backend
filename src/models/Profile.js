import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    title: { type: String, required: true, trim: true, maxlength: 120 }, // e.g. "Full-Stack Developer"
    tagline: { type: String, trim: true, maxlength: 200 },
    typingRoles: [{ type: String, trim: true }], // strings for typing-effect
    bio: { type: String, trim: true, maxlength: 5000 },
    shortBio: { type: String, trim: true, maxlength: 500 },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    avatar: { type: String, default: '' }, // Cloudinary url
    avatarPublicId: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    projectsCompleted: { type: Number, default: 0, min: 0 },
    happyClients: { type: Number, default: 0, min: 0 },
    awards: { type: Number, default: 0, min: 0 },
    socials: [socialLinkSchema],
    isPrimary: { type: Boolean, default: true, index: true }, // we keep one primary profile
  },
  { timestamps: true }
);

// Only one primary profile
profileSchema.pre('save', async function ensurePrimary(next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await this.constructor.updateMany({ _id: { $ne: this._id } }, { isPrimary: false });
  }
  next();
});

export const Profile = mongoose.model('Profile', profileSchema);
