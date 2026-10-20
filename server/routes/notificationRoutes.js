const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const {
  notificationQueryValidator,
  notificationIdValidator,
} = require("../validators/notificationValidators");
const router = express.Router();

router.use(protect);
router.get("/", notificationQueryValidator, validateRequest, listNotifications);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", notificationIdValidator, validateRequest, markNotificationRead);
router.delete("/:id", notificationIdValidator, validateRequest, deleteNotification);

module.exports = router;
