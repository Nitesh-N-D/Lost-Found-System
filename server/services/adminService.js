const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const ItemReport = require("../models/ItemReport");
const AppError = require("../utils/AppError");
const itemService = require("./itemService");

const getAdminDashboard = async () => {
  const [
    users,
    items,
    claims,
    totalUsers,
    bannedUsers,
    totalItems,
    openItems,
    activeClaims,
    itemReports,
  ] = await Promise.all([
    User.find().sort({ createdAt: -1 }).select("-password"),
    Item.find().populate("reportedBy", "name email").sort({ createdAt: -1 }).limit(20),
    Claim.find()
      .populate("item", "title status")
      .populate("claimant", "name email")
      .sort({ createdAt: -1 })
      .limit(20),
    User.countDocuments(),
    User.countDocuments({ isBanned: true }),
    Item.countDocuments(),
    Item.countDocuments({ status: "open" }),
    Claim.countDocuments({ status: "pending" }),
    ItemReport.find()
      .populate("item", "title type status")
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(50),
  ]);

  return {
    stats: {
      totalUsers,
      bannedUsers,
      totalItems,
      openItems,
      activeClaims,
      openReports: itemReports.filter((report) => report.status === "open").length,
    },
    users,
    items,
    claims,
    itemReports,
  };
};

const toggleUserBan = async (userId, isBanned) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const configuredAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (
    isBanned &&
    (user.role === "admin" || configuredAdmins.includes(user.email.toLowerCase()))
  ) {
    throw new AppError("Administrator accounts cannot be banned.", 409);
  }

  user.isBanned = isBanned;
  await user.save();

  return user;
};

const removeItem = async (itemId) => {
  return itemService.deleteItem(itemId, { role: "admin" });
};

module.exports = {
  getAdminDashboard,
  toggleUserBan,
  removeItem,
};
