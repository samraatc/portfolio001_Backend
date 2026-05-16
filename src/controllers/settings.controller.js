import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { Settings } from '../models/Settings.js';

export const getSettings = asyncHandler(async (_req, res) => {
  const doc = await Settings.getSingleton();
  return ok(res, doc);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const doc = await Settings.getSingleton();
  Object.assign(doc, req.body);
  await doc.save();
  return ok(res, doc, 'Settings updated');
});
