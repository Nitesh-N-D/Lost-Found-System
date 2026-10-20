const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const itemReportService = require("../services/itemReportService");

exports.createItemReport = asyncHandler(async (req, res) => {
  const report = await itemReportService.createItemReport(
    req.params.itemId,
    req.user._id,
    req.body
  );
  sendResponse(res, 201, "Listing report submitted successfully.", report);
});
