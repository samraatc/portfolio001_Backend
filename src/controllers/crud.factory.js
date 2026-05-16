import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, created, noContent } from '../utils/ApiResponse.js';
import { parseQuery, buildMeta } from '../utils/pagination.js';

/**
 * Generic CRUD controller factory.
 * Keeps all resource handlers consistent: pagination, search, filter, sort.
 *
 * options:
 *   searchFields: fields to fuzzy-search by ?search
 *   filterFields: query param keys mapped 1:1 to filter
 *   booleanFields: among filterFields, coerce "true"/"false" strings to booleans
 *   defaultSort: default sort string
 *   populate: array of mongoose populate definitions
 *   beforeCreate / beforeUpdate / afterDelete: optional async hooks
 */
export const crudController = (Model, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    booleanFields = [],
    defaultSort = '-createdAt',
    populate = [],
    beforeCreate,
    beforeUpdate,
    afterDelete,
  } = options;

  const list = asyncHandler(async (req, res) => {
    const { page, limit, skip, sort, filter } = parseQuery(req.query, {
      searchFields,
      defaultLimit: 12,
    });

    // Apply per-resource filter fields
    for (const f of filterFields) {
      if (req.query[f] !== undefined && req.query[f] !== '') {
        let v = req.query[f];
        if (booleanFields.includes(f)) v = v === 'true' || v === true;
        filter[f] = v;
      }
    }

    const sortStr = req.query.sort || defaultSort;

    const [items, total] = await Promise.all([
      Model.find(filter).sort(sortStr).skip(skip).limit(limit).populate(populate),
      Model.countDocuments(filter),
    ]);

    return ok(res, items, 'Fetched', buildMeta(page, limit, total));
  });

  const getOne = asyncHandler(async (req, res) => {
    const { idOrSlug } = req.params;
    const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const item = await Model.findOne(query).populate(populate);
    if (!item) throw ApiError.notFound(`${Model.modelName} not found`);
    return ok(res, item);
  });

  const createOne = asyncHandler(async (req, res) => {
    let payload = req.body;
    if (beforeCreate) payload = (await beforeCreate(payload, req)) || payload;
    const item = await Model.create(payload);
    return created(res, item, `${Model.modelName} created`);
  });

  const updateOne = asyncHandler(async (req, res) => {
    let payload = req.body;
    if (beforeUpdate) payload = (await beforeUpdate(payload, req)) || payload;

    const item = await Model.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate(populate);

    if (!item) throw ApiError.notFound(`${Model.modelName} not found`);
    return ok(res, item, `${Model.modelName} updated`);
  });

  const deleteOne = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw ApiError.notFound(`${Model.modelName} not found`);
    if (afterDelete) await afterDelete(item, req);
    return noContent(res);
  });

  return { list, getOne, createOne, updateOne, deleteOne };
};
