import nodemailer from 'nodemailer';
import { env, isProd } from '../config/env.js';

let cached = null;

const transporter = () => {
  if (cached) return cached;
  if (!env.mail.host || !env.mail.user) return null;
  cached = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.port === 465,
    auth: { user: env.mail.user, pass: env.mail.pass },
  });
  return cached;
};

/**
 * Send an email. If SMTP isn't configured, log the message to the console (dev).
 * In production we silently drop and return false so we never leak that mail failed.
 */
export const sendMail = async ({ to, subject, html, text }) => {
  const t = transporter();
  if (!t) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log('\n[mail:DEV] (SMTP not configured — printing instead)');
      // eslint-disable-next-line no-console
      console.log(`  to:      ${to}`);
      // eslint-disable-next-line no-console
      console.log(`  subject: ${subject}`);
      // eslint-disable-next-line no-console
      console.log(`  text:    ${text || html?.replace(/<[^>]*>/g, '')}\n`);
    }
    return false;
  }
  try {
    await t.sendMail({
      from: env.mail.from || env.mail.user,
      to, subject, html, text,
    });
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[mail] send failed:', e.message);
    return false;
  }
};

export const buildResetEmail = (name, resetUrl) => ({
  subject: 'Password reset request',
  text: `Hi ${name || 'there'},\n\nYou (or someone) requested a password reset. Click the link below within 30 minutes to set a new password:\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.\n`,
  html: `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b">
      <h2 style="margin:0 0 12px">Password reset</h2>
      <p>Hi ${name || 'there'},</p>
      <p>You (or someone) requested a password reset for your portfolio admin account.</p>
      <p style="margin:24px 0">
        <a href="${resetUrl}" style="background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">
          Reset your password
        </a>
      </p>
      <p style="color:#71717a;font-size:13px">This link is valid for 30 minutes. If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0" />
      <p style="color:#a1a1aa;font-size:12px">If the button doesn't work, paste this URL into your browser:<br/>${resetUrl}</p>
    </div>
  `,
});
