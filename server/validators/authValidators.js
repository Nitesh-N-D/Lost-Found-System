const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6, max: 64 })
    .withMessage("Password must be between 6 and 64 characters"),
  body("phone")
    .optional({ values: "falsy" })
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters"),
];

const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileValidator = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("phone")
    .optional({ values: "falsy" })
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters"),
  body("bio")
    .optional({ values: "falsy" })
    .isLength({ max: 220 })
    .withMessage("Bio cannot exceed 220 characters"),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
};
