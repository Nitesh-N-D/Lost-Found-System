const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const ItemReport = require("../models/ItemReport");
const AppError = require("../utils/AppError");
const itemService = require("./itemService");
const { toCsv } = require("../utils/csv");

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

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [itemsByCategory, itemsByType, claimsByStatus, monthlyItems] = await Promise.all([
    Item.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }, { $limit: 8 }]),
    Item.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }]),
    Claim.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    Item.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    analytics: { itemsByCategory, itemsByType, claimsByStatus, monthlyItems },
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

const exportItemsCsv = async () => {
  const items = await Item.find()
    .select("title type category status date createdAt location")
    .sort({ createdAt: -1 })
    .limit(10000)
    .lean();
  return toCsv(
    ["title", "type", "category", "status", "date", "createdAt", "location"],
    items.map((item) => [
      item.title,
      item.type,
      item.category,
      item.status,
      item.date,
      item.createdAt,
      item.location,
    ])
  );
};

module.exports = {
  getAdminDashboard,
  toggleUserBan,
  removeItem,
  exportItemsCsv,
};
