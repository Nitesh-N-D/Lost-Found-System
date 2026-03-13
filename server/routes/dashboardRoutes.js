const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getMyDashboardItems,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getDashboard);
router.get("/items", protect, getMyDashboardItems);

module.exports = router;
