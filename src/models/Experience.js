import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 120 },
    companyLogo: { type: String, default: '' },
    companyUrl: { type: String, default: '' },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      default: 'Full-time',
    },
    location: { type: String, trim: true },
    locationType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
    description: { type: String, trim: true, maxlength: 3000 },
    responsibilities: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

experienceSchema.virtual('duration').get(function () {
  const end = this.endDate ? new Date(this.endDate) : new Date();
  const months = Math.max(0, (end.getFullYear() - this.startDate.getFullYear()) * 12 + (end.getMonth() - this.startDate.getMonth()));
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return [years && `${years}y`, remMonths && `${remMonths}m`].filter(Boolean).join(' ') || '<1m';
});

experienceSchema.set('toJSON', { virtuals: true });

export const Experience = mongoose.model('Experience', experienceSchema);
