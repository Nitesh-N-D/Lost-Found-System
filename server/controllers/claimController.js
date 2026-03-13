const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const claimService = require("../services/claimService");

exports.createClaim = asyncHandler(async (req, res) => {
  const claim = await claimService.createClaim(
    req.params.itemId,
    req.user._id,
    req.body.message
  );
  sendResponse(res, 201, "Claim submitted successfully", claim);
});

exports.getMyClaims = asyncHandler(async (req, res) => {
  const claims = await claimService.getMyClaims(req.user._id);
  sendResponse(res, 200, "Claims fetched successfully", claims);
});

exports.getReceivedClaims = asyncHandler(async (req, res) => {
  const claims = await claimService.getReceivedClaims(req.user._id);
  sendResponse(res, 200, "Received claims fetched successfully", claims);
});

exports.updateClaimStatus = asyncHandler(async (req, res) => {
  const claim = await claimService.updateClaimStatus(
    req.params.id,
    req.user._id,
    req.body.status
  );
  sendResponse(res, 200, "Claim updated successfully", claim);
});
