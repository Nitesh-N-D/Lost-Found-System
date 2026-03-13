const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");

const getUserDashboard = async (user) => {
  const [myItems, myClaims, totalUsers] = await Promise.all([
    Item.find({ reportedBy: user._id }).sort({ createdAt: -1 }),
    Claim.find({ claimant: user._id })
      .populate("item", "title status category")
      .sort({ createdAt: -1 }),
    User.countDocuments(),
  ]);

  const itemIds = myItems.map((item) => item._id);

  const [receivedClaims, openItems, recoveredItems] = await Promise.all([
    Claim.find({ item: { $in: itemIds } })
      .populate("item", "title status")
      .populate("claimant", "name email")
      .sort({ createdAt: -1 }),
    Item.countDocuments({ reportedBy: user._id, status: "open" }),
    Item.countDocuments({ reportedBy: user._id, status: "claimed" }),
  ]);

  return {
    overview: {
      totalItems: myItems.length,
      openItems,
      recoveredItems,
      totalClaimsMade: myClaims.length,
      totalClaimsReceived: receivedClaims.length,
      activeUsers: totalUsers,
    },
    myItems: myItems.slice(0, 5),
    myClaims: myClaims.slice(0, 5),
    receivedClaims: receivedClaims.slice(0, 5),
    notifications: [
      ...myClaims.map((claim) => ({
        id: `claim-${claim._id}`,
        title: `Claim ${claim.status}`,
        description: `Your claim for ${claim.item?.title || "an item"} is ${claim.status}.`,
        createdAt: claim.updatedAt,
      })),
      ...receivedClaims.map((claim) => ({
        id: `received-${claim._id}`,
        title: "New activity on your item",
        description: `${claim.claimant?.name || "A user"} submitted a ${claim.status} claim.`,
        createdAt: claim.updatedAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8),
  };
};

module.exports = {
  getUserDashboard,
};
