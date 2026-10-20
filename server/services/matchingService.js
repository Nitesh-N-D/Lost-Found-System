const Item = require("../models/Item");
const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");
const { scoreItemMatch } = require("../utils/matchingScore");

const MIN_MATCH_SCORE = 30;
const MAX_MATCHES = 5;

const getMatchesForItem = async (itemId, user, limit = MAX_MATCHES) => {
  const item = await Item.findById(itemId).populate("reportedBy", "name");
  if (!item) throw new AppError("Item not found", 404);

  const reporterId = item.reportedBy?._id || item.reportedBy;
  const isOwner = String(reporterId) === String(user._id);
  if (!isOwner && user.role !== "admin") {
    throw new AppError("You can only view matches for your own reports", 403);
  }
  if (item.status !== "open") return [];

  const candidates = await Item.find({
    _id: { $ne: item._id },
    type: item.type === "lost" ? "found" : "lost",
    status: "open",
    reportedBy: { $ne: reporterId },
  }).populate("reportedBy", "name").sort({ createdAt: -1 }).limit(250);

  return candidates
    .map((candidate) => ({ item: candidate, score: scoreItemMatch(item, candidate) }))
    .filter((match) => match.score >= MIN_MATCH_SCORE)
    .sort((a, b) => b.score - a.score || new Date(b.item.createdAt) - new Date(a.item.createdAt))
    .slice(0, Math.min(Math.max(Number(limit) || MAX_MATCHES, 1), MAX_MATCHES));
};

const notifyPotentialMatches = async (item) => {
  const candidates = await Item.find({
    _id: { $ne: item._id },
    type: item.type === "lost" ? "found" : "lost",
    status: "open",
    reportedBy: { $ne: item.reportedBy },
  }).sort({ createdAt: -1 }).limit(250);

  const writes = [];
  for (const candidate of candidates) {
    const score = scoreItemMatch(item, candidate);
    if (score < MIN_MATCH_SCORE) continue;
    const matchedItem = String(candidate._id);
    const newItem = String(item._id);
    const currentReporter = String(item.reportedBy);
    const otherReporter = String(candidate.reportedBy);

    const notifications = [
      {
        user: currentReporter,
        type: "potential_match",
        item: newItem,
        matchedItem,
        title: "A possible match was found",
        message: '"' + candidate.title + '" may match your ' + item.type + " report (" + score + "% match).",
        matchScore: score,
      },
      {
        user: otherReporter,
        type: "potential_match",
        item: matchedItem,
        matchedItem: newItem,
        title: "A new possible match was posted",
        message: '"' + item.title + '" may match your ' + candidate.type + " report (" + score + "% match).",
        matchScore: score,
      },
    ];

    for (const notification of notifications) {
      writes.push({
        updateOne: {
          filter: {
            user: notification.user,
            item: notification.item,
            matchedItem: notification.matchedItem,
            type: notification.type,
          },
          update: { $setOnInsert: notification },
          upsert: true,
        },
      });
    }
  }

  if (writes.length) await Notification.bulkWrite(writes, { ordered: false });
};

module.exports = { getMatchesForItem, notifyPotentialMatches, MIN_MATCH_SCORE };
