import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    issuer: { type: String, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000 },
    image: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    date: { type: Date, required: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
