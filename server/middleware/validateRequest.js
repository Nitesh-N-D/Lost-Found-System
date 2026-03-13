const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validateRequest = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next(new AppError("Validation failed", 422, result.array()));
  }

  next();
};

module.exports = validateRequest;
