import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true, maxlength: 200 },
    institutionLogo: { type: String, default: '' },
    degree: { type: String, required: true, trim: true, maxlength: 200 },
    fieldOfStudy: { type: String, trim: true, maxlength: 200 },
    location: { type: String, trim: true },
    grade: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const Education = mongoose.model('Education', educationSchema);
