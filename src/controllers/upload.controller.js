import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, noContent } from '../utils/ApiResponse.js';
import { cloudinary } from '../config/cloudinary.js';

export const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  return ok(res, {
    url: req.file.path,
    publicId: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  }, 'Uploaded');
});

export const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) throw ApiError.badRequest('No files uploaded');
  const files = req.files.map((f) => ({
    url: f.path,
    publicId: f.filename,
    size: f.size,
    mimetype: f.mimetype,
  }));
  return ok(res, files, 'Uploaded');
});

export const deleteUpload = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw ApiError.badRequest('publicId is required');
  await cloudinary.uploader.destroy(publicId);
  return noContent(res);
});
