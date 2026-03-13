const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const authService = require("../services/authService");

exports.registerUser = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  sendResponse(res, 201, "Account created successfully", user);
});

exports.loginUser = asyncHandler(async (req, res) => {
  const user = await authService.loginUser(req.body);
  sendResponse(res, 200, "Login successful", user);
});

exports.getProfile = asyncHandler(async (req, res) => {
  sendResponse(res, 200, "Profile fetched successfully", req.user);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const profile = await authService.updateProfile(req.user._id, req.body);
  sendResponse(res, 200, "Profile updated successfully", profile);
});
