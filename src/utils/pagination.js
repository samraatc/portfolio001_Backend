/**
 * Parse pagination query params: ?page=1&limit=10&sort=-createdAt&search=foo
 */
export const parseQuery = (query, { defaultLimit = 10, maxLimit = 100, searchFields = [] } = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;
  const sort = query.sort || '-createdAt';

  const filter = {};
  if (query.search && searchFields.length > 0) {
    const regex = new RegExp(query.search.trim(), 'i');
    filter.$or = searchFields.map((f) => ({ [f]: regex }));
  }
  return { page, limit, skip, sort, filter };
};

export const buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
  hasNext: page * limit < total,
  hasPrev: page > 1,
});
