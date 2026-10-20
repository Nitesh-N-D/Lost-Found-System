import api, { unwrap } from "./api";

export const notificationService = {
  list: (params) => unwrap(api.get("/notifications", { params })),
  markRead: (notificationId) => unwrap(api.patch("/notifications/" + notificationId + "/read")),
  markAllRead: () => unwrap(api.patch("/notifications/read-all")),
};
