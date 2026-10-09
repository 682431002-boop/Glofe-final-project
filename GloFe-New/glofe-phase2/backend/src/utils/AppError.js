'use strict';
/** Operational error that is safe to show to API clients. Anything else becomes a generic 500. */
class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
  static badRequest(message, details) { return new AppError(400, 'BAD_REQUEST', message, details); }
  static validation(details, message = 'Please correct the highlighted fields.') {
    return new AppError(422, 'VALIDATION_ERROR', message, details);
  }
  static unauthorized(message = 'Please log in to continue.') { return new AppError(401, 'UNAUTHENTICATED', message); }
  static forbidden(message = 'You do not have permission to do that.') { return new AppError(403, 'FORBIDDEN', message); }
  static notFound(message = 'Resource not found.') { return new AppError(404, 'NOT_FOUND', message); }
  static conflict(message, code = 'CONFLICT') { return new AppError(409, code, message); }
}
module.exports = AppError;
