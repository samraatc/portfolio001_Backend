import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { Profile } from '../models/Profile.js';
import { cloudinary } from '../config/cloudinary.js';

// Public — fetch primary profile
export const getProfile = asyncHandler(async (_req, res) => {
  let profile = await Profile.findOne({ isPrimary: true });
  if (!profile) profile = await Profile.findOne();
  return ok(res, profile);
});

// Admin — upsert primary profile
export const updateProfile = asyncHandler(async (req, res) => {
  const payload = req.body;
  let profile = await Profile.findOne({ isPrimary: true });
  if (!profile) {
    profile = await Profile.create({ ...payload, isPrimary: true });
  } else {
    Object.assign(profile, payload);
    await profile.save();
  }
  return ok(res, profile, 'Profile updated');
});

// Admin — upload avatar
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return ok(res, null, 'No file uploaded');

  let profile = await Profile.findOne({ isPrimary: true });
  if (!profile) profile = await Profile.create({ fullName: 'New Profile', title: 'Developer', isPrimary: true });

  // Cleanup previous
  if (profile.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(profile.avatarPublicId);
    } catch (_) { /* ignore */ }
  }

  profile.avatar = req.file.path;
  profile.avatarPublicId = req.file.filename;
  await profile.save();
  return ok(res, profile, 'Avatar uploaded');
});

// Admin — upload resume
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) return ok(res, null, 'No file uploaded');

  let profile = await Profile.findOne({ isPrimary: true });
  if (!profile) profile = await Profile.create({ fullName: 'New Profile', title: 'Developer', isPrimary: true });

  if (profile.resumePublicId) {
    try {
      await cloudinary.uploader.destroy(profile.resumePublicId, { resource_type: 'raw' });
    } catch (_) { /* ignore */ }
  }

  profile.resumeUrl = req.file.path;
  profile.resumePublicId = req.file.filename;
  await profile.save();
  return ok(res, profile, 'Resume uploaded');
});
