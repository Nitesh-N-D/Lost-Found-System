const sendResponse = require("../utils/apiResponse");

const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
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

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  sendResponse(res, statusCode, message, {
    details: error.details || null,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
