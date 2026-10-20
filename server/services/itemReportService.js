const mongoose = require("mongoose");
const Item = require("../models/Item");
const ItemReport = require("../models/ItemReport");
const AppError = require("../utils/AppError");

const createItemReport = async (itemId, userId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new AppError("Invalid item ID", 400);
  }

  const item = await Item.findById(itemId).select("_id");
  if (!item) {
    throw new AppError("Item not found", 404);
  }

  const existingReport = await ItemReport.findOne({
    item: itemId,
    reportedBy: userId,
    status: "open",
  }).select("_id");

  if (existingReport) {
    throw new AppError("You already have an open report for this listing.", 409);
  }

  try {
    return await ItemReport.create({
      item: itemId,
      reportedBy: userId,
      reason: payload.reason,
      details: (payload.details || "").trim(),
    });
  } catch (error) {
    // The unique partial index also protects against simultaneous duplicate submissions.
    if (error.code === 11000) {
      throw new AppError("You already have an open report for this listing.", 409);
    }
    throw error;
  }
};

const listItemReports = async () =>
  ItemReport.find()
    .populate("item", "title type status")
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(100);

const updateItemReportStatus = async (reportId, status) => {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    throw new AppError("Invalid report ID", 400);
  }

  const report = await ItemReport.findByIdAndUpdate(
    reportId,
    { $set: { status } },
    { new: true, runValidators: true }
  )
    .populate("item", "title type status")
    .populate("reportedBy", "name email");

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  return report;
};

module.exports = {
  createItemReport,
  listItemReports,
  updateItemReportStatus,
};
