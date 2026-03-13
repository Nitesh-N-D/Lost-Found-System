const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} = require("../validators/authValidators");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfileValidator, validateRequest, updateProfile);

module.exports = router;
