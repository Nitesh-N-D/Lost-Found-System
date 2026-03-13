const Claim = require("../models/Claim");
const Item = require("../models/Item");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const populateClaim = (query) =>
  query
    .populate({
      path: "item",
      populate: { path: "reportedBy", select: "name email phone bio" },
    })
    .populate("claimant", "name email phone bio");

const createClaim = async (itemId, userId, message) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new AppError("Invalid item ID", 400);
  }

  const item = await Item.findById(itemId);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  if (item.reportedBy.toString() === userId.toString()) {
    throw new AppError("You cannot claim your own item", 400);
  }

  if (item.status !== "open") {
    throw new AppError("This item is no longer available for claims", 400);
  }

  const existingClaim = await Claim.findOne({ item: itemId, claimant: userId });
  if (existingClaim) {
    throw new AppError("You have already submitted a claim for this item", 409);
  }

  const claim = await Claim.create({
    item: itemId,
    claimant: userId,
    message,
  });

  await Chat.create({
    claim: claim._id,
    item: itemId,
    participants: [userId, item.reportedBy],
    messages: [
      {
        sender: userId,
        message,
      },
    ],
  });

  return populateClaim(Claim.findById(claim._id));
};

const getMyClaims = async (userId) =>
  populateClaim(Claim.find({ claimant: userId }).sort({ createdAt: -1 }));

const getReceivedClaims = async (userId) => {
  const items = await Item.find({ reportedBy: userId }).select("_id");
  const itemIds = items.map((item) => item._id);

  return populateClaim(
    Claim.find({ item: { $in: itemIds } }).sort({ createdAt: -1 })
  );
};

const updateClaimStatus = async (claimId, userId, status) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new AppError("Invalid claim ID", 400);
  }

  const claim = await populateClaim(Claim.findById(claimId));

  if (!claim) {
    throw new AppError("Claim not found", 404);
  }

  if (claim.item.reportedBy._id.toString() !== userId.toString()) {
    throw new AppError("Not authorized to manage this claim", 403);
  }

  claim.status = status;
  await claim.save();

  if (status === "approved") {
    await Item.findByIdAndUpdate(claim.item._id, { status: "claimed" });
    await Claim.updateMany(
      {
        item: claim.item._id,
        _id: { $ne: claim._id },
        status: "pending",
      },
      { status: "rejected" }
    );
  }

  return populateClaim(Claim.findById(claim._id));
};

module.exports = {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  updateClaimStatus,
};
