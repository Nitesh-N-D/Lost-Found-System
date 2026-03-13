const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const AppError = require("../utils/AppError");

const getAdminDashboard = async () => {
  const [users, items, claims] = await Promise.all([
    User.find().sort({ createdAt: -1 }).select("-password"),
    Item.find().populate("reportedBy", "name email").sort({ createdAt: -1 }),
    Claim.find()
      .populate("item", "title status")
      .populate("claimant", "name email")
      .sort({ createdAt: -1 }),
  ]);

  return {
    stats: {
      totalUsers: users.length,
      bannedUsers: users.filter((user) => user.isBanned).length,
      totalItems: items.length,
      openItems: items.filter((item) => item.status === "open").length,
      activeClaims: claims.filter((claim) => claim.status === "pending").length,
    },
    users,
    items: items.slice(0, 20),
    claims: claims.slice(0, 20),
  };
};

const toggleUserBan = async (userId, isBanned) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isBanned },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const removeItem = async (itemId) => {
  const item = await Item.findById(itemId);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  await item.deleteOne();
};

module.exports = {
  getAdminDashboard,
  toggleUserBan,
  removeItem,
};
