const test = require("node:test");
const assert = require("node:assert/strict");
const Claim = require("../models/Claim");
const recoveryService = require("./recoveryService");

const claimId = "651234567890abcdef123456";
const ownerId = "651234567890abcdef123457";
const claimantId = "651234567890abcdef123458";
const itemId = "651234567890abcdef123459";

const approvedClaim = () => ({
  _id: claimId,
  status: "approved",
  recoveryStatus: "not_started",
  recoveryNote: "",
  item: { _id: itemId, status: "claimed", reportedBy: { _id: ownerId, name: "Owner" } },
  claimant: { _id: claimantId, name: "Claimant" },
  recoveryHistory: [],
});

const queryFor = (value) => ({
  populate() { return this; },
  then(resolve, reject) { return Promise.resolve(value).then(resolve, reject); },
});

test("records recovery progress and an audit entry for an authorized participant", async (t) => {
  const originalFindById = Claim.findById;
  const originalFindOneAndUpdate = Claim.findOneAndUpdate;
  let findCount = 0;
  let capturedFilter;
  let capturedUpdate;
  let capturedOptions;
  Claim.findById = () => {
    findCount += 1;
    const claim = approvedClaim();
    if (findCount > 1) {
      claim.recoveryStatus = "recovered";
      claim.recoveryNote = "Handed over at the campus office";
      claim.recoveredAt = new Date();
      claim.recoveryHistory = [{ status: "recovered", note: claim.recoveryNote, changedBy: claimantId }];
    }
    return queryFor(claim);
  };
  Claim.findOneAndUpdate = async (filter, update, options) => {
    capturedFilter = filter;
    capturedUpdate = update;
    capturedOptions = options;
    return { _id: claimId };
  };
  t.after(() => {
    Claim.findById = originalFindById;
    Claim.findOneAndUpdate = originalFindOneAndUpdate;
  });

  const result = await recoveryService.updateRecoveryStatus(claimId, { _id: claimantId }, {
    status: "recovered",
    note: "Handed over at the campus office",
  });

  assert.equal(capturedFilter._id, claimId);
  assert.equal(capturedFilter.status, "approved");
  assert.equal(capturedUpdate.$set.recoveryStatus, "recovered");
  assert.equal(capturedUpdate.$set.recoveryNote, "Handed over at the campus office");
  assert.ok(capturedUpdate.$set.recoveredAt instanceof Date);
  assert.equal(capturedUpdate.$push.recoveryHistory.status, "recovered");
  assert.equal(capturedUpdate.$push.recoveryHistory.changedBy, claimantId);
  assert.equal(capturedOptions.runValidators, true);
  assert.equal(result.recoveryStatus, "recovered");
});

test("rejects recovery updates from a user who is neither claimant nor owner", async (t) => {
  const originalFindById = Claim.findById;
  const originalFindOneAndUpdate = Claim.findOneAndUpdate;
  Claim.findById = () => queryFor(approvedClaim());
  Claim.findOneAndUpdate = async () => assert.fail("unauthorized updates must not write");
  t.after(() => {
    Claim.findById = originalFindById;
    Claim.findOneAndUpdate = originalFindOneAndUpdate;
  });

  await assert.rejects(
    recoveryService.updateRecoveryStatus(claimId, { _id: "651234567890abcdef123450" }, { status: "disputed" }),
    { message: "Only the item owner and claimant can update recovery progress.", statusCode: 403 }
  );
});

test("requires an approved claim before recovery tracking", async (t) => {
  const originalFindById = Claim.findById;
  Claim.findById = () => queryFor({ ...approvedClaim(), status: "pending" });
  t.after(() => { Claim.findById = originalFindById; });

  await assert.rejects(
    recoveryService.updateRecoveryStatus(claimId, { _id: claimantId }, { status: "handoff_arranged" }),
    { message: "Recovery tracking is available only for approved claims.", statusCode: 409 }
  );
});
