const express = require("express");
const { param } = require("express-validator");
const {
  getAdminDashboard,
  banUser,
  unbanUser,
  deleteItem,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();
const idValidator = [param("id").isMongoId().withMessage("Invalid ID")];

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
router.delete("/items/:id", protect, adminOnly, idValidator, validateRequest, deleteItem);

module.exports = router;
