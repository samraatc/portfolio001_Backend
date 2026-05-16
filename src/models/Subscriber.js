import mongoose from 'mongoose';
import validator from 'validator';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid email'],
    },
    isActive: { type: Boolean, default: true },
    source: { type: String, default: 'newsletter' },
  },
  { timestamps: true }
);

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
