const { body, param } = require("express-validator");

const claimIdValidator = [
  param("claimId").isMongoId().withMessage("Invalid claim ID"),
];

const sendMessageValidator = [
  param("claimId").isMongoId().withMessage("Invalid claim ID"),
  body("message")
    .isLength({ min: 1, max: 500 })
    .withMessage("Message must be between 1 and 500 characters"),
];

module.exports = {
  claimIdValidator,
  sendMessageValidator,
};
