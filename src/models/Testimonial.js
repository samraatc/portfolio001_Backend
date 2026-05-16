import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true, maxlength: 100 },
    clientRole: { type: String, trim: true, maxlength: 120 },
    clientCompany: { type: String, trim: true, maxlength: 120 },
    clientImage: { type: String, default: '' },
    clientImagePublicId: { type: String, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    projectRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    isFeatured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
