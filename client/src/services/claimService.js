import api, { unwrap } from "./api";

export const claimService = {
  create: (itemId, payload) => unwrap(api.post(`/claims/${itemId}`, payload)),
  getMine: () => unwrap(api.get("/claims/my-claims")),
  getReceived: () => unwrap(api.get("/claims/received")),
  updateStatus: (claimId, payload) => unwrap(api.put(`/claims/${claimId}`, payload)),
};
