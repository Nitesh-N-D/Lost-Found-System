const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
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

module.exports = router;
