const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validateRequest = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const messages = [...new Set(result.array().map((entry) => entry.msg))];
    return next(new AppError(messages.join(". "), 422));
  }

  next();
};

module.exports = validateRequest;
