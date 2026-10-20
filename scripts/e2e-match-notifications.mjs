const apiBase = process.env.E2E_BASE_URL?.replace(/\/+$/, "");
const accountA = { email: process.env.E2E_USER_A_EMAIL, password: process.env.E2E_USER_A_PASSWORD };
const accountB = { email: process.env.E2E_USER_B_EMAIL, password: process.env.E2E_USER_B_PASSWORD };

if (!apiBase || !accountA.email || !accountA.password || !accountB.email || !accountB.password) {
  console.error("Set E2E_BASE_URL and E2E_USER_A_EMAIL/PASSWORD plus E2E_USER_B_EMAIL/PASSWORD.");
  process.exit(2);
}
if (apiBase.includes("lost-found-system-8q05.onrender.com") && process.env.E2E_ALLOW_PRODUCTION_WRITES !== "1") {
  console.error("Refusing to create test listings on production. Use an isolated staging deployment, or explicitly set E2E_ALLOW_PRODUCTION_WRITES=1 after reviewing the impact.");
  process.exit(2);
}

const request = async (path, { token, method = "GET", body } = {}) => {
  const response = await fetch(apiBase + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${payload.message || "unknown error"}`);
  }
  return payload?.data ?? payload;
};

const login = async (account) => {
  const result = await request("/api/auth/login", {
    method: "POST",
    body: account,
  });
  if (!result?.token) throw new Error("Login response did not contain a token.");
  return result.token;
};

const itemPayload = (type, suffix) => ({
  title: `E2E ${suffix} black leather wallet`,
  description: `Test report for a black leather wallet with a blue student card inside, created by the matching workflow check ${suffix}.`,
  category: "Wallet",
  type,
  location: "E2E Central Library Test Area",
  date: new Date().toISOString(),
});

const idOf = (value) => String(value?._id || value?.id || value || "");

const main = async () => {
  const [tokenA, tokenB] = await Promise.all([login(accountA), login(accountB)]);
  let itemA;
  let itemB;
  let failed = false;
  try {
    itemA = await request("/api/items", { token: tokenA, method: "POST", body: itemPayload("lost", "lost") });
    itemB = await request("/api/items", { token: tokenB, method: "POST", body: itemPayload("found", "found") });
    const itemAId = idOf(itemA);
    const itemBId = idOf(itemB);
    if (!itemAId || !itemBId) throw new Error("Item creation response did not include item IDs.");

    const [matchesA, matchesB, inboxA, inboxB] = await Promise.all([
      request(`/api/items/${itemAId}/matches`, { token: tokenA }),
      request(`/api/items/${itemBId}/matches`, { token: tokenB }),
      request("/api/notifications?limit=50", { token: tokenA }),
      request("/api/notifications?limit=50", { token: tokenB }),
    ]);

    const hasMatch = (result, expectedId) => Array.isArray(result) && result.some((match) =>
      idOf(match.item) === expectedId || idOf(match) === expectedId
    );
    const hasAlert = (result, ownId, otherId) => (result?.notifications || []).some((notification) =>
      idOf(notification.item) === ownId && idOf(notification.matchedItem) === otherId
    );

    const checks = [
      ["Account A sees Account B's found report as a match", hasMatch(matchesA, itemBId)],
      ["Account B sees Account A's lost report as a match", hasMatch(matchesB, itemAId)],
      ["Account A receives a persistent match notification", hasAlert(inboxA, itemAId, itemBId)],
      ["Account B receives a persistent match notification", hasAlert(inboxB, itemBId, itemAId)],
    ];
    for (const [label, passed] of checks) console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
    failed = checks.some(([, passed]) => !passed);
  } finally {
    // Remove only notifications whose item pair was created by this run.
    const createdIds = new Set([idOf(itemA), idOf(itemB)].filter(Boolean));
    for (const [token, ownId, otherId] of [[tokenA, idOf(itemA), idOf(itemB)], [tokenB, idOf(itemB), idOf(itemA)]]) {
      if (!ownId || !otherId) continue;
      try {
        const inbox = await request("/api/notifications?limit=50", { token });
        for (const notification of inbox.notifications || []) {
          if (idOf(notification.item) === ownId && idOf(notification.matchedItem) === otherId) {
            await request(`/api/notifications/${idOf(notification) }`, { token, method: "DELETE" });
          }
        }
      } catch (error) {
        failed = true;
        console.error(`Cleanup failed for test notifications: ${error.message}`);
      }
    }
    // Always attempt to remove only the two reports created by this run.
    for (const [id, token] of [[idOf(itemA), tokenA], [idOf(itemB), tokenB]]) {
      if (!id || id === "[object Object]") continue;
      try {
        await request(`/api/items/${id}`, { token, method: "DELETE" });
      } catch (error) {
        failed = true;
        console.error(`Cleanup failed for test item ${id}: ${error.message}`);
      }
    }
  }
  if (failed) process.exitCode = 1;
};

main().catch((error) => {
  console.error(`E2E matching test failed: ${error.message}`);
  process.exitCode = 1;
});
