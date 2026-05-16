export class ApiResponse {
  constructor(statusCode, data = null, message = 'Success', meta = undefined) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }
}

export const ok = (res, data, message = 'Success', meta) =>
  res.status(200).json(new ApiResponse(200, data, message, meta));

export const created = (res, data, message = 'Created') =>
  res.status(201).json(new ApiResponse(201, data, message));

export const noContent = (res) => res.status(204).send();
