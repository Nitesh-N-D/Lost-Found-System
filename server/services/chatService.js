const Chat = require("../models/Chat");
const Claim = require("../models/Claim");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

const getAuthorizedChat = async (claimId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new AppError("Invalid claim ID", 400);
  }

  const claim = await Claim.findById(claimId).populate({
    path: "item",
    populate: {
      path: "reportedBy",
      select: "name email phone bio",
    },
  });

  if (!claim) {
    throw new AppError("Claim not found", 404);
  }

  const isOwner = claim.item.reportedBy?._id.toString() === userId.toString();
  const isClaimant = claim.claimant.toString() === userId.toString();

  if (!isOwner && !isClaimant) {
    throw new AppError("Not authorized to access this chat", 403);
  }

  let chat = await Chat.findOne({ claim: claimId })
    .populate("participants", "name email phone")
    .populate("messages.sender", "name email");

  if (!chat) {
    chat = await Chat.create({
      claim: claim._id,
      item: claim.item._id,
      participants: [claim.claimant, claim.item.reportedBy._id],
      messages: claim.message
        ? [
            {
              sender: claim.claimant,
              message: claim.message,
            },
          ]
        : [],
    });

    chat = await Chat.findOne({ claim: claimId })
      .populate("participants", "name email phone")
      .populate("messages.sender", "name email");
  }

  return { chat, claim };
};

const getClaimChat = async (claimId, userId) => {
  const { chat, claim } = await getAuthorizedChat(claimId, userId);

  return {
    chat,
    claimStatus: claim.status,
    contactUnlocked: claim.status === "approved",
    contact:
      claim.status === "approved"
        ? {
            phone: claim.item?.reportedBy?.phone || "",
          }
        : null,
  };
};

const sendMessage = async (claimId, userId, message) => {
  const { chat, claim } = await getAuthorizedChat(claimId, userId);

  chat.messages.push({
    sender: userId,
    message,
  });

  await chat.save();
  await chat.populate("messages.sender", "name email");

  return {
    chat,
    claimStatus: claim.status,
    contactUnlocked: claim.status === "approved",
    contact:
      claim.status === "approved"
        ? {
            phone: claim.item?.reportedBy?.phone || "",
          }
        : null,
  };
};

module.exports = {
  getClaimChat,
  sendMessage,
};
