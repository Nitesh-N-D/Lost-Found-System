import api, { unwrap } from "./api";

export const chatService = {
  getByClaim: (claimId) => unwrap(api.get(`/chats/${claimId}`)),
  sendMessage: (claimId, payload) =>
    unwrap(api.post(`/chats/${claimId}/messages`, payload)),
};
