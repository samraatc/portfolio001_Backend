import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, created } from '../utils/ApiResponse.js';
import { signToken, cookieOptions } from '../utils/jwt.js';
import { sendMail, buildResetEmail } from '../utils/mailer.js';
import { User } from '../models/User.js';
import { isProd } from '../config/env.js';

const sanitizeUser = (user) => {
  const u = user.toObject ? user.toObject() : user;
  delete u.password;
  return u;
};

// Login admin user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid credentials');
  if (!user.isActive) throw ApiError.forbidden('Account is disabled');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized('Invalid credentials');

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken({ id: user._id, role: user.role });
  res.cookie('token', token, cookieOptions());

  return ok(res, { token, user: sanitizeUser(user) }, 'Logged in');
});

// Register (admin-protected in routes — used by an existing admin to create editors)
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw ApiError.conflict('Email already in use');

  const user = await User.create({ name, email, password, role });
  return created(res, sanitizeUser(user), 'User created');
});

export const getMe = asyncHandler(async (req, res) => {
  return ok(res, req.user);
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', cookieOptions());
  return ok(res, null, 'Logged out');
});

export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });
  return ok(res, user, 'Profile updated');
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!user) throw ApiError.notFound('User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  return ok(res, null, 'Password changed');
});

/**
 * Request a password reset.
 * Always returns 200 — we never reveal whether an email is registered (anti-enumeration).
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, resetUrlBase } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  // Generic response either way
  const generic = { message: 'If an account exists for that email, a reset link has been sent.' };

  if (!user || !user.isActive) {
    return ok(res, generic, generic.message);
  }

  const plainToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const base = resetUrlBase || `${req.protocol}://${req.get('host')}`;
  const resetUrl = `${base.replace(/\/$/, '')}/reset-password/${plainToken}`;

  const { subject, html, text } = buildResetEmail(user.name, resetUrl);
  const delivered = await sendMail({ to: user.email, subject, html, text });

  // In dev, also surface the resetUrl in the API response so you can copy/paste it
  // when SMTP isn't configured. Never do this in production.
  const debug = !isProd && !delivered ? { resetUrl } : undefined;

  return ok(res, { ...generic, ...(debug && { debug }) }, generic.message);
});

/**
 * Complete a password reset using the token from the email.
 * The token in the URL is the plain version; we hash it and compare to passwordResetToken.
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires +password');

  if (!user) throw ApiError.badRequest('Reset link is invalid or has expired');

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  // Auto-login after successful reset
  const authToken = signToken({ id: user._id, role: user.role });
  res.cookie('token', authToken, cookieOptions());

  return ok(res, { token: authToken, user: sanitizeUser(user) }, 'Password reset — you are now signed in.');
});

/**
 * Verify a reset token (used by the reset page to fail fast on bad/expired links).
 */
export const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select('email');

  if (!user) throw ApiError.badRequest('Reset link is invalid or has expired');
  return ok(res, { email: user.email.replace(/(.{2}).+(@.+)/, '$1***$2') }, 'Token is valid');
});
