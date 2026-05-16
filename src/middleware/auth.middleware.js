import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const protect = asyncHandler(async (req, _res, next) => {
  let token;
  const auth = req.headers.authorization;

  if (auth && auth.startsWith('Bearer ')) {
    token = auth.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) throw ApiError.unauthorized('Authentication required');

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw ApiError.unauthorized('User no longer exists');
  if (!user.isActive) throw ApiError.forbidden('Account is disabled');

  req.user = user;
  next();
});

/** Role-based access control. Usage: authorize('admin', 'editor') */
export const authorize = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user) throw ApiError.unauthorized('Authentication required');
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(`Requires role: ${roles.join(' or ')}`);
    }
    next();
  });

/** Admin-only shorthand */
export const adminOnly = authorize('admin');
