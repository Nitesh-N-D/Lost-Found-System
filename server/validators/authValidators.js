const { body } = require("express-validator");

const registerValidator = [
  body("name").trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6, max: 64 })
    .withMessage("Password must be between 6 and 64 characters")
    .bail()
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 UTF-8 bytes"),
  body("phone").optional({ values: "falsy" }).trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters"),
];

const loginValidator = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ max: 64 })
    .withMessage("Password must not exceed 64 characters")
    .bail()
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 UTF-8 bytes"),
];

const updateProfileValidator = [
  body("name").optional().trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("phone").optional({ values: "falsy" }).trim()
    .isLength({ min: 7, max: 20 })
    .withMessage("Phone number must be between 7 and 20 characters"),
  body("bio").optional({ values: "falsy" }).trim()
    .isLength({ max: 220 })
    .withMessage("Bio cannot exceed 220 characters"),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
};
