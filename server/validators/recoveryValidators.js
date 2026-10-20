const { body, param } = require("express-validator");

const updateRecoveryStatusValidator = [
  param("id").isMongoId().withMessage("Invalid claim ID"),
  body("status")
    .isIn(["not_started", "handoff_arranged", "recovered", "disputed"])
    .withMessage("Invalid recovery status"),
  body("note")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 500 })
    .withMessage("Recovery note cannot exceed 500 characters"),
];

module.exports = { updateRecoveryStatusValidator };
