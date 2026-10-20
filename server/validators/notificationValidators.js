const { param, query } = require("express-validator");

const notificationQueryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
];
const notificationIdValidator = [
  param("id").isMongoId().withMessage("Invalid notification ID"),
];

module.exports = { notificationQueryValidator, notificationIdValidator };
