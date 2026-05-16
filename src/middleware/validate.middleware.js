import { ApiError } from '../utils/ApiError.js';

/**
 * Validate request body/query/params with a Zod schema.
 * Usage: router.post('/', validate(schema), handler)
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return next(ApiError.badRequest('Validation failed', errors));
  }
  req[source] = result.data;
  next();
};
