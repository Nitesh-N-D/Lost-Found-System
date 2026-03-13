const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const chatService = require("../services/chatService");

exports.getChat = asyncHandler(async (req, res) => {
  const chat = await chatService.getClaimChat(req.params.claimId, req.user._id);
  sendResponse(res, 200, "Chat fetched successfully", chat);
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const chat = await chatService.sendMessage(
    req.params.claimId,
    req.user._id,
    req.body.message
  );
  sendResponse(res, 201, "Message sent successfully", chat);
});
