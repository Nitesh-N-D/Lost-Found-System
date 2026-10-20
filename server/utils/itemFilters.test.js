const test = require("node:test");
const assert = require("node:assert/strict");
const { buildItemFilters } = require("./itemFilters");

test("builds safe keyword and structured item filters", () => {
  const filters = buildItemFilters({
    keyword: "wallet.*",
    type: "lost",
    category: "ID card",
    location: "Main Hall",
    status: "open",
  });

  assert.equal(filters.type, "lost");
  assert.equal(filters.status, "open");
  assert.equal(filters.category.$options, "i");
  assert.equal(filters.location.$options, "i");
  assert.equal(filters.$or[0].title.$regex, "wallet\\.\\*");
});

test("includes the full end date for date-only range filters", () => {
  const filters = buildItemFilters({ dateFrom: "2026-10-01", dateTo: "2026-10-20" });

  assert.equal(filters.date.$gte.toISOString(), "2026-10-01T00:00:00.000Z");
  assert.equal(filters.date.$lte.toISOString(), "2026-10-20T23:59:59.999Z");
});

test("rejects a reversed date range", () => {
  assert.throws(
    () => buildItemFilters({ dateFrom: "2026-10-20", dateTo: "2026-10-01" }),
    { message: "Start date must be on or before end date.", statusCode: 400 }
  );
});
