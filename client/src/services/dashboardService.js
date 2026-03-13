import api, { unwrap } from "./api";

export const dashboardService = {
  getOverview: () => unwrap(api.get("/dashboard")),
};
