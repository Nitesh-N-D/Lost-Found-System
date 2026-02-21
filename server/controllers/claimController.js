const Claim = require("../models/Claim");
const Item = require("../models/Item");

// @desc Create claim request
// @route POST /api/claims/:itemId
// @access Private
exports.createClaim = async (req, res) => {
  try {
    const { message } = req.body;
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own item" });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      message,
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get claims made by logged user
// @route GET /api/claims/my-claims
// @access Private
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id })
      .populate("item")
      .populate("claimant", "name email");

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get claims received on my items
// @route GET /api/claims/received
// @access Private
exports.getReceivedClaims = async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id });

    const itemIds = items.map((item) => item._id);

    const claims = await Claim.find({ item: { $in: itemIds } })
      .populate("item")
      .populate("claimant", "name email");

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve or reject claim
// @route PUT /api/claims/:id
// @access Private (Item owner only)
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved or rejected

    const claim = await Claim.findById(req.params.id).populate("item");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (
      claim.item.reportedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    claim.status = status;
    await claim.save();

    if (status === "approved") {
      await Item.findByIdAndUpdate(claim.item._id, {
        status: "claimed",
      });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
