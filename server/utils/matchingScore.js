const normalize = (value) => String(value || "")
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const tokens = (value) => new Set(
  normalize(value).split(/\s+/).filter((word) => word.length > 1)
);

const overlapScore = (left, right, maximum) => {
  const leftTokens = tokens(left);
  const rightTokens = tokens(right);
  if (!leftTokens.size || !rightTokens.size) return 0;
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return Math.round((intersection / Math.max(leftTokens.size, rightTokens.size)) * maximum);
};

const scoreItemMatch = (item, candidate) => {
  if (!item || !candidate || String(item._id) === String(candidate._id)) return 0;
  if (!["lost", "found"].includes(item.type) || !["lost", "found"].includes(candidate.type)) return 0;
  if (item.type === candidate.type || (candidate.status && candidate.status !== "open")) return 0;

  let score = 0;
  const itemCategory = normalize(item.category);
  const candidateCategory = normalize(candidate.category);
  if (itemCategory && candidateCategory) {
    if (itemCategory === candidateCategory) score += 25;
    else if (itemCategory.includes(candidateCategory) || candidateCategory.includes(itemCategory)) score += 15;
  }

  score += overlapScore(item.title, candidate.title, 25);
  score += overlapScore(item.description, candidate.description, 20);
  score += overlapScore(item.location, candidate.location, 20);

  const itemDate = new Date(item.date).getTime();
  const candidateDate = new Date(candidate.date).getTime();
  if (Number.isFinite(itemDate) && Number.isFinite(candidateDate)) {
    const daysApart = Math.abs(itemDate - candidateDate) / 86400000;
    if (daysApart <= 7) score += 10;
    else if (daysApart <= 30) score += 5;
  }

  return Math.min(100, score);
};

module.exports = { scoreItemMatch };
