const { body, param, query } = require("express-validator");

const createItemValidator = [
  body("title").trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),
  body("description").trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category").trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category is required"),
  body("type")
    .isIn(["lost", "found"])
    .withMessage("Type must be either lost or found"),
  body("location").trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Location is required"),
  body("date").isISO8601().withMessage("A valid date is required"),
];

const updateItemValidator = [
  param("id").isMongoId().withMessage("Invalid item ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("status")
    .optional()
    .isIn(["open", "claimed", "closed"])
    .withMessage("Invalid status"),
  body("category").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Category must be between 2 and 50 characters"),
  body("location").optional().trim().isLength({ min: 2, max: 120 }).withMessage("Location must be between 2 and 120 characters"),
  body("type").optional().isIn(["lost", "found"]).withMessage("Invalid item type"),
  body("date").optional().isISO8601().withMessage("A valid date is required"),
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
  query("keyword").optional().isString().isLength({ max: 80 }).withMessage("Search terms cannot exceed 80 characters"),
  query("category").optional().isString().isLength({ max: 50 }).withMessage("Category filter is too long"),
  query("location").optional().isString().isLength({ max: 120 }).withMessage("Location filter is too long"),
];

module.exports = {
  createItemValidator,
  updateItemValidator,
  itemIdValidator,
  itemQueryValidator,
};
