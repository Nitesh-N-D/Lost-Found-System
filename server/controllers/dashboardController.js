const Item = require("../models/Item");
const Claim = require("../models/Claim");

// @desc Get dashboard summary
// @route GET /api/dashboard
// @access Private
exports.getDashboard = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments({
      reportedBy: req.user._id,
    });

    const openItems = await Item.countDocuments({
      reportedBy: req.user._id,
      status: "open",
    });

    const claimedItems = await Item.countDocuments({
      reportedBy: req.user._id,
      status: "claimed",
    });

    const myClaims = await Claim.countDocuments({
      claimant: req.user._id,
    });

    const receivedClaims = await Claim.countDocuments({
      item: { 
        $in: (await Item.find({ reportedBy: req.user._id })).map(
          (item) => item._id
        ),
      },
    });

    res.json({
      totalItems,
      openItems,
      claimedItems,
      myClaims,
      receivedClaims,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
