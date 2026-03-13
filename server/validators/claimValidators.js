const { body, param } = require("express-validator");

const createClaimValidator = [
  param("itemId").isMongoId().withMessage("Invalid item ID"),
  body("message")
    .isLength({ min: 10, max: 500 })
    .withMessage("Claim message must be between 10 and 500 characters"),
];

const updateClaimStatusValidator = [
  param("id").isMongoId().withMessage("Invalid claim ID"),
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be approved or rejected"),
];

module.exports = {
  createClaimValidator,
  updateClaimStatusValidator,
};
