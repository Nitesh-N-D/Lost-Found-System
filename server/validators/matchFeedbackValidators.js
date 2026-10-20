const { body, param } = require("express-validator");

const matchFeedbackValidator = [
  param("id").isMongoId().withMessage("Invalid item ID"),
  param("matchedItemId").isMongoId().withMessage("Invalid matched item ID"),
  body("feedback").isIn(["helpful", "not_helpful"]).withMessage("Feedback must be helpful or not_helpful"),
  body("note").optional({ nullable: true }).isString().isLength({ max: 250 }).withMessage("Feedback note cannot exceed 250 characters"),
];

module.exports = { matchFeedbackValidator };
