const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { createItemReport } = require("../controllers/itemReportController");
const { createItemReportValidator } = require("../validators/itemReportValidators");

const router = express.Router();

router.post(
  "/items/:itemId",
  protect,
  createItemReportValidator,
  validateRequest,
  createItemReport
);

module.exports = router;
