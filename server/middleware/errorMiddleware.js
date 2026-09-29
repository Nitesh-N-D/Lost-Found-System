const sendResponse = require("../utils/apiResponse");

const notFound = (_req, _res, next) => {
  const error = new Error("API route not found.");
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "MulterError") {
    error.statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    error.message = error.code === "LIMIT_FILE_SIZE"
      ? "Image must be 5 MB or smaller."
      : "The image upload could not be processed.";
  }

  if (error.type === "entity.too.large") {
    error.statusCode = 413;
    error.message = "Request body is too large.";
  }

  if (error.type === "entity.parse.failed") {
    error.statusCode = 400;
    error.message = "Request body contains invalid JSON.";
  }

  if (error.code === 11000) {
    error.statusCode = 409;
    error.message = "A record with those details already exists.";
  }

  if (error.message === "Only image uploads are allowed") {
    error.statusCode = 415;
    error.message = "Upload a JPEG, PNG, WebP, or GIF image.";
  }

  if (error.name === "CastError") {
    error.statusCode = 400;
    error.message = `Invalid ${error.path}`;
  }

  if (error.name === "ValidationError") {
    error.statusCode = 422;
    error.message = Object.values(error.errors)
      .map((entry) => entry.message)
      .join(", ");
  }

  const statusCode = error.statusCode || error.status || 500;
  const message = statusCode >= 500
    ? "An unexpected server error occurred. Please try again."
    : (error.message || "Request failed.");

  return sendResponse(res, statusCode, message, {
    details: process.env.NODE_ENV === "production" ? null : (error.details || null),
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
