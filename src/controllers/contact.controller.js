import nodemailer from 'nodemailer';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, created, noContent } from '../utils/ApiResponse.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { Subscriber } from '../models/Subscriber.js';
import { parseQuery, buildMeta } from '../utils/pagination.js';
import { env } from '../config/env.js';

// Public — submit contact form
export const submitMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const doc = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
    ip: req.ip,
    userAgent: req.get('user-agent') || '',
  });

  // Fire-and-forget email notification
  if (env.mail.host && env.mail.user && env.mail.to) {
    try {
      const transporter = nodemailer.createTransport({
        host: env.mail.host,
        port: env.mail.port,
        secure: env.mail.port === 465,
        auth: { user: env.mail.user, pass: env.mail.pass },
      });
      await transporter.sendMail({
        from: env.mail.from || env.mail.user,
        to: env.mail.to,
        subject: `[Portfolio] ${subject || 'New message'} — from ${name}`,
        text: `From: ${name} <${email}>\nPhone: ${phone || '-'}\n\n${message}`,
        replyTo: email,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[contact] email notify failed:', e.message);
    }
  }

  return created(res, { id: doc._id }, 'Message sent — I will get back to you soon.');
});

// Admin — list messages
export const listMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, filter } = parseQuery(req.query, {
    searchFields: ['name', 'email', 'subject', 'message'],
    defaultLimit: 20,
  });
  if (req.query.status) filter.status = req.query.status;
  if (req.query.starred === 'true') filter.isStarred = true;

  const [items, total, unreadCount] = await Promise.all([
    ContactMessage.find(filter).sort(sort).skip(skip).limit(limit),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ status: 'unread' }),
  ]);

  return ok(res, items, 'Fetched', { ...buildMeta(page, limit, total), unreadCount });
});

export const getMessage = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findById(req.params.id);
  if (!item) throw ApiError.notFound('Message not found');
  return ok(res, item);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: 'read' },
    { new: true }
  );
  if (!item) throw ApiError.notFound('Message not found');
  return ok(res, item, 'Marked as read');
});

export const updateMessage = asyncHandler(async (req, res) => {
  const allowed = ['status', 'isStarred', 'repliedAt'];
  const updates = {};
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
  const item = await ContactMessage.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!item) throw ApiError.notFound('Message not found');
  return ok(res, item, 'Message updated');
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('Message not found');
  return noContent(res);
});

// Newsletter
export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const sub = await Subscriber.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $setOnInsert: { email: email.toLowerCase(), isActive: true } },
    { upsert: true, new: true }
  );
  return ok(res, sub, 'Subscribed to newsletter');
});

export const listSubscribers = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, filter } = parseQuery(req.query, {
    searchFields: ['email'],
    defaultLimit: 25,
  });
  const [items, total] = await Promise.all([
    Subscriber.find(filter).sort(sort).skip(skip).limit(limit),
    Subscriber.countDocuments(filter),
  ]);
  return ok(res, items, 'Fetched', buildMeta(page, limit, total));
});
