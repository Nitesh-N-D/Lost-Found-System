const { body, param } = require("express-validator");

const allowedReasons = [
  "incorrect_information",
  "possible_scam",
  "inappropriate_content",
  "duplicate_listing",
  "other",
];

const createItemReportValidator = [
  param("itemId").isMongoId().withMessage("Invalid item ID"),
  body("reason")
    .isIn(allowedReasons)
    .withMessage("Choose a valid reason for reporting this listing."),
  body("details")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Additional details cannot exceed 500 characters."),
];

module.exports = { createItemReportValidator };
