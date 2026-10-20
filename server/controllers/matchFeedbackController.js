const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const matchFeedbackService = require("../services/matchFeedbackService");

exports.submitMatchFeedback = asyncHandler(async (req, res) => {
  const feedback = await matchFeedbackService.saveMatchFeedback(
    req.params.id,
    req.params.matchedItemId,
    req.user,
    req.body
  );
  sendResponse(res, 200, "Match feedback saved", feedback);
});
