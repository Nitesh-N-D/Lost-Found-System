const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/apiResponse");
const adminService = require("../services/adminService");
const itemReportService = require("../services/itemReportService");

exports.getAdminDashboard = asyncHandler(async (_req, res) => {
  const dashboard = await adminService.getAdminDashboard();
  sendResponse(res, 200, "Admin dashboard fetched successfully", dashboard);
});

exports.banUser = asyncHandler(async (req, res) => {
  const user = await adminService.toggleUserBan(req.params.id, true);
  sendResponse(res, 200, "User banned successfully", user);
});

exports.unbanUser = asyncHandler(async (req, res) => {
  const user = await adminService.toggleUserBan(req.params.id, false);
  sendResponse(res, 200, "User unbanned successfully", user);
});

exports.deleteItem = asyncHandler(async (req, res) => {
  await adminService.removeItem(req.params.id);
  sendResponse(res, 200, "Item deleted successfully");
});

exports.updateItemReportStatus = asyncHandler(async (req, res) => {
  const report = await itemReportService.updateItemReportStatus(
    req.params.id,
    req.body.status
  );
  sendResponse(res, 200, "Listing report status updated successfully.", report);
});
