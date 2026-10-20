const express = require("express");
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  updateClaimStatus,
} = require("../controllers/claimController");
const validateRequest = require("../middleware/validateRequest");
const { updateRecoveryStatus } = require("../controllers/claimController");
const { updateRecoveryStatusValidator } = require("../validators/recoveryValidators");
const {
  createClaimValidator,
  updateClaimStatusValidator,
} = require("../validators/claimValidators");

const { protect } = require("../middleware/authMiddleware");

router.post("/:itemId", protect, createClaimValidator, validateRequest, createClaim);
router.get("/my-claims", protect, getMyClaims);
router.get("/received", protect, getReceivedClaims);
router.put("/:id", protect, updateClaimStatusValidator, validateRequest, updateClaimStatus);
router.patch("/:id/recovery", protect, updateRecoveryStatusValidator, validateRequest, updateRecoveryStatus);

module.exports = router;
