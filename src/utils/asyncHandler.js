/**
 * Wraps async route handlers and forwards errors to express error middleware.
 * Usage: router.get('/x', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
