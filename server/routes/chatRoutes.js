const express = require("express");
const {
  getChat,
  sendMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  claimIdValidator,
  sendMessageValidator,
} = require("../validators/chatValidators");

const router = express.Router();

router.get("/:claimId", protect, claimIdValidator, validateRequest, getChat);
router.post(
  "/:claimId/messages",
  protect,
  sendMessageValidator,
  validateRequest,
  sendMessage
);

module.exports = router;
