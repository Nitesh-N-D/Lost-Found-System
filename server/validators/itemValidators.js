const { body, param, query } = require("express-validator");

const createItemValidator = [
  body("title")
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),
  body("description")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category is required"),
  body("type")
    .isIn(["lost", "found"])
    .withMessage("Type must be either lost or found"),
  body("location")
    .isLength({ min: 2, max: 120 })
    .withMessage("Location is required"),
  body("date").isISO8601().withMessage("A valid date is required"),
];

const updateItemValidator = [
  param("id").isMongoId().withMessage("Invalid item ID"),
  body("title")
    .optional()
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),
  body("description")
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("status")
    .optional()
    .isIn(["open", "claimed", "closed"])
    .withMessage("Invalid status"),
];

const itemIdValidator = [param("id").isMongoId().withMessage("Invalid item ID")];

const itemQueryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage("Limit must be between 1 and 24"),
  query("type")
    .optional()
    .isIn(["lost", "found"])
    .withMessage("Invalid item type"),
  query("status")
    .optional()
    .isIn(["open", "claimed", "closed"])
    .withMessage("Invalid status"),
];

module.exports = {
  createItemValidator,
  updateItemValidator,
  itemIdValidator,
  itemQueryValidator,
};
