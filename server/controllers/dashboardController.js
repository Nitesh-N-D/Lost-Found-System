const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const dashboardService = require("../services/dashboardService");
const itemService = require("../services/itemService");

exports.getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getUserDashboard(req.user);
  sendResponse(res, 200, "Dashboard fetched successfully", dashboard);
});

exports.getMyDashboardItems = asyncHandler(async (req, res) => {
  const items = await itemService.getMyItems(req.user._id);
  sendResponse(res, 200, "Dashboard items fetched successfully", items);
});
