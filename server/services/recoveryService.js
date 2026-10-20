const mongoose = require("mongoose");
const Claim = require("../models/Claim");
const AppError = require("../utils/AppError");

const populateClaim = (query) =>
  query
    .populate({
      path: "item",
      populate: { path: "reportedBy", select: "name" },
    })
    .populate("claimant", "name")
    .populate("recoveryHistory.changedBy", "name");

const updateRecoveryStatus = async (claimId, user, payload) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new AppError("Invalid claim ID", 400);
  }

  const claim = await populateClaim(Claim.findById(claimId));
  if (!claim) throw new AppError("Claim not found", 404);
  if (!claim.item?.reportedBy) {
    throw new AppError("The item for this claim is no longer available.", 404);
  }
  if (claim.status !== "approved") {
    throw new AppError("Recovery tracking is available only for approved claims.", 409);
  }

  const userId = String(user._id);
  const ownerId = String(claim.item.reportedBy._id || claim.item.reportedBy);
  const claimantId = String(claim.claimant._id || claim.claimant);
  if (userId !== ownerId && userId !== claimantId) {
    throw new AppError("Only the item owner and claimant can update recovery progress.", 403);
  }

  const recoveryStatus = payload.status;
  const recoveryNote = String(payload.note || "").trim();
  if ((claim.recoveryStatus || "not_started") === recoveryStatus && (claim.recoveryNote || "") === recoveryNote) {
    return claim;
  }

  const changedAt = new Date();
  const update = {
    $set: {
      recoveryStatus,
      recoveryNote,
      recoveredAt: recoveryStatus === "recovered" ? changedAt : null,
      ...(recoveryStatus === "disputed" ? { issueReported: true } : {}),
    },
    $push: {
      recoveryHistory: {
        status: recoveryStatus,
        note: recoveryNote,
        changedBy: user._id,
        changedAt,
      },
    },
  };

  const updated = await Claim.findOneAndUpdate(
    { _id: claim._id, status: "approved" },
    update,
    { new: true, runValidators: true }
  );
  if (!updated) throw new AppError("Claim status changed; refresh and try again.", 409);

  return populateClaim(Claim.findById(updated._id));
};

module.exports = { updateRecoveryStatus };
