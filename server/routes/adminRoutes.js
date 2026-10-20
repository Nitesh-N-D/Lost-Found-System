const express = require("express");
const { body, param } = require("express-validator");
const {
  getAdminDashboard,
  banUser,
  unbanUser,
  deleteItem,
  updateItemReportStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();
const idValidator = [param("id").isMongoId().withMessage("Invalid ID")];
const reportStatusValidator = [
  ...idValidator,
  body("status")
    .isIn(["reviewed", "dismissed"])
    .withMessage("Status must be reviewed or dismissed."),
];

router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.put("/users/:id/ban", protect, adminOnly, idValidator, validateRequest, banUser);
router.put(
  "/users/:id/unban",
  protect,
  adminOnly,
  idValidator,
  validateRequest,
  unbanUser
);
router.put(
  "/reports/:id",
  protect,
  adminOnly,
  reportStatusValidator,
  validateRequest,
  updateItemReportStatus
);
router.delete("/items/:id", protect, adminOnly, idValidator, validateRequest, deleteItem);

module.exports = router;
